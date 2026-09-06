import assert from "node:assert/strict";
import {readFile,stat,readdir} from "node:fs/promises";
import "../dist/catalog.js";

const base = new URL("../",import.meta.url);
const html = await readFile(new URL("dist/index.html",base),"utf8");
const app = await readFile(new URL("dist/app.js",base),"utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size,ids.length,"IDs duplicados");
const known = new Set(ids);
for (const match of app.matchAll(/\$\("([^"]+)"\)/g)) assert.ok(known.has(match[1]),"Falta el elemento " + match[1]);
for (const match of html.matchAll(/(?:aria-labelledby|aria-controls|for)="([^"]+)"/g)) {
  for (const id of match[1].split(/\s+/)) assert.ok(known.has(id),"Referencia accesible inexistente: " + id);
}
const views = new Set([...html.matchAll(/\bdata-view="([^"]+)"/g)].map(match => match[1]));
for (const match of html.matchAll(/\bdata-view-link="([^"]+)"/g)) assert.ok(views.has(match[1]),"Vista inexistente: " + match[1]);
for (const match of html.matchAll(/\b(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)) {
  if (/^(?:https?:|mailto:|tel:)/.test(match[1])) continue;
  await stat(new URL("dist/" + match[1],base));
}
for (const product of globalThis.DeshidrataditosCatalog.products) await stat(new URL("dist/" + product.photo.src,base));
const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1].split("?")[0]);
assert.deepEqual(scripts,["catalog.js","commerce.js","app.js"]);
assert.ok(!html.includes('value="mercado-pago"'));
assert.ok(!html.includes("Código de descuento"));
assert.ok(!html.includes("Vida de anaquel inicial"));
assert.ok(!app.includes("window.open"),"La interfaz debe preparar enlaces revisables, no enviar mensajes");
async function compare(directory = "") {
  const entries = await readdir(new URL("dist/" + directory,base),{withFileTypes:true});
  const mirrorEntries = await readdir(new URL("docs/" + directory,base),{withFileTypes:true});
  assert.deepEqual(entries.map(entry => entry.name).sort(),mirrorEntries.map(entry => entry.name).sort(),"Archivos diferentes en docs y dist");
  for (const entry of entries) {
    const relative = directory + entry.name;
    if (entry.isDirectory()) await compare(relative + "/");
    else assert.deepEqual(await readFile(new URL("dist/" + relative,base)),await readFile(new URL("docs/" + relative,base)),"Publicación desactualizada: " + relative);
  }
}
await compare();
console.log("OK Estructura HTML, referencias, rutas, imágenes y sincronización docs/dist.");
