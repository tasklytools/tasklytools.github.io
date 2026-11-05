/* Provider-independent newsletter form handling.
   The frontend never stores subscriber data or reports a signup without a provider response. */
(function (root) {
  "use strict";

  var catalog = root.TasklyProducts;
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setStatus(node, type, message) {
    if (!node) return;
    if (root.TasklyUI && root.TasklyUI.setStatus) {
      root.TasklyUI.setStatus(node, type, message);
      return;
    }
    node.className = "tt-status tt-status--" + type;
    node.textContent = message;
  }

  function initForm(form) {
    var email = form.querySelector('input[type="email"]');
    var consent = form.querySelector('input[type="checkbox"]');
    var status = form.querySelector("[data-newsletter-status]");
    var submit = form.querySelector('button[type="submit"]');
    if (!email) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = email.value.trim();
      var endpoint = catalog && catalog.settings ? catalog.settings.newsletterEndpoint : "";

      if (!emailPattern.test(value)) {
        email.setAttribute("aria-invalid", "true");
        setStatus(status, "error", "Enter a valid email address, such as you@example.com.");
        email.focus();
        return;
      }
      email.removeAttribute("aria-invalid");

      if (consent && !consent.checked) {
        consent.setAttribute("aria-invalid", "true");
        setStatus(status, "error", "Please confirm that you agree to receive occasional TasklyTools emails.");
        consent.focus();
        return;
      }
      if (consent) consent.removeAttribute("aria-invalid");

      if (!catalog || !catalog.isSafeNewsletterEndpoint(endpoint)) {
        setStatus(
          status,
          "info",
          "Your details look valid, but newsletter delivery is not connected yet. Nothing was sent or stored."
        );
        return;
      }

      if (submit) submit.disabled = true;
      setStatus(status, "info", "Submitting your newsletter request...");

      root
        .fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            email: value,
            consent: true,
            source: form.getAttribute("data-newsletter-source") || "tasklytools"
          })
        })
        .then(function (response) {
          if (!response.ok) throw new Error("Newsletter request failed");
          setStatus(status, "success", "You are on the list. Check your inbox for any confirmation step.");
          form.reset();
        })
        .catch(function () {
          setStatus(
            status,
            "error",
            "We could not submit your email just now. Nothing was saved. Please try again later."
          );
        })
        .then(function () {
          if (submit) submit.disabled = false;
        });
    });
  }

  function init() {
    var forms = document.querySelectorAll("[data-newsletter-form]");
    Array.prototype.forEach.call(forms, initForm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
