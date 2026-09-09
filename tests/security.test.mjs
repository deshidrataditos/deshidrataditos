import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {inspectHTML} from "./helpers/html.mjs";
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
const tags = inspectHTML(html);
function assertScriptPolicy(source) {
  const scripts = inspectHTML(source).filter(tag => tag.name === "script");
  assert.equal(scripts.length,3,"Deben existir exactamente los tres scripts locales previstos");
  assert.deepEqual(scripts.map(tag => tag.attrs.get("src")?.split("?")[0]),["catalog.js","commerce.js","app.js"]);
  assert.ok(scripts.every(tag => tag.text.trim() === ""),"No se admite contenido inline de scripts");
}

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
  assertScriptPolicy(html);
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
  const dynamicAnchors = [...app.matchAll(/<a\b[^>]*>/gi)].flatMap(match => inspectHTML(match[0]).filter(tag => tag.name === "a"));
  const external = [...tags,...dynamicAnchors].filter(tag => tag.name === "a" && tag.attrs.get("target")?.toLowerCase() === "_blank");
  assert.ok(external.length > 0);
  for (const tag of external) {
    const rel = new Set((tag.attrs.get("rel") || "").toLowerCase().split(/\s+/));
    assert.ok(rel.has("noopener"),"Falta noopener");
    assert.ok(rel.has("noreferrer"),"Falta noreferrer");
  }
});

check("Formulario de cobertura: únicamente código postal, ciudad, estado y entrega",() => {
  const form = tags.find(tag => tag.name === "form" && tag.attrs.get("id") === "quote-form");
  assert.ok(form);
  const belongsToForm = node => { for(let parent = node.parentNode; parent; parent = parent.parentNode) { if(parent === form.node) return true; } return false; };
  const fields = tags.filter(tag => ["input","select","textarea"].includes(tag.name) && belongsToForm(tag.node)).map(tag => tag.attrs);
  assert.deepEqual(fields.filter(field => field.get("type") !== "radio").map(field => field.get("id")).sort(),["quote-city","quote-postcode","quote-state"]);
  const radios = fields.filter(field => field.get("type") === "radio");
  assert.deepEqual(radios.map(field => field.get("value")).sort(),["national","regional"]);
  assert.ok(radios.every(field => field.get("name") === "quote-delivery"));
});

check("Contacto: emojis al límite y Unicode incompleto permiten preparar el enlace",() => {
  for (const limit of [5,20,100,120,150,300,500]) {
    const fits = "A".repeat(limit - 2) + "🍌";
    assert.equal(C.cleanText(fits,limit),fits);
    assert.equal(C.cleanText("A".repeat(limit - 1) + "🍌",limit),"A".repeat(limit - 1));
    assert.doesNotThrow(() => encodeURIComponent(C.cleanText("A".repeat(limit - 1) + "🍌",limit)));
  }
  assert.equal(C.cleanText("Antes\ud800Después\udc00",120),"Antes�Después�");
  assert.doesNotThrow(() => encodeURIComponent(makeOrder({address:{...address,name:"A".repeat(119) + "🍌"},notes:"N".repeat(499) + "🍌"})));
});

check("HTML5: cierres script no convencionales no ocultan código inline",() => {
  const trusted = '<script src="catalog.js"></script><script src="commerce.js"></script><script src="app.js"></script>';
  assert.doesNotThrow(() => assertScriptPolicy(trusted));
  for(const ending of ['</script\t\n bar>','</ScRiPt foo="bar">','</script/>']) {
    assert.throws(() => assertScriptPolicy(trusted + '<script>window.unexpected = true;' + ending));
  }
  assert.throws(() => assertScriptPolicy('<script src="catalog.js">window.unexpected = true;</script\t\n bar><script src="commerce.js"></script><script src="app.js"></script>'),/inline/);
});

check("HTML5: comentarios se interpretan sin eliminar ni reconstruir texto",() => {
  const trusted = '<script src="catalog.js"></script><script src="commerce.js"></script><script src="app.js"></script>';
  assert.doesNotThrow(() => assertScriptPolicy('<!-- <script>comentario</script> -->' + trusted));
  for(const comment of ['<!-- comentario --!>','<!-- <!-- comentario -->','<!-->']) {
    assert.throws(() => assertScriptPolicy(comment + trusted + '<script>window.unexpected = true;</script>'));
  }
  assert.equal(inspectHTML('<!--<!-- -->').filter(tag => tag.name === "script").length,0);
  const encoded = inspectHTML('<a target="&#95;blank" rel="noopener noreferrer" href="java&#115;cript:example">x</a>').find(tag => tag.name === "a");
  assert.equal(encoded.attrs.get("target"),"_blank");
  assert.equal(encoded.attrs.get("href"),"javascript:example");
});

console.log(passed + " pruebas de seguridad aprobadas (reglas de comercio y configuración estática).");
