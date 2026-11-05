/* Lemon Squeezy hosted checkout entry points.
   No payment is processed or simulated on TasklyTools pages. */
(function (root) {
  "use strict";

  var catalog = root.TasklyProducts;

  function statusNode(button) {
    var scope = button.closest("[data-checkout-scope]") || document;
    return scope.querySelector("[data-checkout-status]");
  }

  function stateNode(button) {
    var scope = button.closest("[data-checkout-scope]") || document;
    return scope.querySelector("[data-checkout-state]");
  }

  function setStatus(button, type, message) {
    var node = statusNode(button);
    if (!node) return;
    if (root.TasklyUI && root.TasklyUI.setStatus) {
      root.TasklyUI.setStatus(node, type, message);
      return;
    }
    node.className = "tt-status tt-status--" + type;
    node.textContent = message;
  }

  function initButton(button) {
    var product = catalog && catalog.getProduct(button.getAttribute("data-product-checkout"));
    var state = stateNode(button);

    if (!product) {
      if (state) state.textContent = "Product information is unavailable.";
      button.addEventListener("click", function () {
        setStatus(button, "error", "This product could not be loaded. No payment was taken.");
      });
      return;
    }

    var checkoutState = catalog.getCheckoutState(product);
    var checkoutUrl = checkoutState.url;
    var ready = checkoutState.ready;

    if (state) {
      if (!ready) {
        state.textContent = "Lemon Squeezy checkout is not connected yet. No payment can be taken.";
      } else if (checkoutState.mode === "test") {
        state.textContent = "Lemon Squeezy test checkout is enabled. Test orders do not take real payment.";
      } else {
        state.textContent = "Secure payment and digital delivery are handled by Lemon Squeezy.";
      }
    }

    button.addEventListener("click", function () {
      if (!ready) {
        setStatus(
          button,
          "info",
          "Checkout is not connected yet. No payment was taken. Please check back after Lemon Squeezy checkout is configured."
        );
        return;
      }
      setStatus(
        button,
        "info",
        checkoutState.mode === "test"
          ? "Opening Lemon Squeezy test checkout..."
          : "Opening secure Lemon Squeezy checkout..."
      );
      root.location.assign(checkoutUrl);
    });
  }

  function init() {
    var buttons = document.querySelectorAll("[data-product-checkout]");
    Array.prototype.forEach.call(buttons, initButton);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
