import assert from "node:assert/strict";
import "../dist/catalog.js";
import "../dist/commerce.js";

const {products,categories} = globalThis.DeshidrataditosCatalog;
const C = globalThis.DeshidrataditosCommerce;
let passed = 0;
const check = (name,fn) => { fn(); passed++; console.log("OK " + name); };
const row = (productId,weight,quantity = 1,price = -100) => ({productId,weight,quantity,price});

check("28 productos únicos y 12 incorporaciones sobre pedido",() => {
  assert.equal(products.length,28);
  assert.equal(new Set(products.map(product => product.id)).size,28);
  assert.equal(products.filter(product => product.isNew).length,12);
  assert.ok(products.filter(product => product.isNew).every(product => product.availability === "Sobre pedido"));
  products.forEach(product => {
    assert.ok(categories[product.category]);
    assert.ok(product.occasions.length);
    assert.ok(product.photo.src);
    assert.equal(new Set(product.variants.map(item => item.label)).size,product.variants.length);
    product.variants.forEach(item => { assert.ok(item.price > 0); assert.ok(item.grams > 0); assert.ok(Number.isFinite(item.price)); });
  });
});
check("Carrito antiguo: conserva cantidades, corrige precios y descarta artículos inválidos",() => {
  const result = C.sanitizeCart([row("mango-chile","100 g",2,1),row("no-existe","1 kg"),row("pina-chile","10 kg"),null,row("pina-chile","50 g",-1),row("pina-chile","50 g",NaN),row("pina-chile","50 g","3")],products);
  assert.equal(result.length,1);
  assert.equal(result[0].price,59);
  assert.equal(result[0].quantity,2);
  assert.equal(C.totals(result).subtotal,118);
  assert.deepEqual(C.sanitizeCart({malformed:true},products),[]);
  assert.deepEqual(C.sanitizeCart(null,products),[]);
});
check("Consolida duplicados y limita cantidades a 99",() => {
  const result = C.sanitizeCart([row("naranja-rodajas","100 g",80),row("naranja-rodajas","100 g",40)],products);
  assert.equal(result.length,1); assert.equal(result[0].quantity,99);
});
check("Presentaciones distintas no se mezclan; variantes inválidas no se agregan",() => {
  let result = C.addItem([],products,"rollito-mango","25 g",2);
  result = C.addItem(result,products,"rollito-mango","4 × 25 g",1);
  result = C.addItem(result,products,"rollito-mango","25 g",1);
  assert.equal(result.length,2);
  assert.equal(C.totals(result).subtotal,164);
  assert.deepEqual(C.addItem(result,products,"rollito-mango","100 kg"),result);
  assert.deepEqual(C.addItem(result,products,"rollito-mango","25 g",0.5),result);
});
check("Un producto agotado no se restaura en el carrito",() => {
  const unavailable = products.map(product => product.id === "mango-chile" ? {...product,availability:"Agotado"} : product);
  assert.deepEqual(C.sanitizeCart([row("mango-chile","100 g")],unavailable),[]);
});
check("Costo nacional y umbral exacto de envío gratis",() => {
  assert.deepEqual(C.totals([]),{subtotal:0,count:0,shipping:0,total:0,remaining:2000});
  const before = C.totals([{quantity:1,price:1999}]);
  assert.equal(before.shipping,200); assert.equal(before.total,2199); assert.equal(before.remaining,1);
  const exact = C.totals([{quantity:1,price:2000}]);
  assert.equal(exact.shipping,0); assert.equal(exact.total,2000); assert.equal(exact.remaining,0);
});
check("Entrega regional pendiente y envío gratis desde el umbral",() => {
  assert.equal(C.totals([{quantity:2,price:99}],"regional").shipping,null);
  assert.equal(C.totals([{quantity:2,price:99}],"regional").total,198);
  assert.equal(C.totals([{quantity:1,price:2000}],"regional").shipping,0);
});
check("Búsqueda sin acentos y filtros combinados",() => {
  assert.ok(C.filterProducts(products,{search:"limon"}).some(product => product.id === "limon-rodajas"));
  assert.ok(C.filterProducts(products,{search:"PLATANO"}).some(product => product.id === "platano-natural"));
  const citrus = C.filterProducts(products,{category:"citrus",occasion:"bebidas",onlyNew:true});
  assert.equal(citrus.length,3);
  assert.equal(C.filterProducts(products,{category:"citrus",occasion:"cocina"}).length,0);
  assert.equal(C.filterProducts(products,{search:"<script>"}).length,0);
});
check("Orden por precio inicial y por 100 g",() => {
  const ordered = C.filterProducts(products,{sort:"price-asc"});
  assert.equal(ordered[0].variants[0].price,25);
  const unit = C.filterProducts(products,{sort:"unit-price"});
  for (let i = 1; i < unit.length; i++) assert.ok(unit[i-1].variants[0].price / unit[i-1].variants[0].grams <= unit[i].variants[0].price / unit[i].variants[0].grams);
});
check("Recomendaciones relacionadas con bebidas y sin repetir la selección",() => {
  const cart = C.sanitizeCart([row("naranja-rodajas","100 g")],products);
  const result = C.recommend(products,cart);
  assert.equal(result.length,3);
  assert.ok(result.every(product => product.id !== "naranja-rodajas"));
  assert.ok(result.every(product => product.occasions.includes("bebidas")));
  assert.deepEqual(C.recommend(products,products.map(product => ({productId:product.id}))),[]);
});
check("Degustación: contenido de 150 g y ahorro real de $6",() => {
  const bundle = C.findProduct(products,"pack-degustacion");
  assert.deepEqual(C.bundleValue(bundle,products),{regular:105,saving:6});
  const grams = bundle.bundle.reduce((sum,item) => sum + C.variant(C.findProduct(products,item.id),item.label).grams * item.quantity,0);
  assert.equal(grams,150); assert.equal(bundle.variants[0].grams,grams);
  assert.equal(C.bundleValue(products[0],products),null);
});
check("Mensaje conserva variantes, paquete, correo y entrega pendiente",() => {
  const cart = C.sanitizeCart([row("pack-degustacion","3 × 50 g",2)],products);
  const message = C.orderMessage({cart,products,address:{name:"Ana",phone:"3931234567",email:"ana@example.com",postcode:"47910",street:"Calle 1",neighborhood:"Centro",city:"La Barca",state:"Jalisco",references:"Puerta azul"},delivery:"regional",payment:"transferencia",notes:"Confirmar canela"});
  assert.ok(message.includes("3 × 50 g × 2"));
  assert.ok(message.includes("Contenido por paquete:"));
  assert.ok(message.includes("ana@example.com"));
  assert.ok(message.includes("Total sin entrega regional: $198 MXN"));
  assert.ok(message.includes("costo por confirmar"));
  assert.ok(message.includes("Confirmar canela"));
  assert.ok(message.includes("antes del pago"));
  assert.equal(C.orderMessage({cart:[],products,address:{},delivery:"national",payment:"transferencia"}),"");
});
console.log(passed + " pruebas de comercio aprobadas.");
