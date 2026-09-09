import {readFile} from "node:fs/promises";
import {Script} from "node:vm";
for (const name of ["catalog.js","commerce.js","app.js","cart-enhancements.js"]) {
  new Script(await readFile(new URL("../dist/" + name,import.meta.url),"utf8"),{filename:name});
}
console.log("OK Sintaxis JavaScript.");
await import("../tests/commerce.test.mjs");
await import("../tests/security.test.mjs");
await import("../tests/check-codeql-results.test.mjs");
await import("../tests/static.test.mjs");
