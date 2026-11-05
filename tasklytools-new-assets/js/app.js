/* TasklyTools page-level enhancements.
   Loaded after config.js and components.js. */
(function (root) {
  "use strict";

  function flash(button, message) {
    if (!button) return;
    var original = button.getAttribute("data-original-label");
    if (!original) {
      original = button.innerHTML;
      button.setAttribute("data-original-label", original);
    }
    button.textContent = message;
    window.setTimeout(function () {
      button.innerHTML = original;
    }, 1600);
  }

  function initCopyButtons() {
    var buttons = document.querySelectorAll("[data-copy-target]");
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener("click", function () {
        var selector = button.getAttribute("data-copy-target");
        var target = selector ? document.querySelector(selector) : null;
        var text = "";

        if (target) {
          text = target.textContent || target.value || "";
        } else if (button.getAttribute("data-copy-text")) {
          text = button.getAttribute("data-copy-text");
        }

        text = text.trim();
        if (!text || !root.TasklyUI) return;

        root.TasklyUI.copyText(text).then(
          function () {
            flash(button, "Copied");
          },
          function () {
            flash(button, "Press Ctrl+C");
          }
        );
      });
    });
  }

  function initSearchShortcut() {
    var input = document.querySelector("[data-tool-search-input]");
    if (!input) return;

    document.addEventListener("keydown", function (event) {
      var tag = document.activeElement ? document.activeElement.tagName : "";
      var typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (event.key === "/" && !typing) {
        event.preventDefault();
        input.focus();
      }
    });
  }

  function init() {
    initCopyButtons();
    initSearchShortcut();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
