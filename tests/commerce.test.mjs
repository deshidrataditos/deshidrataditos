import assert from "node:assert/strict";
import "../dist/catalog.js";
import "../dist/commerce.js";

const {products,categories} = globalThis.DeshidrataditosCatalog;
const C = globalThis.DeshidrataditosCommerce;
let passed = 0;
const check = (name,fn) => { fn(); passed++; console.log("OK " + name); };
const row = (productId,weight,quantity = 1,price = -100) => ({productId,weight,quantity,price});

check("27 productos únicos y 12 incorporaciones sobre pedido",() => {
  assert.equal(products.length,27);
  assert.equal(new Set(products.map(product => product.id)).size,27);
  assert.equal(products.filter(product => product.isNew).length,12);
  assert.ok(products.filter(product => product.isNew).every(product => product.availability === "Sobre pedido"));
  products.forEach(product => {
    assert.ok(categories[product.category]);
    assert.ok(product.occasions.length);
    assert.ok(product.photo.src);
    assert.equal(new Set(product.variants.map(item => item.label)).size,product.variants.length);
    product.variants.forEach(item => {
      if (product.quoteOnly) { assert.equal(item.price,null); assert.equal(item.grams,null); }
      else { assert.ok(item.price > 0); assert.ok(item.grams > 0); assert.ok(Number.isFinite(item.price)); }
    });
  });
});
check("Frutas retiradas ausentes y plátano macho conserva sus precios",() => {
  for (const id of ["pina-chile","mango-chile","mix-tropical","rollito-mango","platano-natural"]) assert.equal(C.findProduct(products,id),undefined);
  const plantain = C.findProduct(products,"platano-macho");
  assert.equal(plantain.name,"Plátano macho deshidratado");
  assert.deepEqual(plantain.variants.map(item => item.price),[29,49,109,399]);
  assert.ok(plantain.photo.src.includes("platano-macho"));
});
check("Carrito antiguo: conserva cantidades, corrige precios y descarta artículos inválidos",() => {
  const result = C.sanitizeCart([row("fresa-chile","100 g",2,1),row("no-existe","1 kg"),row("fresa-chile","10 kg"),null,row("fresa-chile","50 g",-1),row("fresa-chile","50 g",NaN),row("fresa-chile","50 g","3")],products);
  assert.equal(result.length,1);
  assert.equal(result[0].price,89);
  assert.equal(result[0].quantity,2);
  assert.equal(C.totals(result).subtotal,178);
  assert.deepEqual(C.sanitizeCart({malformed:true},products),[]);
  assert.deepEqual(C.sanitizeCart(null,products),[]);
});
check("Un carrito guardado elimina productos retirados sin cambiarlos por otro producto",() => {
  const retired = [row("pina-chile","50 g"),row("mango-chile","100 g"),row("mix-tropical","50 g"),row("rollito-mango","25 g"),row("platano-natural","50 g")];
  const result = C.sanitizeCart([...retired,row("fresa-chile","50 g",2)],products);
  assert.deepEqual(result.map(item => item.productId),["fresa-chile"]);
  assert.equal(result[0].quantity,2);
});
check("Consolida duplicados y limita cantidades a 99",() => {
  const result = C.sanitizeCart([row("naranja-rodajas","100 g",80),row("naranja-rodajas","100 g",40)],products);
  assert.equal(result.length,1); assert.equal(result[0].quantity,99);
});
check("Presentaciones distintas no se mezclan; variantes inválidas no se agregan",() => {
  let result = C.addItem([],products,"rollito-guayaba","25 g",2);
  result = C.addItem(result,products,"rollito-guayaba","4 × 25 g",1);
  result = C.addItem(result,products,"rollito-guayaba","25 g",1);
  assert.equal(result.length,2);
  assert.equal(C.totals(result).subtotal,164);
  assert.deepEqual(C.addItem(result,products,"rollito-guayaba","100 kg"),result);
  assert.deepEqual(C.addItem(result,products,"rollito-guayaba","25 g",0.5),result);
});
check("Un producto agotado no se restaura en el carrito",() => {
  const unavailable = products.map(product => product.id === "fresa-chile" ? {...product,availability:"Agotado"} : product);
  assert.deepEqual(C.sanitizeCart([row("fresa-chile","100 g")],unavailable),[]);
});
check("Productos por cotizar no agregan importes ni se restauran en el carrito",() => {
  const quotes = products.filter(product => product.quoteOnly);
  assert.deepEqual(quotes.map(product => product.id).sort(),["ajo-hojuelas","fruta-temporada","tomate-cherry"]);
  for (const product of quotes) {
    for (const selected of product.variants) {
      assert.deepEqual(C.addItem([],products,product.id,selected.label),[]);
      assert.deepEqual(C.sanitizeCart([row(product.id,selected.label,1,1)],products),[]);
    }
  }
  const brokenPrices = [null,NaN,Infinity,0,-1];
  for (const price of brokenPrices) {
    const invalid = [{...products[0],quoteOnly:false,variants:[{label:"50 g",price,grams:50}]}];
    assert.deepEqual(C.sanitizeCart([row(invalid[0].id,"50 g")],invalid),[]);
  }
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
  assert.ok(C.filterProducts(products,{search:"PLATANO MACHO"}).some(product => product.id === "platano-macho"));
  assert.ok(C.filterProducts(products,{search:"cherry finas hierbas"}).some(product => product.id === "tomate-cherry"));
  assert.ok(C.filterProducts(products,{search:"cherry natural"}).some(product => product.id === "tomate-cherry"));
  const citrus = C.filterProducts(products,{category:"citrus",occasion:"bebidas",onlyNew:true});
  assert.equal(citrus.length,3);
  assert.equal(C.filterProducts(products,{category:"citrus",occasion:"cocina"}).length,0);
  assert.equal(C.filterProducts(products,{search:"<script>"}).length,0);
});
check("Orden por precio inicial y por 100 g deja las cotizaciones al final",() => {
  const ordered = C.filterProducts(products,{sort:"price-asc"});
  assert.equal(ordered[0].variants[0].price,25);
  const unit = C.filterProducts(products,{sort:"unit-price"});
  for (const [result,value] of [[ordered,product => product.variants[0].price],[unit,product => product.variants[0].price / product.variants[0].grams]]) {
    const priced = result.filter(product => !product.quoteOnly);
    for (let i = 1; i < priced.length; i++) assert.ok(value(priced[i-1]) <= value(priced[i]));
    assert.ok(result.slice(-3).every(product => product.quoteOnly));
    assert.equal(new Set(result.map(product => product.id)).size,products.length);
    assert.deepEqual(result.slice(-3).map(product => product.id),products.filter(product => product.quoteOnly).sort((a,b) => a.rank - b.rank).map(product => product.id));
  }
});
check("Recomendaciones relacionadas con bebidas y sin repetir la selección",() => {
  const cart = C.sanitizeCart([row("naranja-rodajas","100 g")],products);
  const result = C.recommend(products,cart);
  assert.equal(result.length,3);
  assert.ok(result.every(product => product.id !== "naranja-rodajas"));
  assert.ok(result.every(product => product.occasions.includes("bebidas")));
  assert.deepEqual(C.recommend(products,products.map(product => ({productId:product.id}))),[]);
});
check("Las recomendaciones para cocina nunca ofrecen agregar productos por cotizar",() => {
  const cart = C.sanitizeCart([row("sazonador-hierbas","60 g")],products);
  const result = C.recommend(products,cart,products.length);
  assert.ok(result.length > 0);
  assert.ok(result.every(product => !product.quoteOnly));
});
check("Degustación: tres sabores vigentes, contenido de 150 g y ahorro real de $14",() => {
  const bundle = C.findProduct(products,"pack-degustacion");
  assert.deepEqual(bundle.bundle,[{id:"fresa-chile",label:"50 g",quantity:1},{id:"platano-macho",label:"50 g",quantity:1},{id:"manzana-canela",label:"50 g",quantity:1}]);
  assert.deepEqual(C.bundleValue(bundle,products),{regular:113,saving:14});
  const grams = bundle.bundle.reduce((sum,item) => sum + C.variant(C.findProduct(products,item.id),item.label).grams * item.quantity,0);
  assert.equal(grams,150); assert.equal(bundle.variants[0].grams,grams);
  assert.equal(C.bundleValue(products[0],products),null);
});
check("Mensaje conserva variantes, paquete, correo y entrega pendiente",() => {
  const cart = C.sanitizeCart([row("pack-degustacion","3 × 50 g",2)],products);
  const message = C.orderMessage({cart,products,address:{name:"Ana",phone:"3931234567",email:"ana@example.com",postcode:"47910",street:"Calle 1",neighborhood:"Centro",city:"La Barca",state:"Jalisco",references:"Puerta azul"},delivery:"regional",payment:"transferencia",notes:"Confirmar canela"});
  assert.ok(message.includes("3 × 50 g × 2"));
  assert.ok(message.includes("Contenido por paquete:"));
  assert.ok(message.includes("1 × Fresa con chile (50 g), 1 × Plátano macho deshidratado (50 g), 1 × Manzana con canela (50 g)"));
  assert.ok(!/mango|piña/i.test(message));
  assert.ok(message.includes("ana@example.com"));
  assert.ok(message.includes("Total sin entrega regional: $198 MXN"));
  assert.ok(message.includes("costo por confirmar"));
  assert.ok(message.includes("Confirmar canela"));
  assert.ok(message.includes("antes del pago"));
  assert.equal(C.orderMessage({cart:[],products,address:{},delivery:"national",payment:"transferencia"}),"");
});
check("Consulta de tomate cherry conserva la opción elegida sin asignar precio",() => {
  const cherry = C.findProduct(products,"tomate-cherry");
  assert.deepEqual(cherry.variants.map(item => item.label),["Natural","Finas hierbas"]);
  for (const option of cherry.variants) {
    const message = C.quoteMessage(cherry,option.label);
    assert.ok(message.includes(cherry.name));
    assert.ok(message.includes(`Opción: ${option.label}`));
    assert.ok(message.includes("disponibilidad"));
    assert.ok(message.includes("presentaciones"));
    assert.ok(message.includes("precio"));
    assert.ok(!message.includes("$"));
  }
  assert.equal(C.quoteMessage(cherry,"Chile"),"");
  assert.equal(C.quoteMessage(cherry,undefined),"");
  assert.equal(C.quoteMessage(C.findProduct(products,"fresa-chile"),"50 g"),"");
  assert.equal(C.quoteMessage(undefined,"Natural"),"");
  assert.ok(C.quoteMessage(C.findProduct(products,"fruta-temporada"),"Selección de temporada").includes("Selección de temporada"));
  assert.ok(C.quoteMessage(C.findProduct(products,"ajo-hojuelas"),"Hojuelas").includes("Hojuelas"));
});
console.log(passed + " pruebas de comercio aprobadas.");
