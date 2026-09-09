import assert from "node:assert/strict";
import {mkdtemp,mkdir,writeFile,readFile,rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {inspectSarif,checkSarifDirectory,formatSummary} from "../scripts/check-codeql-results.mjs";

const execute = promisify(execFile);
const script = fileURLToPath(new URL("../scripts/check-codeql-results.mjs",import.meta.url));
const document = (results = []) => ({version:"2.1.0",runs:[{tool:{driver:{name:"CodeQL",rules:[{id:"js/canary",defaultConfiguration:{level:"warning"},properties:{"security-severity":"7.8"}}]}},results}]});
const finding = overrides => ({ruleId:"js/canary",ruleIndex:0,message:{text:"Fixture de comprobación"},locations:[{physicalLocation:{artifactLocation:{uri:"tests/canary.js"},region:{startLine:7}}}],...overrides});
let passed = 0;
const check = async (name,fn) => { await fn(); passed++; console.log("OK " + name); };

await check("SARIF: cero resultados válidos se distingue de una salida vacía o inválida",() => {
  assert.deepEqual(inspectSarif(document()),{runs:1,findings:[]});
  for (const invalid of [null,{},[],{version:"2.0.0",runs:[]},{version:"2.1.0",runs:[]},{version:"2.1.0",runs:[{}]},document(null)]) assert.throws(() => inspectSarif(invalid));
  const missingResults = document();
  delete missingResults.runs[0].results;
  assert.throws(() => inspectSarif(missingResults));
  assert.throws(() => inspectSarif(document([{}])));
});

await check("SARIF: todo resultado bloquea, sin excepciones por nivel, baseline o supresión",() => {
  for (const level of ["none","note","warning","error"]) {
    const output = inspectSarif(document([finding({level,baselineState:"unchanged",suppressions:[{kind:"external",status:"accepted"}]})]));
    assert.equal(output.findings.length,1);
    assert.deepEqual(output.findings[0],{rule:"js/canary",file:"tests/canary.js",line:7,level,severity:"high"});
  }
});

await check("SARIF: fallos de ejecución y errores notificados impiden aprobar",() => {
  for (const invocation of [{executionSuccessful:false},{executionSuccessful:true,exitCode:2},{executionSuccessful:true,toolExecutionNotifications:[{level:"error"}]},{executionSuccessful:true,toolConfigurationNotifications:[{level:"error"}]}]) {
    const output = document();
    output.runs[0].invocations = [invocation];
    assert.throws(() => inspectSarif(output));
  }
  const complete = document();
  complete.runs[0].invocations = [{executionSuccessful:true,exitCode:0}];
  assert.equal(inspectSarif(complete).findings.length,0);
});

await check("SARIF: resumen agrupa regla, archivo y nivel, con texto escapado",() => {
  const findings = inspectSarif(document([finding(),finding(),finding({level:"note"})])).findings;
  const summary = formatSummary({files:1,runs:1,findings,errors:["<script>alert(1)</script>|otro\ntexto"],ok:false});
  assert.ok(summary.includes("**3 hallazgo(s)**"));
  assert.ok(summary.includes("<code>warning</code> | <code>high</code> | 2 |"));
  assert.ok(summary.includes("<code>note</code> | <code>high</code> | 1 |"));
  assert.ok(summary.includes("&lt;script&gt;"));
  assert.ok(!summary.includes("<script>"));
});

const directory = await mkdtemp(join(tmpdir(),"deshidrataditos-codeql-gate-"));
try {
  await check("SARIF: CLI canario aprueba cero y devuelve error con un hallazgo",async () => {
    const sarif = join(directory,"javascript.sarif");
    const summaryPath = join(directory,"summary.md");
    await writeFile(sarif,JSON.stringify(document()));
    const clean = await execute(process.execPath,[script,directory,"success"],{env:{...process.env,GITHUB_STEP_SUMMARY:summaryPath}});
    assert.equal(JSON.parse(clean.stdout).ok,true);
    assert.ok((await readFile(summaryPath,"utf8")).includes("APROBADO"));
    await writeFile(sarif,JSON.stringify(document([finding()])));
    await assert.rejects(execute(process.execPath,[script,directory,"success"],{env:{...process.env,GITHUB_STEP_SUMMARY:summaryPath}}),error => {
      assert.equal(error.code,1);
      const report = JSON.parse(error.stdout);
      assert.equal(report.ok,false);
      assert.equal(report.findings.length,1);
      return true;
    });
    assert.ok((await readFile(summaryPath,"utf8")).includes("BLOQUEADO"));
  });
  await check("SARIF: falla si falta la salida, está vacía, contiene JSON inválido o el análisis falló",async () => {
    const empty = join(directory,"empty");
    await mkdir(empty);
    assert.equal((await checkSarifDirectory(empty,"success")).ok,false);
    assert.equal((await checkSarifDirectory(join(directory,"missing"),"success")).ok,false);
    for (const text of ["","  ","{","{}",JSON.stringify({version:"2.1.0",runs:[]})]) {
      await writeFile(join(directory,"javascript.sarif"),text);
      assert.equal((await checkSarifDirectory(directory,"success")).ok,false);
    }
    await writeFile(join(directory,"javascript.sarif"),JSON.stringify(document()));
    for (const outcome of [undefined,"","failure","skipped","cancelled"]) assert.equal((await checkSarifDirectory(directory,outcome)).ok,false);
    await writeFile(join(directory,"second.sarif"),"{broken");
    assert.equal((await checkSarifDirectory(directory,"success")).ok,false,"Una salida limpia no oculta otro archivo inválido");
  });
} finally {
  // directory is the exact absolute path returned by mkdtemp above.
  await rm(directory,{recursive:true,force:true});
}

console.log(`${passed} comprobaciones del bloqueo SARIF correctas.`);
