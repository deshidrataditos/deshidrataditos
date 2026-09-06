import {readdir,mkdir,copyFile} from "node:fs/promises";
const source = new URL("../dist/",import.meta.url);
const destination = new URL("../docs/",import.meta.url);
let count = 0;
async function copy(relative = "") {
  await mkdir(new URL(relative,destination),{recursive:true});
  for (const entry of await readdir(new URL(relative,source),{withFileTypes:true})) {
    if (entry.isSymbolicLink()) throw new Error("No se publican enlaces simbólicos.");
    const path = relative + entry.name;
    if (entry.isDirectory()) await copy(path + "/");
    else { await copyFile(new URL(path,source),new URL(path,destination)); count++; }
  }
}
await copy();
console.log(count + " archivos de dist sincronizados con docs. No se borraron archivos.");
