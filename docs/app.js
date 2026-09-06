const PRODUCTS = [
  {
    id: "jerky-res",
    name: "Jerky de res",
    category: "jerky",
    type: "Cecina tipo jerky",
    description: "Carne de res con finas hierbas y sal ahumada. Picante bajo a intermedio.",
    availability: "Disponible",
    prices: { "50 g": 89, "100 g": 169, "250 g": 399, "1 kg": 1490 },
    bg: "#ead2bc",
    color: "#542311"
  },
  {
    id: "jerky-conejo",
    name: "Jerky de conejo",
    category: "jerky",
    type: "Cecina tipo jerky",
    description: "Carne de conejo con finas hierbas y sal ahumada. Elaboración sobre pedido.",
    availability: "Sobre pedido",
    prices: { "50 g": 119, "100 g": 219, "250 g": 519, "1 kg": 1990 },
    bg: "#e7ddd3",
    color: "#6b442c"
  },
  {
    id: "pina-chile",
    name: "Piña con chile",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Dulce y tropical con chile en polvo, sal y un picante amable.",
    availability: "Disponible",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#f7d45d",
    color: "#b64a1d"
  },
  {
    id: "fresa-chile",
    name: "Fresa con chile",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Notas dulces y ácidas con chile en polvo y una pizca de sal.",
    availability: "Disponible",
    prices: { "50 g": 49, "100 g": 89, "250 g": 209, "1 kg": 749 },
    bg: "#f5b1a6",
    color: "#a62622"
  },
  {
    id: "mango-chile",
    name: "Mango con chile",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Mango de sabor concentrado con chile y sal. Disponible sobre pedido.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#ffc447",
    color: "#a74319"
  },
  {
    id: "manzana-canela",
    name: "Manzana con canela",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Crujiente, aromática y naturalmente dulce. Una opción sin picante.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#ead39f",
    color: "#75401e"
  },
  {
    id: "platano-natural",
    name: "Plátano natural",
    category: "fruit",
    type: "Fruta deshidratada",
    description: "Práctico, dulce y listo para llevar. Sin chile y sobre pedido.",
    availability: "Sobre pedido",
    prices: { "50 g": 29, "100 g": 49, "250 g": 109, "1 kg": 399 },
    bg: "#f1dc7f",
    color: "#725819"
  },
  {
    id: "betabel",
    name: "Chips de betabel",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Láminas crujientes con chile en polvo, sal y un color naturalmente intenso.",
    availability: "Disponible",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#d7a0b3",
    color: "#7a193d"
  },
  {
    id: "jicama",
    name: "Jícama deshidratada",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Ligera y crujiente, con chile en polvo y sal. Picante bajo a intermedio.",
    availability: "Disponible",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#efe6d5",
    color: "#6f5135"
  },
  {
    id: "pepino",
    name: "Pepino deshidratado",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Una botana fresca de sabor con chile en polvo y sal.",
    availability: "Disponible",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#b8db9d",
    color: "#295f2d"
  },
  {
    id: "camote",
    name: "Chips de camote",
    category: "vegetable",
    type: "Vegetal deshidratado",
    description: "Dulzor natural, textura crujiente y un toque de chile con sal.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 139, "1 kg": 499 },
    bg: "#efb17d",
    color: "#8d3e19"
  },
  {
    id: "mix-vegetales",
    name: "Mix de vegetales",
    category: "vegetable",
    type: "Selección mixta",
    description: "Una mezcla para probar diferentes sabores y texturas en una sola bolsa.",
    availability: "Sobre pedido",
    prices: { "50 g": 39, "100 g": 69, "250 g": 159, "1 kg": 549 },
    bg: "#c7dc75",
    color: "#3b6728"
  },
  {
    id: "tisana-floral",
    name: "Tisana floral",
    category: "flower",
    type: "Mezcla para infusión",
    description: "Mezcla aromática de flores deshidratadas para preparar una bebida caliente o fría.",
    availability: "Sobre pedido",
    prices: { "50 g": 55, "100 g": 99, "250 g": 229, "1 kg": 849 },
    bg: "#f2b7c6",
    color: "#8b3151"
  },
  {
    id: "flor-jamaica",
    name: "Flor de jamaica",
    category: "flower",
    type: "Flor deshidratada",
    description: "De sabor ácido y color intenso, ideal para preparar infusiones calientes o agua fresca.",
    availability: "Sobre pedido",
    prices: { "50 g": 35, "100 g": 59, "250 g": 129, "1 kg": 449 },
    bg: "#d895aa",
    color: "#731d3d"
  },
  {
    id: "manzanilla",
    name: "Manzanilla",
    category: "flower",
    type: "Flor para infusión",
    description: "Flores deshidratadas de aroma suave y delicado para preparar una infusión reconfortante.",
    availability: "Sobre pedido",
    prices: { "50 g": 45, "100 g": 79, "250 g": 179, "1 kg": 649 },
    bg: "#f4df80",
    color: "#7a5d16"
  },
  {
    id: "petalos-rosa",
    name: "Pétalos de rosa",
    category: "flower",
    type: "Flor para infusión",
    description: "Pétalos deshidratados de aroma floral, pensados para tisanas y mezclas especiales.",
    availability: "Sobre pedido",
    prices: { "50 g": 65, "100 g": 119, "250 g": 279, "1 kg": 999 },
    bg: "#efb0bc",
    color: "#862f48"
  }
];

const PRODUCT_PHOTOS = {
  "jerky-res": { src: "assets/product-jerky-temp.webp", position: "left center", scale: 1.45 },
  "jerky-conejo": { src: "assets/product-jerky-temp.webp", position: "right center", scale: 1.45 },
  "pina-chile": { src: "assets/product-fruits-temp.webp", position: "center top", scale: 1.55 },
  "fresa-chile": { src: "assets/product-fruits-temp.webp", position: "left top", scale: 1.55 },
  "mango-chile": { src: "assets/product-fruits-temp.webp", position: "right top", scale: 1.55 },
  "manzana-canela": { src: "assets/product-fruits-temp.webp", position: "left bottom", scale: 1.55 },
  "platano-natural": { src: "assets/product-fruits-temp.webp", position: "right bottom", scale: 1.55 },
  "betabel": { src: "assets/product-vegetables-temp.webp", position: "left top", scale: 1.55 },
  "jicama": { src: "assets/product-vegetables-temp.webp", position: "center top", scale: 1.55 },
  "pepino": { src: "assets/product-vegetables-temp.webp", position: "right top", scale: 1.55 },
  "camote": { src: "assets/product-vegetables-temp.webp", position: "left bottom", scale: 1.55 },
  "mix-vegetales": { src: "assets/product-vegetables-temp.webp", position: "right bottom", scale: 1.55 },
  "tisana-floral": { src: "assets/product-flowers-temp.webp", position: "right bottom", scale: 1.55 },
  "flor-jamaica": { src: "assets/product-flowers-temp.webp", position: "left top", scale: 1.55 },
  "manzanilla": { src: "assets/product-flowers-temp.webp", position: "center top", scale: 1.55 },
  "petalos-rosa": { src: "assets/product-flowers-temp.webp", position: "left bottom", scale: 1.55 }
};

const FREE_SHIPPING = 2000;
const NATIONAL_SHIPPING_FEE = 200;
const MERCADO_PAGO_URL = "";
const WHATSAPP_NUMBER = "523931173611";

let cart = JSON.parse(localStorage.getItem("deshidrataditos-cart") || "[]");
let toastTimer;

const money = value => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);

function productCard(product) {
  const priceEntries = Object.entries(product.prices);
  const options = priceEntries.map(([weight, price]) => `<option value="${weight}" data-price="${price}">${weight} · ${money(price)}</option>`).join("");
  const badgeClass = product.availability === "Sobre pedido" ? "preorder" : "";
  const photo = PRODUCT_PHOTOS[product.id];
  return `
    <article class="product-card" data-product-card="${product.id}">
      <div class="product-image-placeholder" style="--product-bg:${product.bg};--product-color:${product.color};--photo-position:${photo.position};--photo-scale:${photo.scale}">
        <img src="${photo.src}" alt="Fotografía temporal de ${product.name}" loading="lazy" width="1200" height="800">
        <span class="product-badge ${badgeClass}">${product.availability}</span>
      </div>
      <div class="product-body">
        <span class="product-type">${product.type}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-controls">
          <label>Presentación
            <select class="weight-select" aria-label="Presentación de ${product.name}">${options}</select>
          </label>
          <span class="price">${money(priceEntries[0][1])}</span>
        </div>
        <button class="button button-primary add-button" type="button" data-add-product="${product.id}">Agregar al carrito</button>
      </div>
    </article>`;
}

function renderProducts() {
  document.getElementById("featured-grid").innerHTML = [PRODUCTS[0], PRODUCTS[2], PRODUCTS[7]].map(productCard).join("");
  document.getElementById("jerky-grid").innerHTML = PRODUCTS.filter(p => p.category === "jerky").map(productCard).join("");
  document.getElementById("fruit-grid").innerHTML = PRODUCTS.filter(p => p.category === "fruit").map(productCard).join("");
  document.getElementById("vegetable-grid").innerHTML = PRODUCTS.filter(p => p.category === "vegetable").map(productCard).join("");
  document.getElementById("flower-grid").innerHTML = PRODUCTS.filter(p => p.category === "flower").map(productCard).join("");
}

function showView(name, updateHash = true) {
  const next = document.querySelector(`[data-view="${name}"]`) || document.querySelector('[data-view="inicio"]');
  document.querySelectorAll(".view").forEach(view => view.classList.toggle("active", view === next));
  document.querySelectorAll(".main-nav [data-view-link]").forEach(link => link.classList.toggle("active", link.dataset.viewLink === name));
  document.getElementById("main-nav").classList.remove("open");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
  closeCart();
  if (updateHash) history.replaceState(null, "", name === "inicio" ? "#inicio" : `#${name}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function saveCart() {
  localStorage.setItem("deshidrataditos-cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(productId, weight) {
  const product = PRODUCTS.find(item => item.id === productId);
  if (!product) return;
  const key = `${productId}-${weight}`;
  const existing = cart.find(item => item.key === key);
  if (existing) existing.quantity += 1;
  else cart.push({ key, productId, weight, price: product.prices[weight], quantity: 1 });
  saveCart();
  showToast(`${product.name} de ${weight} se agregó al carrito`);
}

function updateItem(key, change) {
  const item = cart.find(entry => entry.key === key);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.key !== key);
  saveCart();
}

function removeItem(key) {
  cart = cart.filter(item => item.key !== key);
  saveCart();
}

function renderRecommendationDetails(recommendations) {
  document.getElementById("recommendation-list").innerHTML = recommendations.map(product => {
    const [weight, price] = Object.entries(product.prices)[0];
    const photo = PRODUCT_PHOTOS[product.id];
    return `<article class="recommendation-item">
      <img src="${photo.src}" alt="${product.name}" loading="lazy" style="--rec-position:${photo.position}">
      <div><strong>${product.name}</strong><span>${product.type}</span><b>${weight} · ${money(price)}</b></div>
      <button type="button" data-quick-add="${product.id}" data-weight="${weight}" aria-label="Agregar ${product.name} al carrito">+</button>
    </article>`;
  }).join("");
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-subtotal").textContent = money(subtotal);
  document.getElementById("cart-empty").classList.toggle("visible", cart.length === 0);
  document.getElementById("cart-recommendations").style.display = cart.length ? "block" : "none";
  document.getElementById("cart-footer").style.display = cart.length ? "block" : "none";

  document.getElementById("cart-items").innerHTML = cart.map(item => {
    const product = PRODUCTS.find(entry => entry.id === item.productId);
    return `
      <div class="cart-item">
        <div><strong>${product.name}</strong><p>${item.weight} · ${product.availability}</p></div>
        <div class="cart-item-price">${money(item.price * item.quantity)}</div>
        <div class="cart-item-actions">
          <button type="button" data-cart-change="-1" data-key="${item.key}" aria-label="Restar uno">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-cart-change="1" data-key="${item.key}" aria-label="Sumar uno">+</button>
        </div>
        <button class="remove-item" type="button" data-remove-key="${item.key}">Quitar</button>
      </div>`;
  }).join("");

  document.getElementById("checkout-items").innerHTML = cart.map(item => {
    const product = PRODUCTS.find(entry => entry.id === item.productId);
    return `<div class="checkout-item"><span class="checkout-item-visual" style="--item-bg:${product.bg}">${item.quantity}</span><div><strong>${product.name}</strong><small>${item.weight} × ${item.quantity}</small></div><b>${money(item.price * item.quantity)}</b></div>`;
  }).join("");
  document.getElementById("checkout-subtotal").textContent = money(subtotal);

  const selectedIds = new Set(cart.map(item => item.productId));
  const recommendations = PRODUCTS.filter(product => !selectedIds.has(product.id)).slice(0, 3);
  document.getElementById("recommendation-list").innerHTML = recommendations.map(product => {
    const [weight, price] = Object.entries(product.prices)[0];
    return `<article class="recommendation-item"><div style="--rec-bg:${product.bg}"><strong>${product.name}</strong><span>${weight} · ${money(price)}</span></div><button type="button" data-quick-add="${product.id}" data-weight="${weight}" aria-label="Agregar ${product.name} al carrito">+</button></article>`;
  }).join("");
  renderRecommendationDetails(recommendations);

  const percentage = Math.min(100, subtotal / FREE_SHIPPING * 100);
  document.getElementById("shipping-progress-bar").style.width = `${percentage}%`;
  document.getElementById("shipping-progress-text").textContent = subtotal >= FREE_SHIPPING
    ? "¡Tu pedido ya tiene envío gratis a todo México!"
    : subtotal > 0
      ? `Te faltan ${money(FREE_SHIPPING - subtotal)} para el envío gratis`
      : "Envío gratis a partir de $2,000";
  updateCheckoutTotals();
}

function selectedDelivery(formPrefix) {
  return document.querySelector(`input[name="${formPrefix}-delivery"]:checked`)?.value || "national";
}

function shippingCost(subtotal, delivery) {
  if (subtotal >= FREE_SHIPPING) return 0;
  return delivery === "national" ? NATIONAL_SHIPPING_FEE : null;
}

function updateCheckoutTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = selectedDelivery("checkout");
  const fee = shippingCost(subtotal, delivery);
  const shippingElement = document.getElementById("cart-shipping");
  const totalElement = document.getElementById("cart-grand-total");
  const summaryElement = document.getElementById("shipping-summary");
  if (!shippingElement || !totalElement || !summaryElement) return;

  if (fee === null) {
    shippingElement.textContent = "Por confirmar";
    totalElement.textContent = money(subtotal);
    summaryElement.textContent = "La entrega regional se confirma según la ubicación indicada.";
  } else {
    shippingElement.textContent = fee === 0 ? "Gratis" : money(fee);
    totalElement.textContent = money(subtotal + fee);
    summaryElement.textContent = fee === 0
      ? "Envío gratis aplicado por compra desde $2,000."
      : "Envío nacional: $200.";
  }
}

function updateQuoteShipping() {
  const delivery = selectedDelivery("quote");
  document.getElementById("quote-shipping-label").textContent = delivery === "national"
    ? "Envío nacional"
    : "Entrega en zona regional";
  document.getElementById("quote-shipping-price").textContent = delivery === "national" ? "$200" : "Por confirmar";
}

function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("drawer-backdrop").classList.add("open");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.getElementById("cart-close").focus();
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("drawer-backdrop").classList.remove("open");
  document.getElementById("cart-drawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function addressData(prefix) {
  return {
    postcode: document.getElementById(`${prefix}-postcode`).value.trim(),
    name: document.getElementById(`${prefix}-name`).value.trim(),
    phone: document.getElementById(`${prefix}-phone`).value.trim(),
    state: document.getElementById(`${prefix}-state`).value.trim(),
    street: document.getElementById(`${prefix}-street`).value.trim(),
    neighborhood: document.getElementById(`${prefix}-neighborhood`).value.trim(),
    city: document.getElementById(`${prefix}-city`).value.trim(),
    references: document.getElementById(`${prefix}-references`).value.trim()
  };
}

function addressLines(address) {
  return [
    `Nombre: ${address.name}`,
    `Teléfono: ${address.phone}`,
    `Código postal: ${address.postcode}`,
    `Dirección: ${address.street}`,
    `Colonia: ${address.neighborhood}`,
    `Municipio/ciudad: ${address.city}`,
    `Estado: ${address.state}`,
    address.references ? `Referencias: ${address.references}` : null
  ].filter(Boolean);
}

function cartMessage(payment, delivery, address) {
  const lines = cart.map(item => {
    const product = PRODUCTS.find(entry => entry.id === item.productId);
    return `• ${product.name}, ${item.weight} × ${item.quantity} — ${money(item.price * item.quantity)}`;
  });
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = shippingCost(subtotal, delivery);
  const paymentLabel = { "mercado-pago": "Mercado Pago", "transferencia": "Transferencia", "contra-entrega": "Contra entrega" }[payment];
  return [
    "Hola Deshidrataditos, quiero realizar este pedido:",
    "",
    ...lines,
    "",
    `Subtotal: ${money(subtotal)}`,
    fee === null ? "Entrega regional: costo por confirmar" : fee === 0 ? "Envío: gratis" : `Envío: ${money(fee)}`,
    fee === null ? `Total provisional: ${money(subtotal)}` : `Total: ${money(subtotal + fee)}`,
    `Tipo de entrega: ${delivery === "regional" ? "Zona regional: Ocotlán y Briseñas" : "Envío nacional"}`,
    `Pago: ${paymentLabel}`,
    "",
    "Datos de envío:",
    ...addressLines(address)
  ].join("\n");
}

function checkout(event) {
  event.preventDefault();
  if (!cart.length) return;
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const delivery = selectedDelivery("checkout");
  const address = addressData("checkout");
  if (payment === "contra-entrega" && delivery !== "regional") {
    showToast("La contra entrega solo está disponible en la zona regional");
    return;
  }
  if (payment === "mercado-pago" && MERCADO_PAGO_URL) {
    window.location.href = MERCADO_PAGO_URL;
    return;
  }
  if (payment === "mercado-pago") {
    showToast("Mercado Pago se habilitará al conectar la cuenta comercial");
  }
  const message = encodeURIComponent(cartMessage(payment, delivery, address));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener");
}

renderProducts();
renderCart();
document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("change", event => {
  if (!event.target.matches(".weight-select")) return;
  const card = event.target.closest(".product-card");
  const product = PRODUCTS.find(item => item.id === card.dataset.productCard);
  card.querySelector(".price").textContent = money(product.prices[event.target.value]);
});

document.addEventListener("click", event => {
  const viewLink = event.target.closest("[data-view-link]");
  if (viewLink) showView(viewLink.dataset.viewLink);

  const addButton = event.target.closest("[data-add-product]");
  if (addButton) {
    const card = addButton.closest(".product-card");
    addToCart(addButton.dataset.addProduct, card.querySelector(".weight-select").value);
  }

  const changeButton = event.target.closest("[data-cart-change]");
  if (changeButton) updateItem(changeButton.dataset.key, Number(changeButton.dataset.cartChange));

  const removeButton = event.target.closest("[data-remove-key]");
  if (removeButton) removeItem(removeButton.dataset.removeKey);

  const quickAddButton = event.target.closest("[data-quick-add]");
  if (quickAddButton) addToCart(quickAddButton.dataset.quickAdd, quickAddButton.dataset.weight);
});

document.getElementById("menu-toggle").addEventListener("click", () => {
  const nav = document.getElementById("main-nav");
  const open = nav.classList.toggle("open");
  document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
});
document.getElementById("cart-trigger").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
document.getElementById("drawer-backdrop").addEventListener("click", closeCart);
document.getElementById("cart-checkout").addEventListener("submit", checkout);
document.getElementById("back-to-cart").addEventListener("click", openCart);
document.querySelectorAll('input[name="checkout-delivery"]').forEach(input => input.addEventListener("change", updateCheckoutTotals));
document.querySelectorAll('input[name="quote-delivery"]').forEach(input => input.addEventListener("change", updateQuoteShipping));
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });

document.getElementById("quote-form").addEventListener("submit", event => {
  event.preventDefault();
  const delivery = selectedDelivery("quote");
  const address = addressData("quote");
  const price = delivery === "national" ? "$200" : "por confirmar según ubicación";
  const message = encodeURIComponent([
    "Hola Deshidrataditos, quiero registrar mis datos de envío:",
    "",
    `Tipo de entrega: ${delivery === "regional" ? "Zona regional" : "Envío nacional"}`,
    `Costo de envío: ${price}`,
    ...addressLines(address)
  ].join("\n"));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener");
});

const initialView = location.hash.replace("#", "") || "inicio";
showView(initialView, false);
