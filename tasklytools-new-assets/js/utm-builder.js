/* UTM Builder DOM controller. Logic lives in utm-logic.js. */
(function (root) {
  "use strict";

  var fields = [
    { key: "url", id: "websiteUrl", error: "websiteUrlError" },
    { key: "source", id: "campaignSource", error: "campaignSourceError" },
    { key: "medium", id: "campaignMedium", error: "campaignMediumError" },
    { key: "campaign", id: "campaignName", error: "campaignNameError" },
    { key: "term", id: "campaignTerm", error: "campaignTermError" },
    { key: "content", id: "campaignContent", error: "campaignContentError" }
  ];

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var args = arguments;
      var context = this;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        fn.apply(context, args);
      }, wait);
    };
  }

  function init() {
    var form = document.getElementById("utmForm");
    if (!form || !root.TasklyUtm || !root.TasklyUI) return;

    var output = document.getElementById("utmOutput");
    var status = document.getElementById("utmStatus");
    var copyButton = document.getElementById("copyUtmBtn");
    var resetButton = document.getElementById("resetUtmBtn");
    var exampleButton = document.getElementById("exampleUtmBtn");
    var submitted = false;

    function readValues() {
      var values = {};
      fields.forEach(function (field) {
        var input = document.getElementById(field.id);
        values[field.key] = input ? input.value : "";
      });
      return values;
    }

    function clearFieldError(field) {
      var input = document.getElementById(field.id);
      var error = document.getElementById(field.error);
      if (input) input.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }

    function clearAllErrors() {
      fields.forEach(clearFieldError);
    }

    function showFieldErrors(errors) {
      fields.forEach(function (field) {
        var input = document.getElementById(field.id);
        var error = document.getElementById(field.error);
        var message = errors[field.key];
        if (!input || !error) return;
        if (message) {
          input.setAttribute("aria-invalid", "true");
          error.textContent = message;
        } else {
          input.removeAttribute("aria-invalid");
          error.textContent = "";
        }
      });
    }

    function setNeutral() {
      root.TasklyUI.setStatus(
        status,
        "info",
        "Enter a page URL and campaign details to build your UTM link."
      );
    }

    function update(options) {
      var opts = options || {};
      var values = readValues();
      var requiredFilled =
        values.url.trim() || values.source.trim() || values.medium.trim() || values.campaign.trim();

      if (!requiredFilled && !submitted) {
        clearAllErrors();
        if (output) output.textContent = "";
        setNeutral();
        return;
      }

      var result = root.TasklyUtm.buildUtmUrl(values);

      if (!result.ok) {
        showFieldErrors(result.errors);
        if (output) output.textContent = "";
        root.TasklyUI.setStatus(
          status,
          "error",
          "Fix the highlighted fields to generate a valid campaign URL."
        );
        return;
      }

      showFieldErrors({});
      if (output) output.textContent = result.url;

      if (opts.copied) {
        root.TasklyUI.setStatus(status, "success", "Copied to clipboard.");
      } else if (opts.example) {
        root.TasklyUI.setStatus(
          status,
          "info",
          "Example values loaded. Edit any field to make the link your own."
        );
      } else {
        root.TasklyUI.setStatus(
          status,
          "success",
          "Campaign URL generated. Copy it or keep editing to update it."
        );
      }
    }

    var debouncedUpdate = debounce(function () {
      update();
    }, 160);

    fields.forEach(function (field) {
      var input = document.getElementById(field.id);
      if (!input) return;
      input.addEventListener("input", function () {
        var error = document.getElementById(field.error);
        if (error) error.textContent = "";
        input.removeAttribute("aria-invalid");
        debouncedUpdate();
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitted = true;
      update();
      if (output && output.textContent) {
        output.setAttribute("tabindex", "-1");
        output.focus({ preventScroll: true });
      }
    });

    if (copyButton) {
      copyButton.addEventListener("click", function () {
        var text = output ? output.textContent.trim() : "";
        if (!text) {
          root.TasklyUI.setStatus(status, "error", "Generate a valid URL before copying.");
          return;
        }

        root.TasklyUI.copyText(text).then(
          function () {
            update({ copied: true });
            var original = copyButton.getAttribute("data-original-label");
            if (!original) {
              original = copyButton.innerHTML;
              copyButton.setAttribute("data-original-label", original);
            }
            copyButton.textContent = "Copied";
            window.setTimeout(function () {
              copyButton.innerHTML = original;
            }, 1600);
          },
          function () {
            root.TasklyUI.setStatus(
              status,
              "error",
              "Copy was blocked by the browser. Select the URL and copy it manually."
            );
          }
        );
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        form.reset();
        submitted = false;
        clearAllErrors();
        if (output) output.textContent = "";
        setNeutral();
        var first = document.getElementById("websiteUrl");
        if (first) first.focus();
      });
    }

    if (exampleButton) {
      exampleButton.addEventListener("click", function () {
        var example = root.TasklyUtm.exampleValues();
        Object.keys(example).forEach(function (key) {
          var field = null;
          for (var i = 0; i < fields.length; i += 1) {
            if (fields[i].key === key) {
              field = fields[i];
              break;
            }
          }
          var input = field ? document.getElementById(field.id) : null;
          if (input) input.value = example[key];
        });
        submitted = true;
        clearAllErrors();
        update({ example: true });
      });
    }

    setNeutral();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
