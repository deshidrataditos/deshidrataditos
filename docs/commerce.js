/* Pure storefront rules. Prices are always resolved from the current catalog. */
(() => {
  "use strict";
  const MAX_QUANTITY = 99;
  const FREE_SHIPPING = 2000;
  const NATIONAL_SHIPPING = 200;
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const variant = (product, label) => product?.variants.find(item => item.label === label);
  const findProduct = (products, id) => products.find(product => product.id === id);
  // Contact text is untrusted; keep it within its own line in a reviewed message.
  const cleanText = (value,limit) => typeof value === "string" ? value.replace(/[\u0000-\u0020\u007f-\u009f\u2028\u2029]/g," ").replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g,"").replace(/\s+/g," ").trim().slice(0,limit) : "";

  function readCart(raw, products) {
    if (typeof raw !== "string" || raw.length > 100000) return [];
    try { return sanitizeCart(JSON.parse(raw),products); } catch { return []; }
  }

  function sanitizeCart(input, products) {
    if (!Array.isArray(input)) return [];
    const entries = new Map();
    for (const row of input.slice(0, 500)) {
      if (!row || typeof row !== "object") continue;
      const product = findProduct(products, row.productId);
      const selected = variant(product, row.weight);
      if (!selected || product.quoteOnly || !Number.isFinite(selected.price) || selected.price <= 0 || product.availability === "Agotado" || !Number.isSafeInteger(row.quantity) || row.quantity < 1) continue;
      const key = `${product.id}-${selected.label}`;
      const quantity = Math.min(MAX_QUANTITY, row.quantity + (entries.get(key)?.quantity || 0));
      entries.set(key, {key, productId:product.id, weight:selected.label, price:selected.price, quantity});
    }
    return [...entries.values()];
  }

  function addItem(cart, products, productId, label, quantity = 1) {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return sanitizeCart(cart, products);
    return sanitizeCart([...cart, {productId, weight:label, quantity}], products);
  }

  function totals(cart, delivery = "national") {
    const subtotal = cart.reduce((sum, row) => sum + row.price * row.quantity, 0);
    const count = cart.reduce((sum, row) => sum + row.quantity, 0);
    const shipping = count === 0 || subtotal >= FREE_SHIPPING ? 0 : delivery === "regional" ? null : NATIONAL_SHIPPING;
    return {subtotal, count, shipping, total:subtotal + (shipping || 0), remaining:Math.max(0, FREE_SHIPPING - subtotal)};
  }

  function filterProducts(products, filters = {}) {
    const words = normalize(filters.search).split(/\s+/).filter(Boolean);
    const result = products.filter(product => {
      const text = normalize([product.name, product.type, product.description, ...(product.tags || []), ...product.variants.map(item => item.label)].join(" "));
      return words.every(word => text.includes(word))
        && (!filters.category || filters.category === "all" || product.category === filters.category)
        && (!filters.occasion || filters.occasion === "all" || product.occasions.includes(filters.occasion))
        && (!filters.onlyNew || product.isNew);
    });
    const startingPrice = product => {
      const price = product.variants[0]?.price;
      return !product.quoteOnly && Number.isFinite(price) && price > 0 ? price : Infinity;
    };
    const per100 = product => {
      const grams = product.variants[0]?.grams;
      return Number.isFinite(grams) && grams > 0 ? startingPrice(product) / grams * 100 : Infinity;
    };
    const byValue = value => (a,b) => {
      const first = value(a), second = value(b);
      return first === second ? a.rank - b.rank : first < second ? -1 : 1;
    };
    if (filters.sort === "price-asc") result.sort(byValue(startingPrice));
    else if (filters.sort === "unit-price") result.sort(byValue(per100));
    else if (filters.sort === "name") result.sort((a,b) => a.name.localeCompare(b.name, "es"));
    else if (filters.sort === "new") result.sort((a,b) => Number(b.isNew) - Number(a.isNew) || a.rank - b.rank);
    else result.sort((a,b) => a.rank - b.rank);
    return result;
  }

  function recommend(products, cart, limit = 3) {
    const selected = cart.map(row => findProduct(products, row.productId)).filter(Boolean);
    const ids = new Set(selected.map(product => product.id));
    const occasions = new Set(selected.flatMap(product => product.occasions));
    const categories = new Set(selected.map(product => product.category));
    const score = product => product.occasions.filter(occasion => occasions.has(occasion)).length * 5
      + (categories.has(product.category) ? 1 : 2) + (product.isNew ? 1 : 0);
    return products.filter(product => !ids.has(product.id) && !product.quoteOnly && product.availability !== "Agotado")
      .sort((a,b) => score(b) - score(a) || a.rank - b.rank).slice(0, limit);
  }

  function bundleValue(product, products) {
    if (!product.bundle) return null;
    const regular = product.bundle.reduce((sum, item) => sum + variant(findProduct(products,item.id),item.label).price * item.quantity, 0);
    return {regular, saving:Math.max(0, regular - product.variants[0].price)};
  }

  function quoteMessage(product, label) {
    const selected = variant(product, label);
    if (!product?.quoteOnly || !selected) return "";
    return ["Hola Deshidrataditos, quiero consultar este producto:", "",
      `Producto: ${product.name}`, `Opción: ${selected.label}`, "",
      "¿Me confirmas la disponibilidad, las presentaciones y el precio de esta opción?",
      "También quisiera conocer la fecha estimada de preparación y entrega."
    ].join("\n");
  }

  function deliveryMessage({postcode,city,state,delivery} = {}) {
    const destination = {postcode:cleanText(postcode,10),city:cleanText(city,120),state:cleanText(state,120)};
    if (!/^[0-9]{5}$/.test(destination.postcode) || !destination.city || !destination.state) return "";
    return ["Hola, quisiera confirmar una entrega " + (delivery === "regional" ? "regional" : "nacional") + ".",
      "C.P.: " + destination.postcode, "Municipio/ciudad: " + destination.city, "Estado: " + destination.state,
      delivery === "regional" ? "Por favor confirma cobertura y costo." : "Tarifa de catálogo: $200; gratis desde $2,000 de compra."
    ].join("\n");
  }

  function orderMessage({cart, products, address = {}, delivery, payment, notes = ""}) {
    const clean = sanitizeCart(cart, products);
    const total = totals(clean, delivery);
    if (!clean.length) return "";
    const fieldLimits = {name:120,phone:20,email:120,postcode:5,street:120,neighborhood:120,city:120,state:120,references:300};
    const contact = Object.fromEntries(Object.entries(fieldLimits).map(([field,limit]) => [field,cleanText(address?.[field],limit)]));
    const comment = cleanText(notes,500);
    const lines = clean.flatMap(row => {
      const product = findProduct(products, row.productId);
      const result = [`• ${product.name} | ${row.weight} × ${row.quantity} | $${row.price * row.quantity} MXN | ${product.availability}`];
      if (product.bundle) result.push(`  Contenido por paquete: ${product.bundle.map(item => `${item.quantity} × ${findProduct(products,item.id).name} (${item.label})`).join(", ")}`);
      return result;
    });
    return ["Hola Deshidrataditos, quiero confirmar este pedido:", "", ...lines, "",
      `Subtotal: $${total.subtotal} MXN`,
      total.shipping === null ? "Entrega regional: costo por confirmar" : `Envío: ${total.shipping === 0 ? "gratis" : `$${total.shipping} MXN`}`,
      `${total.shipping === null ? "Total sin entrega regional" : "Total de catálogo"}: $${total.total} MXN`,
      `Entrega: ${delivery === "regional" ? "Regional (cobertura por confirmar)" : "Nacional"}`,
      `Preferencia de pago: ${payment === "contra-entrega" ? "Contra entrega (sujeto a cobertura regional)" : "Transferencia"}`,
      "", "Datos de envío:", `Nombre: ${contact.name}`, `Teléfono: ${contact.phone}`,
      contact.email ? `Correo: ${contact.email}` : null, `C.P.: ${contact.postcode}`,
      `Dirección: ${contact.street}`, `Colonia: ${contact.neighborhood}`,
      `Municipio/ciudad: ${contact.city}`, `Estado: ${contact.state}`,
      contact.references ? `Referencias: ${contact.references}` : null,
      comment ? `Notas del pedido: ${comment}` : null, "",
      "Por favor confirma disponibilidad, ingredientes y fecha de preparación/entrega antes del pago."
    ].filter(line => line !== null).join("\n");
  }
  globalThis.DeshidrataditosCommerce = {MAX_QUANTITY, FREE_SHIPPING, NATIONAL_SHIPPING, normalize, variant, findProduct, cleanText, readCart, sanitizeCart, addItem, totals, filterProducts, recommend, bundleValue, quoteMessage, deliveryMessage, orderMessage};
})();
