import {appendFile,readFile,readdir} from "node:fs/promises";
import {join,resolve} from "node:path";
import {fileURLToPath} from "node:url";

const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const levels = new Set(["none","note","warning","error"]);
const requireValid = (condition,message) => { if (!condition) throw new Error(message); };

// SARIF 2.1.0 from CodeQL; optional metadata is not required to count a finding.
export function inspectSarif(document) {
  requireValid(object(document) && document.version === "2.1.0","Versión o estructura SARIF inválida");
  requireValid(Array.isArray(document.runs) && document.runs.length > 0,"SARIF sin ejecuciones");
  const findings = [];
  for (const run of document.runs) {
    requireValid(object(run) && /^CodeQL(?:\s|$)/u.test(run.tool?.driver?.name || ""),"La ejecución no identifica a CodeQL");
    requireValid(Array.isArray(run.results),"La ejecución no contiene un arreglo de resultados");
    // CodeQL may omit invocations. The workflow outcome is checked separately.
    if (run.invocations !== undefined) {
      requireValid(Array.isArray(run.invocations) && run.invocations.length > 0,"Invocaciones inválidas");
      for (const invocation of run.invocations) {
        requireValid(object(invocation) && invocation.executionSuccessful === true,"CodeQL informa una ejecución incompleta o fallida");
        requireValid(invocation.exitCode === undefined || invocation.exitCode === 0,"CodeQL informa un código de salida fallido");
        for (const key of ["toolExecutionNotifications","toolConfigurationNotifications"]) {
          if (invocation[key] === undefined) continue;
          requireValid(Array.isArray(invocation[key]),"Notificaciones de ejecución inválidas");
          for (const notification of invocation[key]) {
            requireValid(object(notification) && (notification.level === undefined || levels.has(notification.level)),"Notificación de ejecución inválida");
            requireValid(notification.level !== "error","CodeQL informa un error de ejecución o configuración");
          }
        }
      }
    }
    const components = [run.tool.driver,...(run.tool.extensions || [])];
    for (const component of components) requireValid(object(component) && (component.rules === undefined || Array.isArray(component.rules)),"Metadatos de reglas inválidos");
    for (const result of run.results) {
      requireValid(object(result),"Resultado SARIF inválido");
      const component = result.rule?.toolComponent?.index === undefined ? run.tool.driver : run.tool.extensions?.[result.rule.toolComponent.index];
      const index = result.ruleIndex ?? result.rule?.index;
      let rule = index === undefined ? undefined : component?.rules?.[index];
      const ruleId = result.ruleId ?? result.rule?.id ?? rule?.id;
      requireValid(typeof ruleId === "string" && ruleId.length > 0,"Resultado sin identificador de regla");
      if (!rule) rule = components.flatMap(item => item.rules || []).find(item => item.id === ruleId);
      requireValid(object(result.message) && (typeof result.message.text === "string" || typeof result.message.markdown === "string"),"Resultado sin mensaje SARIF");
      const level = result.level ?? rule?.defaultConfiguration?.level ?? "warning";
      requireValid(levels.has(level),"Nivel SARIF inválido");
      requireValid(result.locations === undefined || Array.isArray(result.locations),"Ubicaciones SARIF inválidas");
      const location = result.locations?.[0]?.physicalLocation;
      const artifact = location?.artifactLocation;
      const file = artifact?.uri ?? run.artifacts?.[artifact?.index]?.location?.uri ?? "(sin ubicación)";
      requireValid(typeof file === "string", "Ruta SARIF inválida");
      const rawScore = rule?.properties?.["security-severity"];
      const score = rawScore === undefined ? undefined : Number(rawScore);
      requireValid(score === undefined || (Number.isFinite(score) && score >= 0 && score <= 10),"Severidad de seguridad inválida");
      const severity = score === undefined || score === 0 ? "sin clasificación" : score >= 9 ? "critical" : score >= 7 ? "high" : score >= 4 ? "medium" : "low";
      // All emitted results count, including note/none, existing baselines and suppressions.
      // A GitHub dismissal must never turn the current raw analysis into a clean result.
      findings.push({rule:ruleId,file,line:location?.region?.startLine ?? null,level,severity});
    }
  }
  return {runs:document.runs.length,findings};
}

export async function checkSarifDirectory(directory,analysisOutcome) {
  const report = {files:0,runs:0,findings:[],errors:[]};
  if (analysisOutcome !== "success") report.errors.push("El paso de análisis no terminó correctamente: " + (analysisOutcome || "sin estado"));
  try {
    requireValid(typeof directory === "string" && directory.length > 0,"Falta la ruta de resultados SARIF");
    const entries = await readdir(directory,{withFileTypes:true});
    const files = entries.filter(entry => entry.name.endsWith(".sarif"));
    requireValid(files.length > 0,"No se encontraron archivos SARIF");
    for (const entry of files.sort((a,b) => a.name.localeCompare(b.name))) {
      try {
        requireValid(entry.isFile(),"La salida SARIF debe ser un archivo regular");
        const text = await readFile(join(directory,entry.name),"utf8");
        requireValid(text.trim().length > 0,"Archivo SARIF vacío");
        const result = inspectSarif(JSON.parse(text));
        report.files++;
        report.runs += result.runs;
        report.findings.push(...result.findings);
      } catch (error) { report.errors.push(entry.name + ": " + error.message); }
    }
  } catch (error) { report.errors.push(error.message); }
  report.ok = report.errors.length === 0 && report.files > 0 && report.findings.length === 0;
  return report;
}

const entities = {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","|":"&#124;"};
const cell = value => "<code>" + JSON.stringify(String(value)).slice(1,-1).replace(/[&<>"'|]/gu,char => entities[char]) + "</code>";

export function formatSummary(report) {
  const lines = ["## Resultado de CodeQL","",`${report.files} archivo(s) SARIF válido(s), ${report.runs} ejecución(es), **${report.findings.length} hallazgo(s)**.`,"",report.ok ? "**APROBADO: análisis completo sin hallazgos.**" : "**BLOQUEADO: hay hallazgos o no se pudo verificar el análisis.**",""];
  for (const error of report.errors) lines.push("- " + cell(error));
  if (report.findings.length) {
    lines.push("","| Regla | Archivo | Nivel SARIF | Severidad de seguridad | Cantidad |","| --- | --- | --- | --- | --- |");
    const groups = new Map();
    for (const finding of report.findings) {
      const key = JSON.stringify([finding.rule,finding.file,finding.level,finding.severity]);
      const group = groups.get(key) || {...finding,count:0};
      group.count++;
      groups.set(key,group);
    }
    for (const group of groups.values()) lines.push(`| ${cell(group.rule)} | ${cell(group.file)} | ${cell(group.level)} | ${cell(group.severity)} | ${group.count} |`);
  }
  return lines.join("\n") + "\n";
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await checkSarifDirectory(process.argv[2],process.argv[3]);
  console.log(JSON.stringify(report));
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY,formatSummary(report));
  process.exitCode = report.ok ? 0 : 1;
}
