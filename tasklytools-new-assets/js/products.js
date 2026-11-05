/* Product catalog rendering for the TasklyTools marketplace. */
(function (root) {
  "use strict";

  var catalog = root.TasklyProducts;

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function formatPrice(product) {
    if (catalog && catalog.formatPrice) return catalog.formatPrice(product);
    return "$" + (product.priceCents / 100).toFixed(0) + " " + product.currency;
  }

  function card(product) {
    var highlights = product.highlights
      .slice(0, 3)
      .map(function (item) {
        return '<li><i class="bi bi-check2" aria-hidden="true"></i><span>' + esc(item) + "</span></li>";
      })
      .join("");

    return (
      '<article class="tt-product-card" data-product-card data-category="' + esc(product.category) + '" data-checkout-scope>' +
        '<a class="tt-product-card-media" href="/products/' + esc(product.slug) + '/" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(product.cover) + '" alt="" width="1200" height="900" loading="lazy">' +
        '</a>' +
        '<div class="tt-product-card-body">' +
          '<div class="tt-product-meta"><span>' + esc(product.categoryLabel) + '</span><span class="tt-product-badge">' + esc(product.badge) + '</span></div>' +
          '<h3><a href="/products/' + esc(product.slug) + '/">' + esc(product.name) + "</a></h3>" +
          '<p class="tt-product-tagline">' + esc(product.tagline) + "</p>" +
          '<ul class="tt-product-highlights">' + highlights + "</ul>" +
          '<div class="tt-product-card-footer">' +
            '<div><span class="tt-product-price" data-product-price>' + esc(formatPrice(product)) + '</span><span class="tt-product-price-note">one-time</span></div>' +
            '<a class="tt-btn tt-btn-secondary tt-btn-sm" href="/products/' + esc(product.slug) + '/">View details</a>' +
          '</div>' +
          '<div class="tt-product-card-action">' +
            '<button class="tt-btn tt-btn-primary tt-btn-block" type="button" data-product-checkout="' + esc(product.id) + '">Buy now</button>' +
            '<p class="tt-product-checkout-note" data-checkout-state>Checkout status unavailable</p>' +
            '<p class="tt-product-status" data-checkout-status role="status" aria-live="polite"></p>' +
          '</div>' +
        '</div>' +
      "</article>"
    );
  }

  function renderGrids() {
    var grids = document.querySelectorAll("[data-product-grid]");
    if (!grids.length || !catalog) return;

    var markup = catalog.products
      .filter(function (product) {
        return product.status !== "archived";
      })
      .map(card)
      .join("");

    Array.prototype.forEach.call(grids, function (grid) {
      grid.innerHTML = markup;
      grid.removeAttribute("data-product-grid-loading");
    });
  }

  function initFilters() {
    var filters = document.querySelectorAll("[data-product-filter]");
    var cards = document.querySelectorAll("[data-product-card]");
    var count = document.querySelector("[data-product-count]");
    if (!filters.length || !cards.length) return;

    function apply(value) {
      var shown = 0;
      Array.prototype.forEach.call(cards, function (item) {
        var visible = value === "all" || item.getAttribute("data-category") === value;
        item.hidden = !visible;
        if (visible) shown += 1;
      });
      Array.prototype.forEach.call(filters, function (button) {
        var active = button.getAttribute("data-product-filter") === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      if (count) count.textContent = String(shown);
    }

    Array.prototype.forEach.call(filters, function (button) {
      button.addEventListener("click", function () {
        apply(button.getAttribute("data-product-filter") || "all");
      });
    });

    apply("all");
  }

  function syncProductStructuredData(product) {
    if (!catalog.getCheckoutState) return;
    var state = catalog.getCheckoutState(product);
    if (!state.ready || state.mode !== "live") return;

    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    Array.prototype.forEach.call(scripts, function (script) {
      var data;
      try {
        data = JSON.parse(script.textContent);
      } catch (error) {
        return;
      }
      var graph = data && data["@graph"];
      if (!Array.isArray(graph)) return;
      var changed = false;
      graph.forEach(function (node) {
        if (node && node["@type"] === "Product" && node.offers) {
          node.offers.availability = "https://schema.org/InStock";
          changed = true;
        }
      });
      if (changed) script.textContent = JSON.stringify(data);
    });
  }

  function syncProductPage() {
    var id = document.body.getAttribute("data-product-id");
    if (!id || !catalog) return;
    var product = catalog.getProduct(id);
    if (!product) return;

    var prices = document.querySelectorAll("[data-product-price]");
    Array.prototype.forEach.call(prices, function (node) {
      node.textContent = formatPrice(product);
    });
    syncProductStructuredData(product);
  }

  function init() {
    renderGrids();
    initFilters();
    syncProductPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
