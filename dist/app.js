/* Browser controller; catalog and commerce rules are shared by every view. */
(() => {
  "use strict";
  const {products: PRODUCTS} = globalThis.DeshidrataditosCatalog;
  const C = globalThis.DeshidrataditosCommerce;
  const $ = id => document.getElementById(id);
  const money = value => new Intl.NumberFormat("es-MX", {style:"currency",currency:"MXN",maximumFractionDigits:0}).format(value);
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const STORAGE_KEY = "deshidrataditos-cart";
  const filters = {search:"",category:"all",occasion:"all",sort:"recommended",onlyNew:false};
  const selections = new Map();
  let cart = [], timer, focusBeforeCart, detailId;
  try { cart = C.readCart(localStorage.getItem(STORAGE_KEY),PRODUCTS); } catch { cart = []; }
  const options = (product,selected) => product.variants.map(item => '<option value="' + escape(item.label) + '"' + (selected === item.label ? " selected" : "") + ">" + escape(item.label) + (product.quoteOnly ? "" : " · " + money(item.price)) + "</option>").join("");
  const photo = (product,display = "card") => {
    const localImage = /^assets\/(?:products\/)?[a-z0-9][a-z0-9.-]*\.(?:jpg|png|webp)$/;
    const src = localImage.test(product.photo.src) ? product.photo.src : "assets/logo-deshidrataditos.jpg";
    const thumbnail = localImage.test(product.photo.thumbnail || "") ? product.photo.thumbnail : src;
    const position = ["center","left center","right center","left top","center top","right top","left bottom","right bottom"].includes(product.photo.position) ? product.photo.position : "center";
    const sizes = display === "detail" ? "(max-width: 800px) calc(100vw - 32px), 450px" : display === "small" ? "64px" : "(max-width: 600px) calc(100vw - 40px), (max-width: 960px) 45vw, 380px";
    return '<img src="' + escape(src) + '" srcset="' + escape(thumbnail) + ' 480w, ' + escape(src) + ' 1000w" sizes="' + sizes + '" alt="' + escape(product.photo.alt) + '" class="photo-' + position.replaceAll(" ","-") + '" loading="' + (display === "detail" ? "eager" : "lazy") + '" decoding="async" width="1000" height="1000">';
  };
  const priceLabel = (product,label) => product.quoteOnly ? "Por cotizar" : money(C.variant(product,label).price);
  const per100 = (product,label) => { if (product.quoteOnly) return "Precio y presentación por confirmar"; const item = C.variant(product,label); return money(item.price / item.grams * 100) + " / 100 g"; };
  const whatsappUrl = message => "https://wa.me/523931173611?text=" + encodeURIComponent(message);
  const deliveryFor = prefix => document.querySelector('input[name="' + prefix + '-delivery"]:checked')?.value || "national";
  function card(product) {
    const label = selections.get(product.id) || product.variants[0].label;
    const bundle = C.bundleValue(product,PRODUCTS);
    return '<article class="product-card" data-product-card="' + escape(product.id) + '">' +
      '<button type="button" class="product-photo-button" data-detail="' + escape(product.id) + '" aria-label="Ver detalles de ' + escape(product.name) + '"><span class="product-image-placeholder">' + photo(product) +
      (product.isNew ? '<span class="new-badge">Nuevo</span>' : "") + '<span class="image-caption">Imagen ilustrativa</span></span></button>' +
      '<div class="product-body"><div class="product-meta"><span class="product-type">' + escape(product.type) + '</span><span class="availability ' + (product.availability === "Sobre pedido" ? "preorder" : "") + '">' + escape(product.availability) + '</span></div>' +
      '<h3><button type="button" data-detail="' + escape(product.id) + '">' + escape(product.name) + '</button></h3><p>' + escape(product.description) + '</p>' +
      '<div class="product-tags">' + product.tags.slice(0,2).map(tag => "<span>" + escape(tag) + "</span>").join("") + '</div>' +
      (bundle?.saving ? '<p class="bundle-saving">Ahorras ' + money(bundle.saving) + ' frente a las tres bolsas por separado.</p>' : "") +
      '<div class="product-controls' + (product.quoteOnly ? ' quote-controls' : '') + '"><label>' + (product.quoteOnly ? 'Opción' : 'Presentación') + '<select class="weight-select" aria-label="' + (product.quoteOnly ? 'Opción' : 'Presentación') + ' de ' + escape(product.name) + '">' + options(product,label) + '</select></label><div class="price-block"><span class="price">' + priceLabel(product,label) + '</span><small class="unit-price">' + per100(product,label) + '</small></div></div>' +
      (product.quoteOnly ? '<a class="button button-primary add-button product-quote" target="_blank" rel="noopener noreferrer" href="' + whatsappUrl(C.quoteMessage(product,label)) + '">Consultar disponibilidad ↗</a>' : '<button class="button button-primary add-button" type="button" data-add-product="' + escape(product.id) + '">Agregar al carrito</button>') + '<button class="product-detail-link" type="button" data-detail="' + escape(product.id) + '">Ingredientes y conservación ↗</button></div></article>';
  }
  function renderCatalog() {
    const result = C.filterProducts(PRODUCTS,filters);
    $("catalog-grid").innerHTML = result.map(card).join("");
    $("catalog-count").textContent = result.length + (result.length === 1 ? " producto" : " productos");
    $("catalog-empty").hidden = result.length > 0;
    $("catalog-reset").hidden = !filters.search && filters.category === "all" && filters.occasion === "all" && !filters.onlyNew && filters.sort === "recommended";
    document.querySelectorAll("[data-category]").forEach(button => { const selected = button.dataset.category === filters.category; button.setAttribute("aria-pressed",String(selected)); button.classList.toggle("selected",selected); });
  }
  function renderProducts() {
    Object.entries({"jerky-grid":"jerky","fruit-grid":"fruit","vegetable-grid":"vegetable","flower-grid":"flower","citrus-grid":"citrus","pantry-grid":"pantry","bundle-grid":"bundle"}).forEach(([id,category]) => { $(id).innerHTML = C.filterProducts(PRODUCTS,{category}).map(card).join(""); });
    $("featured-grid").innerHTML = ["fruta-temporada","fresa-chile","platano-macho"].map(id => card(C.findProduct(PRODUCTS,id))).join("");
    $("new-grid").innerHTML = ["tomate-cherry","ajo-hojuelas","naranja-rodajas"].map(id => card(C.findProduct(PRODUCTS,id))).join("");
    renderCatalog();
  }
  function resetFilters() {
    Object.assign(filters,{search:"",category:"all",occasion:"all",sort:"recommended",onlyNew:false});
    $("catalog-search").value = ""; $("catalog-occasion").value = "all"; $("catalog-sort").value = "recommended"; $("catalog-new").checked = false;
    renderCatalog();
  }
  const packChoices = Array.from(document.querySelectorAll("[data-pack-choice]"));
  const packPreviews = Array.from(document.querySelectorAll("[data-pack-preview]"));
  const packIds = () => packChoices.map(select => select.value);
  function renderCustomPack() {
    const ids = packIds(), eligible = C.customPackOptions(PRODUCTS);
    const selected = ids.map(id => eligible.find(product => product.id === id));
    const complete = C.customPack(PRODUCTS,ids);
    const count = selected.filter(Boolean).length;
    const subtotal = selected.reduce((sum,product) => sum + (product ? C.variant(product,"50 g").price : 0),0);
    packChoices.forEach((select,index) => {
      Array.from(select.options).forEach(option => { option.disabled = Boolean(option.value) && ids.some((id,other) => other !== index && id === option.value); });
      const product = selected[index];
      packPreviews[index].innerHTML = product ? photo(product,"small") + '<div><strong>' + escape(product.name) + '</strong><span class="availability ' + (product.availability === "Sobre pedido" ? "preorder" : "") + '">' + escape(product.availability) + '</span><button class="text-link" type="button" data-detail="' + escape(product.id) + '" data-detail-weight="50 g" aria-label="Ver ingredientes de ' + escape(product.name) + '">Ver ingredientes</button></div>' : '<span class="pack-placeholder" aria-hidden="true">' + (index + 1) + '</span><p>' + ["Tu primer antojo","Un sabor por descubrir","El toque final"][index] + '</p>';
    });
    $("custom-pack-progress").textContent = count + " de 3 sabores elegidos" + (complete ? " · 150 g en total" : "");
    $("custom-pack-total-label").textContent = complete ? "Total de tu paquete" : "Total de tu selección";
    $("custom-pack-total").textContent = money(complete ? complete.subtotal : subtotal);
    $("custom-pack-add").disabled = !complete;
    $("custom-pack-add").textContent = complete ? "Agregar las 3 bolsas al carrito" : "Elige tus 3 sabores";
    $("custom-pack-reset").disabled = count === 0;
    $("custom-pack-preorder").hidden = !selected.some(product => product?.availability === "Sobre pedido");
    $("custom-pack-error").textContent = eligible.length < 3 ? "Por ahora no hay tres sabores para combinar. Puedes elegir bolsas individuales en la tienda." : "";
  }
  function initializeCustomPack() {
    const eligible = C.customPackOptions(PRODUCTS);
    packChoices.forEach(select => {
      select.innerHTML = '<option value="">Elige un sabor</option>' + eligible.map(product => '<option value="' + escape(product.id) + '">' + escape(product.name) + ' · ' + money(C.variant(product,"50 g").price) + (product.availability === "Sobre pedido" ? " · Sobre pedido" : "") + '</option>').join("");
      select.addEventListener("change",renderCustomPack);
    });
    renderCustomPack();
  }
  function setBackgroundInert(value) { document.querySelectorAll("header,main,footer,.announcement,.whatsapp-float,.skip-link").forEach(element => { element.inert = value; }); }
  function closeCart(restore = true) {
    const wasOpen = $("cart-drawer").classList.contains("open");
    $("cart-drawer").classList.remove("open"); $("drawer-backdrop").classList.remove("open");
    $("cart-drawer").setAttribute("aria-hidden","true"); $("cart-drawer").inert = true;
    $("cart-trigger").setAttribute("aria-expanded","false"); setBackgroundInert(false);
    if (!$("product-dialog").open) document.body.style.overflow = "";
    if (wasOpen && restore && focusBeforeCart?.isConnected) focusBeforeCart.focus();
  }
  function showView(requested,updateHash = true,focus = true) {
    const next = Array.from(document.querySelectorAll("[data-view]")).find(view => view.dataset.view === requested) || document.querySelector('[data-view="inicio"]');
    const name = next.dataset.view;
    document.querySelectorAll(".view").forEach(view => { view.classList.toggle("active",view === next); view.hidden = view !== next; });
    document.querySelectorAll(".main-nav [data-view-link]").forEach(link => {
      const active = link.dataset.viewLink === name || link.dataset.viewLink === "catalogo" && ["cecina","frutas","vegetales","flores","citricos","cocina","paquetes"].includes(name);
      link.classList.toggle("active",active); if (active) link.setAttribute("aria-current","page"); else link.removeAttribute("aria-current");
    });
    $("main-nav").classList.remove("open"); $("menu-toggle").setAttribute("aria-expanded","false"); closeCart(false);
    if (updateHash && location.hash !== "#" + name) history.pushState(null,"","#" + name);
    const heading = name === "checkout" ? $(cart.length ? "checkout-content" : "checkout-empty").querySelector("h1") : next.querySelector("h1");
    document.title = (heading?.textContent.replace(/\s+/g," ").trim() || "Inicio") + " | Deshidrataditos";
    if (focus && heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    window.scrollTo({top:0,behavior:"auto"});
  }
  function toast(message) { $("toast").textContent = message; $("toast").classList.add("show"); clearTimeout(timer); timer = setTimeout(() => $("toast").classList.remove("show"),3200); }
  function invalidateHandoff(prefix) { $(prefix + "-whatsapp").hidden = true; $(prefix + "-whatsapp").removeAttribute("href"); $(prefix + "-status").textContent = ""; }
  function saveCart() {
    cart = C.sanitizeCart(cart,PRODUCTS);
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(cart)); } catch { toast("Tu carrito seguirá disponible mientras mantengas esta página abierta."); }
    renderCart(); invalidateHandoff("checkout");
  }
  function addToCart(id,label,quantity = 1) {
    const product = C.findProduct(PRODUCTS,id);
    if (!C.variant(product,label) || product.quoteOnly) return;
    const current = cart.find(row => row.productId === id && row.weight === label);
    if ((current?.quantity || 0) + quantity > C.MAX_QUANTITY) { toast("Para más de 99 unidades, solicita una cotización para tu negocio."); return; }
    cart = C.addItem(cart,PRODUCTS,id,label,quantity);
    toast(product.name + " · " + label + " agregado al carrito"); saveCart();
  }
  function updateCheckoutTotals() {
    const delivery = deliveryFor("checkout"), total = C.totals(cart,delivery), cash = $("payment-cash");
    cash.disabled = delivery !== "regional"; if (cash.disabled && cash.checked) $("payment-transfer").checked = true;
    cash.closest("label").classList.toggle("disabled",cash.disabled);
    $("cart-shipping").textContent = total.shipping === null ? "Por confirmar" : total.shipping === 0 ? "Gratis" : money(total.shipping);
    $("cart-grand-total").textContent = money(total.total);
    $("grand-total-label").textContent = total.shipping === null ? "Total sin entrega" : "Total de catálogo";
    $("shipping-summary").textContent = !cart.length ? "Agrega productos para calcular tu pedido." : total.shipping === null ? "Confirmaremos cobertura y costo de entrega regional antes del pago." : total.shipping === 0 ? "Envío gratis aplicado desde $2,000." : "Envío nacional: $200. La fecha de entrega se confirma con tu pedido.";
  }
  function renderCart() {
    const total = C.totals(cart);
    $("cart-count").textContent = total.count; $("cart-trigger").setAttribute("aria-label","Abrir carrito, " + total.count + " artículos");
    $("cart-subtotal").textContent = money(total.subtotal); $("checkout-subtotal").textContent = money(total.subtotal);
    $("cart-empty").classList.toggle("visible",!cart.length); $("cart-recommendations").hidden = !cart.length; $("cart-footer").hidden = !cart.length;
    $("checkout-submit").disabled = !cart.length; $("checkout-empty").hidden = Boolean(cart.length); $("checkout-content").hidden = !cart.length;
    $("cart-items").innerHTML = cart.map(row => {
      const product = C.findProduct(PRODUCTS,row.productId);
      return '<div class="cart-item"><div><strong>' + escape(product.name) + '</strong><p>' + escape(row.weight) + " · " + escape(product.availability) + '</p></div><div class="cart-item-price">' + money(row.price * row.quantity) + '</div><div class="cart-item-actions"><button type="button" data-cart-change="-1" data-key="' + escape(row.key) + '" aria-label="Restar una unidad de ' + escape(product.name) + '">−</button><span>' + row.quantity + '</span><button type="button" data-cart-change="1" data-key="' + escape(row.key) + '" aria-label="Sumar una unidad de ' + escape(product.name) + '"' + (row.quantity >= C.MAX_QUANTITY ? " disabled" : "") + '>+</button></div><button class="remove-item" type="button" data-remove-key="' + escape(row.key) + '" aria-label="Quitar ' + escape(product.name) + '">Quitar</button></div>';
    }).join("");
    $("checkout-items").innerHTML = cart.map(row => { const product = C.findProduct(PRODUCTS,row.productId); return '<div class="checkout-item"><span class="checkout-item-visual">' + row.quantity + '</span><div><strong>' + escape(product.name) + '</strong><small>' + escape(row.weight) + " × " + row.quantity + '</small><small>' + escape(product.availability) + '</small></div><b>' + money(row.price * row.quantity) + '</b></div>'; }).join("");
    $("recommendation-list").innerHTML = C.recommend(PRODUCTS,cart).map(product => {
      const item = product.variants[0];
      return '<article class="recommendation-item">' + photo(product,"small") + '<div><strong>' + escape(product.name) + '</strong><span>' + escape(product.availability) + '</span><b>' + escape(item.label) + " · " + money(item.price) + '</b></div><button type="button" data-quick-add="' + escape(product.id) + '" data-weight="' + escape(item.label) + '" aria-label="Agregar ' + escape(product.name) + '">+</button></article>';
    }).join("");
    $("shipping-progress-bar").style.width = Math.min(100,total.subtotal / C.FREE_SHIPPING * 100) + "%";
    $("shipping-progress-text").textContent = !total.remaining ? "Tu pedido ya tiene envío gratis." : "Te faltan " + money(total.remaining) + " para el envío gratis.";
    $("checkout-preorder").hidden = !cart.some(row => C.findProduct(PRODUCTS,row.productId).availability === "Sobre pedido");
    updateCheckoutTotals();
  }
  function openCart() {
    if ($("product-dialog").open) $("product-dialog").close();
    focusBeforeCart = document.activeElement; $("cart-drawer").inert = false;
    $("cart-drawer").classList.add("open"); $("drawer-backdrop").classList.add("open"); $("cart-drawer").setAttribute("aria-hidden","false");
    $("cart-trigger").setAttribute("aria-expanded","true"); document.body.style.overflow = "hidden"; setBackgroundInert(true); $("cart-close").focus();
  }
  function renderFoodDetails(product,label) {
    const details = product.foodDetails.variants?.[label] || product.foodDetails;
    $("detail-ingredients").innerHTML = details.ingredients.map(ingredient => '<li>' + escape(ingredient) + '</li>').join("");
    $("detail-ingredient-note").textContent = details.note;
    $("detail-ingredient-note").hidden = !details.note;
    $("detail-ingredient-variant").textContent = product.foodDetails.variants ? " · " + label : "";
    $("detail-storage").textContent = product.storage.closed;
    $("detail-opened").textContent = product.storage.opened;
    $("detail-contact").href = whatsappUrl("Hola, quisiera confirmar los ingredientes completos, alérgenos e indicaciones de conservación de " + product.name + " (" + label + ") antes de pedir.");
  }
  function openDetails(id,preferredLabel) {
    const product = C.findProduct(PRODUCTS,id); if (!product) return; detailId = id;
    const label = C.variant(product,preferredLabel)?.label || selections.get(id) || product.variants[0].label;
    const imageCaption = product.id === "tomate-cherry" ? "Opción natural · imagen ilustrativa con IA" : "Imagen ilustrativa generada con IA";
    $("detail-photo").innerHTML = photo(product,"detail") + '<span class="image-caption">' + escape(imageCaption) + '</span>';
    $("detail-type").textContent = product.type; $("detail-title").textContent = product.name;
    $("detail-description").textContent = product.description; $("detail-use").textContent = product.use; $("detail-status").textContent = product.availability;
    $("detail-preorder").hidden = product.availability !== "Sobre pedido"; $("detail-variant").innerHTML = options(product,label);
    $("detail-option-label").textContent = product.quoteOnly ? "Opción" : "Presentación";
    $("detail-variant").setAttribute("aria-label",(product.quoteOnly ? "Opción de " : "Presentación de ") + product.name); $("detail-price").textContent = priceLabel(product,label);
    $("detail-quantity-label").hidden = Boolean(product.quoteOnly); $("detail-add").hidden = Boolean(product.quoteOnly);
    $("detail-quote").hidden = !product.quoteOnly;
    if (product.quoteOnly) $("detail-quote").href = whatsappUrl(C.quoteMessage(product,label)); else $("detail-quote").removeAttribute("href");
    $("detail-unit-price").textContent = per100(product,label); $("detail-quantity").value = 1; $("detail-bundle").hidden = !product.bundle;
    $("detail-bundle-list").innerHTML = product.bundle ? product.bundle.map(item => "<li>" + item.quantity + " bolsa de " + escape(C.findProduct(PRODUCTS,item.id).name) + " · " + escape(item.label) + "</li>").join("") : "";
    renderFoodDetails(product,label);
    $("detail-care").open = true;
    $("product-dialog").showModal(); $("product-dialog").scrollTop = 0; document.body.style.overflow = "hidden";
  }
  function addressData(prefix) { return Object.fromEntries(["postcode","name","phone","email","state","street","neighborhood","city","references"].map(key => [key,$(prefix + "-" + key)?.value.trim() || ""])); }
  function handoff(message,prefix) {
    const link = $(prefix + "-whatsapp"); link.href = whatsappUrl(message); link.hidden = false;
    $(prefix + "-status").textContent = "Resumen listo. Abre WhatsApp para revisarlo y enviarlo. Tu solicitud se confirma cuando te respondamos."; link.focus();
  }
  document.addEventListener("click",event => {
    const button = event.target.closest("button"); if (!button) return;
    if (button.dataset.viewLink) showView(button.dataset.viewLink);
    if (button.dataset.shopCategory) { filters.category = button.dataset.shopCategory; renderCatalog(); showView("catalogo"); }
    if (button.dataset.category) { filters.category = button.dataset.category; renderCatalog(); }
    if (button.dataset.detail) openDetails(button.dataset.detail,button.dataset.detailWeight);
    if (button.dataset.addProduct) addToCart(button.dataset.addProduct,button.closest(".product-card").querySelector(".weight-select").value);
    if (button.dataset.quickAdd) addToCart(button.dataset.quickAdd,button.dataset.weight);
    if (button.dataset.cartChange) {
      const row = cart.find(item => item.key === button.dataset.key);
      if (row) { row.quantity += Number(button.dataset.cartChange); saveCart();
        const next = Array.from(document.querySelectorAll("[data-cart-change]")).find(item => item.dataset.key === button.dataset.key && item.dataset.cartChange === button.dataset.cartChange);
        (next && !next.disabled ? next : $("cart-close")).focus();
      }
    }
    if (button.dataset.removeKey) { cart = cart.filter(row => row.key !== button.dataset.removeKey); saveCart(); $("cart-close").focus(); }
  });
  document.addEventListener("change",event => {
    if (!event.target.matches(".weight-select")) return;
    const product = C.findProduct(PRODUCTS,event.target.closest(".product-card").dataset.productCard);
    selections.set(product.id,event.target.value);
    document.querySelectorAll('[data-product-card="' + CSS.escape(product.id) + '"]').forEach(copy => { copy.querySelector(".weight-select").value = event.target.value; copy.querySelector(".price").textContent = priceLabel(product,event.target.value); copy.querySelector(".unit-price").textContent = per100(product,event.target.value); if (product.quoteOnly) copy.querySelector(".product-quote").href = whatsappUrl(C.quoteMessage(product,event.target.value)); });
  });
  $("catalog-search").addEventListener("input",event => { filters.search = event.target.value; renderCatalog(); });
  $("catalog-occasion").addEventListener("change",event => { filters.occasion = event.target.value; renderCatalog(); });
  $("catalog-sort").addEventListener("change",event => { filters.sort = event.target.value; renderCatalog(); });
  $("catalog-new").addEventListener("change",event => { filters.onlyNew = event.target.checked; renderCatalog(); });
  $("catalog-reset").addEventListener("click",resetFilters); $("empty-reset").addEventListener("click",resetFilters);
  $("custom-pack-reset").addEventListener("click",() => { packChoices.forEach(select => { select.value = ""; }); renderCustomPack(); packChoices[0].focus(); });
  $("custom-pack-form").addEventListener("submit",event => {
    event.preventDefault();
    const result = C.addCustomPack(cart,PRODUCTS,packIds());
    if (!result.added) {
      $("custom-pack-error").textContent = result.reason === "limit" ? "Uno de estos sabores ya alcanzó el límite de 99 bolsas. Ajusta su cantidad en el carrito para agregar tu paquete." : "Elige tres sabores diferentes de 50 g para agregar tu paquete.";
      return;
    }
    cart = result.cart; saveCart();
    $("custom-pack-error").textContent = "";
    toast("Tus tres bolsas de 50 g se agregaron al carrito."); openCart();
  });
  $("menu-toggle").addEventListener("click",() => { $("menu-toggle").setAttribute("aria-expanded",String($("main-nav").classList.toggle("open"))); });
  $("cart-trigger").addEventListener("click",openCart); $("cart-close").addEventListener("click",() => closeCart());
  $("drawer-backdrop").addEventListener("click",() => closeCart()); $("back-to-cart").addEventListener("click",openCart);
  $("go-to-checkout").addEventListener("click",() => { if (cart.length) showView("checkout"); });
  $("detail-close").addEventListener("click",() => $("product-dialog").close());
  $("product-dialog").addEventListener("close",() => { document.body.style.overflow = ""; });
  $("product-dialog").addEventListener("click",event => { if (event.target !== $("product-dialog")) return; const box = $("product-dialog").getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) $("product-dialog").close(); });
  $("detail-variant").addEventListener("change",() => { const product = C.findProduct(PRODUCTS,detailId), label = $("detail-variant").value; $("detail-price").textContent = priceLabel(product,label); $("detail-unit-price").textContent = per100(product,label); renderFoodDetails(product,label); if (product.quoteOnly) $("detail-quote").href = whatsappUrl(C.quoteMessage(product,label)); });
  $("detail-form").addEventListener("submit",event => { event.preventDefault(); if (C.findProduct(PRODUCTS,detailId)?.quoteOnly) return; const quantity = Number($("detail-quantity").value); if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > C.MAX_QUANTITY) return; addToCart(detailId,$("detail-variant").value,quantity); $("product-dialog").close(); });
  $("cart-checkout").addEventListener("submit",event => {
    event.preventDefault(); if (!cart.length) { toast("Agrega un producto antes de preparar tu pedido."); return; } if (!$("cart-checkout").reportValidity()) return;
    const delivery = deliveryFor("checkout"), payment = document.querySelector('input[name="payment"]:checked').value;
    if (payment === "contra-entrega" && delivery !== "regional") return;
    handoff(C.orderMessage({cart,products:PRODUCTS,address:addressData("checkout"),delivery,payment,notes:$("checkout-notes").value}),"checkout");
  });
  $("cart-checkout").addEventListener("input",() => invalidateHandoff("checkout"));
  $("cart-checkout").addEventListener("change",() => invalidateHandoff("checkout"));
  document.querySelectorAll('input[name="checkout-delivery"]').forEach(input => input.addEventListener("change",updateCheckoutTotals));
  const updateQuote = () => { const national = deliveryFor("quote") === "national"; $("quote-shipping-label").textContent = national ? "Envío nacional" : "Entrega regional"; $("quote-shipping-price").textContent = national ? "$200" : "Por confirmar"; };
  document.querySelectorAll('input[name="quote-delivery"]').forEach(input => input.addEventListener("change",updateQuote));
  $("quote-form").addEventListener("input",() => invalidateHandoff("quote"));
  $("quote-form").addEventListener("change",() => invalidateHandoff("quote"));
  $("quote-form").addEventListener("submit",event => {
    event.preventDefault();
    const message = C.deliveryMessage({postcode:$("quote-postcode").value,city:$("quote-city").value,state:$("quote-state").value,delivery:deliveryFor("quote")});
    if (!message) { toast("Escribe tu código postal, ciudad y estado para consultar la entrega."); return; }
    handoff(message,"quote");
  });
  $("business-form").addEventListener("input",() => invalidateHandoff("business"));
  $("business-form").addEventListener("change",() => invalidateHandoff("business"));
  $("business-form").addEventListener("submit",event => {
    event.preventDefault();
    const field = (id,limit) => C.cleanText($(id).value,limit);
    handoff(["Hola Deshidrataditos, quisiera una cotización para mi negocio.","Negocio: " + field("business-name",100),"Giro: " + field("business-type",100),"Ciudad / C.P.: " + field("business-location",100),"Contacto: " + field("business-contact",120),"Productos de interés: " + field("business-products",100),"Cantidad y frecuencia: " + field("business-volume",150),"Comentarios: " + field("business-notes",500),"Por favor confirma presentaciones, precio por volumen y plazo de preparación."].join("\n"),"business");
  });
  document.addEventListener("keydown",event => {
    if (event.key === "Escape") { if ($("cart-drawer").classList.contains("open")) closeCart(); if ($("main-nav").classList.contains("open")) { $("main-nav").classList.remove("open"); $("menu-toggle").setAttribute("aria-expanded","false"); $("menu-toggle").focus(); } }
    if (event.key === "Tab" && $("cart-drawer").classList.contains("open")) {
      const elements = Array.from($("cart-drawer").querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select')).filter(element => element.getClientRects().length);
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener("hashchange",() => showView(location.hash.slice(1),false));
  window.addEventListener("storage",event => { if (event.key !== STORAGE_KEY && event.key !== null) return; cart = C.readCart(event.newValue,PRODUCTS); renderCart(); invalidateHandoff("checkout"); });
  // Do not retain a prepared link containing contact details after leaving the page.
  window.addEventListener("pagehide",() => ["checkout","quote","business"].forEach(invalidateHandoff));
  [["cart-checkout","checkout"],["quote-form","quote"],["business-form","business"]].forEach(([id,prefix]) => $(id).addEventListener("reset",() => invalidateHandoff(prefix)));
  $("year").textContent = new Date().getFullYear();
  renderProducts(); initializeCustomPack(); renderCart(); updateQuote(); showView(location.hash.slice(1) || "inicio",false,false);
})();
