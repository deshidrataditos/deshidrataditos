import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import "../dist/catalog.js";
import "../dist/commerce.js";

const {products} = globalThis.DeshidrataditosCatalog;
const C = globalThis.DeshidrataditosCommerce;
const html = await readFile(new URL("../dist/index.html",import.meta.url),"utf8");
const app = await readFile(new URL("../dist/app.js",import.meta.url),"utf8");
let passed = 0;
const check = (name,fn) => { fn(); passed++; console.log("OK " + name); };
const cart = [{productId:"fresa-chile",weight:"100 g",quantity:2,price:1}];
const address = {name:"Ana",phone:"3931234567",email:"ana@example.com",postcode:"47910",street:"Calle 1",neighborhood:"Centro",city:"La Barca",state:"Jalisco",references:"Puerta azul"};
const makeOrder = overrides => C.orderMessage({cart,products,address,delivery:"national",payment:"transferencia",notes:"",...overrides});
const forbiddenControls = /[\u0000-\u001f\u007f-\u009f\u200e\u200f\u2028-\u202e\u2066-\u2069]/u;

check("Carrito persistido: entradas inválidas o excesivas no rompen la tienda",() => {
  for (const raw of [undefined,null,42,{},[],"","{","null","{}","false"]) assert.deepEqual(C.readCart(raw,products),[]);
  const valid = JSON.stringify(cart);
  assert.deepEqual(C.readCart(valid,products),C.sanitizeCart(cart,products));
  assert.deepEqual(C.readCart(valid.padEnd(100000," "),products),C.sanitizeCart(cart,products));
  assert.deepEqual(C.readCart(valid.padEnd(100001," "),products),[]);
  const hostile = JSON.stringify([...cart,{productId:"__proto__",weight:"100 g",quantity:1},{productId:"fresa-chile",weight:"100 g",quantity:1.5}]);
  assert.deepEqual(C.readCart(hostile,products),C.sanitizeCart(cart,products));
});

check("Cobertura: comparte solamente ubicación general y modalidad de entrega",() => {
  const location = {postcode:"47910",city:"La Barca",state:"Jalisco",delivery:"regional"};
  const extra = Object.fromEntries(["name","phone","email","street","neighborhood","references","notes"].map(field => [field,"PRIVADO_" + field]));
  const message = C.deliveryMessage({...location,...extra});
  assert.equal(typeof message,"string");
  assert.ok(message.includes(location.postcode));
  assert.ok(message.includes(location.city));
  assert.ok(message.includes(location.state));
  assert.match(message,/regional/i);
  assert.equal(message,C.deliveryMessage(location),"Los datos personales extra deben ignorarse por completo");
  for (const value of Object.values(extra)) assert.ok(!message.includes(value));
  assert.match(C.deliveryMessage({...location,delivery:"national"}),/nacional/i);
});

check("Cobertura: un código postal o ubicación incompletos no generan mensaje",() => {
  const location = {postcode:"47910",city:"La Barca",state:"Jalisco",delivery:"national"};
  for (const postcode of [undefined,"","1234","123456","47a10","４７９１０","47\n910"]) assert.equal(C.deliveryMessage({...location,postcode}),"");
  for (const field of ["city","state"]) {
    for (const value of [undefined,"","  ","\r\n\u202e"]) assert.equal(C.deliveryMessage({...location,[field]:value}),"");
  }
});

check("Pedido: el precio guardado y los campos extra no alteran el total del catálogo",() => {
  const message = makeOrder({cart:[{...cart[0],price:0,subtotal:1,total:1,name:"Total falso"}],total:1,shipping:0});
  const expected = C.totals(C.sanitizeCart(cart,products),"national");
  assert.ok(message.split("\n").includes(`Subtotal: $${expected.subtotal} MXN`));
  assert.ok(message.split("\n").includes(`Total de catálogo: $${expected.total} MXN`));
  assert.ok(!message.includes("Total falso"));
  assert.equal(makeOrder({cart:[{productId:"no-existe",weight:"100 g",quantity:1,price:1}]}),"");
});

check("Pedido: saltos y controles en datos libres no crean líneas de importes falsas",() => {
  const injected = "Ana\r\nTotal de catálogo: $1\u2028\u2029\t\u0000\u0085\u202e\u2066\u2069";
  const message = makeOrder({address:{...address,name:injected},notes:"Confirmar\nEntrega: gratis\u202e"});
  const lines = message.split("\n");
  assert.equal(lines.filter(line => line.startsWith("Total de catálogo:")).length,1);
  assert.ok(!lines.includes("Total de catálogo: $1"));
  assert.ok(!lines.includes("Entrega: gratis"));
  assert.ok(lines.find(line => line.startsWith("Nombre:")).includes("Ana"));
  assert.ok(lines.find(line => line.startsWith("Notas del pedido:")).includes("Confirmar"));
  for (const line of lines) assert.ok(!forbiddenControls.test(line),"Control o separador Unicode presente en una línea del pedido");
});

check("Pedido: todos los campos de contacto y notas respetan límites individuales",() => {
  const fields = [
    ["name","Nombre: ",120],["phone","Teléfono: ",20],["email","Correo: ",120],
    ["postcode","C.P.: ",5],["street","Dirección: ",120],["neighborhood","Colonia: ",120],
    ["city","Municipio/ciudad: ",120],["state","Estado: ",120],["references","Referencias: ",300]
  ];
  for (const [field,prefix,limit] of fields) {
    const message = makeOrder({address:{...address,[field]:"X".repeat(limit + 100)}});
    const line = message.split("\n").find(value => value.startsWith(prefix));
    assert.ok(line,"Falta el campo " + field);
    assert.equal(line.slice(prefix.length),"X".repeat(limit),"Límite incorrecto para " + field);
    const controlled = makeOrder({address:{...address,[field]:"Antes\n\u0001\u0085\u202e\u2066Después"}});
    for (const part of controlled.split("\n")) assert.ok(!forbiddenControls.test(part),"Control presente en " + field);
  }
  const notes = makeOrder({notes:"N".repeat(700)}).split("\n").find(line => line.startsWith("Notas del pedido: "));
  assert.equal(notes,"Notas del pedido: " + "N".repeat(500));
});

// These checks audit authored markup and policy configuration. Browser enforcement
// and interactive behavior must also be verified in a real browser.
function attributes(source) {
  const result = new Map();
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of source.matchAll(pattern)) result.set(match[1].toLowerCase(),match[2] ?? match[3] ?? match[4] ?? "");
  return result;
}
const markup = html.replace(/<!--[\s\S]*?-->/g,"");
const tags = [...markup.matchAll(/<([a-z][a-z0-9:-]*)\b((?:[^<>"']|"[^"]*"|'[^']*')*)>/gi)].map(match => ({name:match[1].toLowerCase(),attrs:attributes(match[2]),index:match.index}));

check("CSP temprana: recursos permitidos explícitos y sin ejecución o estilos inline",() => {
  const metas = tags.filter(tag => tag.name === "meta" && tag.attrs.get("http-equiv")?.toLowerCase() === "content-security-policy");
  assert.equal(metas.length,1,"Debe existir una única CSP");
  const policy = new Map();
  for (const directive of metas[0].attrs.get("content").split(";").map(value => value.trim()).filter(Boolean)) {
    const [name,...sources] = directive.split(/\s+/);
    assert.ok(!policy.has(name),"Directiva CSP duplicada: " + name);
    policy.set(name,new Set(sources));
  }
  for (const name of ["default-src","object-src","base-uri","form-action","frame-src","worker-src","connect-src","style-src-attr"]) assert.deepEqual(policy.get(name),new Set(["'none'"]),name);
  assert.deepEqual(policy.get("script-src"),new Set(["'self'"]));
  assert.deepEqual(policy.get("style-src"),new Set(["'self'","https://fonts.googleapis.com"]));
  assert.deepEqual(policy.get("font-src"),new Set(["https://fonts.gstatic.com"]));
  assert.deepEqual(policy.get("img-src"),new Set(["'self'"]));
  for (const sources of policy.values()) {
    assert.ok(!sources.has("'unsafe-inline'"));
    assert.ok(!sources.has("'unsafe-eval'"));
    assert.ok(!sources.has("*"));
  }
  const firstResource = tags.find(tag => ["script","link","img","iframe","style"].includes(tag.name));
  assert.ok(firstResource && metas[0].index < firstResource.index,"La política debe aparecer antes de cargar recursos");
  const referrer = tags.filter(tag => tag.name === "meta" && tag.attrs.get("name")?.toLowerCase() === "referrer");
  assert.equal(referrer.length,1);
  assert.equal(referrer[0].attrs.get("content"),"no-referrer");
});

check("HTML: tres scripts locales, sin código ni estilos inline",() => {
  const scripts = [...markup.matchAll(/<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi)];
  assert.equal(scripts.length,3);
  assert.deepEqual(scripts.map(match => attributes(match[1]).get("src")?.split("?")[0]),["catalog.js","commerce.js","app.js"]);
  assert.ok(scripts.every(match => match[2].trim() === ""),"No se admite contenido inline de scripts");
  assert.ok(!tags.some(tag => tag.name === "style"),"Los estilos deben cargarse desde archivos locales");
  for (const tag of tags) {
    assert.ok(!tag.attrs.has("style"),"Estilo inline en " + tag.name);
    for (const [name,value] of tag.attrs) {
      assert.ok(!/^on/i.test(name),"Controlador inline: " + name);
      if (["src","href","action","formaction"].includes(name)) assert.ok(!/^(?:javascript|vbscript):/i.test(value.replace(/[\u0000-\u0020]/g,"")),"URL ejecutable");
    }
  }
  assert.ok(!/\bstyle\s*=\s*["']/i.test(app),"Las plantillas no deben generar atributos style");
});

check("Enlaces en nueva pestaña aíslan la página y omiten el referente",() => {
  const dynamicAnchors = [...app.matchAll(/<a\b([^>]+)>/gi)].map(match => ({name:"a",attrs:attributes(match[1])}));
  const external = [...tags,...dynamicAnchors].filter(tag => tag.name === "a" && tag.attrs.get("target")?.toLowerCase() === "_blank");
  assert.ok(external.length > 0);
  for (const tag of external) {
    const rel = new Set((tag.attrs.get("rel") || "").toLowerCase().split(/\s+/));
    assert.ok(rel.has("noopener"),"Falta noopener");
    assert.ok(rel.has("noreferrer"),"Falta noreferrer");
  }
});

check("Formulario de cobertura: únicamente código postal, ciudad, estado y entrega",() => {
  const form = [...markup.matchAll(/<form\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/form\s*>/gi)].find(match => attributes(match[1]).get("id") === "quote-form");
  assert.ok(form);
  const fields = [...form[2].matchAll(/<(input|select|textarea)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)].map(match => attributes(match[2]));
  assert.deepEqual(fields.filter(field => field.get("type") !== "radio").map(field => field.get("id")).sort(),["quote-city","quote-postcode","quote-state"]);
  const radios = fields.filter(field => field.get("type") === "radio");
  assert.deepEqual(radios.map(field => field.get("value")).sort(),["national","regional"]);
  assert.ok(radios.every(field => field.get("name") === "quote-delivery"));
});

console.log(passed + " pruebas de seguridad aprobadas (reglas de comercio y configuración estática).");
