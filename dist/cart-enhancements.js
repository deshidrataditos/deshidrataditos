/* Enhancements kept separate from app.js so deployments cannot reuse stale cart logic. */
(() => {
  const recommendationList = document.getElementById("recommendation-list");
  const checkoutButton = document.getElementById("go-to-checkout");

  function renderEnhancedRecommendations() {
    if (!recommendationList || typeof PRODUCTS === "undefined" || typeof cart === "undefined") return;

    const selectedIds = new Set(cart.map(item => item.productId));
    const recommendations = PRODUCTS.filter(product => !selectedIds.has(product.id)).slice(0, 3);
    recommendationList.innerHTML = recommendations.map(product => {
      const [weight, price] = Object.entries(product.prices)[0];
      const photo = PRODUCT_PHOTOS[product.id];
      return `<article class="recommendation-item">
        <img src="${photo.src}" alt="${product.name}" loading="lazy" style="--rec-position:${photo.position}">
        <div><strong>${product.name}</strong><span>${product.type}</span><b>${weight} · ${money(price)}</b></div>
        <button type="button" data-quick-add="${product.id}" data-weight="${weight}" aria-label="Agregar ${product.name} al carrito">+</button>
      </article>`;
    }).join("");
  }

  const originalRenderCart = renderCart;
  renderCart = function renderCartWithRecommendations() {
    originalRenderCart();
    renderEnhancedRecommendations();
  };

  renderEnhancedRecommendations();
  checkoutButton?.addEventListener("click", () => showView("checkout"));
})();
