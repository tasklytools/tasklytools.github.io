(function () {
  "use strict";

  function init() {
    var logic = window.PasswordLogic;
    var toolkit = window.TasklyToolkit;

    if (!logic || !toolkit) return;

    var input = document.getElementById("passwordInput");
    var toggleBtn = document.getElementById("togglePasswordBtn");
    var resetBtn = document.getElementById("resetPasswordBtn");
    var status = document.getElementById("passwordStatus");
    var strengthFill = document.getElementById("strengthFill");
    var strengthLabel = document.getElementById("strengthLabel");
    var strengthEntropy = document.getElementById("strengthEntropy");
    var strengthMeter = document.getElementById("strengthMeter");
    var metricEntropy = document.getElementById("passwordEntropy");
    var metricLength = document.getElementById("passwordLength");
    var metricPool = document.getElementById("passwordPool");
    var crackThrottled = document.getElementById("crackThrottled");
    var crackOnline = document.getElementById("crackOnline");
    var crackSlow = document.getElementById("crackSlow");
    var crackFast = document.getElementById("crackFast");
    var checks = document.getElementById("passwordChecks");
    var warningsBox = document.getElementById("passwordWarningsBox");
    var warningsList = document.getElementById("passwordWarnings");
    var suggestionsBox = document.getElementById("passwordSuggestionsBox");
    var suggestionsList = document.getElementById("passwordSuggestions");

    if (!input || !strengthFill) return;

    function renderChecks(items) {
      checks.textContent = "";

      for (var i = 0; i < items.length; i += 1) {
        var chip = document.createElement("span");
        chip.className = "tt-chip" + (items[i].pass ? " is-on" : "");

        var icon = document.createElement("i");
        icon.className = "bi " + (items[i].pass ? "bi-check-circle" : "bi-x-circle");
        icon.setAttribute("aria-hidden", "true");

        var text = document.createElement("span");
        text.textContent = items[i].label;

        chip.appendChild(icon);
        chip.appendChild(text);
        checks.appendChild(chip);
      }
    }

    function renderList(list, items, type) {
      list.textContent = "";

      for (var i = 0; i < items.length; i += 1) {
        var item = document.createElement("li");
        item.className = "tt-message tt-message--" + type;
        item.textContent = items[i];
        list.appendChild(item);
      }
    }

    function resetView() {
      strengthFill.style.width = "0%";
      strengthFill.setAttribute("data-level", "0");
      strengthMeter.setAttribute("aria-valuenow", "0");
      strengthMeter.setAttribute("aria-valuetext", "No password");
      strengthLabel.textContent = "No password";
      strengthEntropy.textContent = "0 bits estimated entropy";
      metricEntropy.textContent = "0 bits";
      metricLength.textContent = "0";
      metricPool.textContent = "0";
      crackThrottled.textContent = "-";
      crackOnline.textContent = "-";
      crackSlow.textContent = "-";
      crackFast.textContent = "-";
      checks.textContent = "";
      warningsBox.classList.add("tt-hidden");
      suggestionsBox.classList.add("tt-hidden");
      warningsList.textContent = "";
      suggestionsList.textContent = "";
      toolkit.setStatus(status, "neutral", "Start typing to measure length, character variety, patterns, and estimated crack times. The password never leaves this page.");
    }

    function render() {
      var value = input.value;

      if (!value) {
        resetView();
        return;
      }

      var result = logic.analyze(value);

      strengthFill.style.width = result.strengthPercent + "%";
      strengthFill.setAttribute("data-level", String(result.score));
      strengthMeter.setAttribute("aria-valuenow", String(result.score));
      strengthMeter.setAttribute("aria-valuetext", result.label + ", about " + result.entropyBits + " bits of estimated entropy");
      strengthLabel.textContent = result.label;
      strengthEntropy.textContent = "about " + result.entropyBits + " bits of estimated entropy";
      metricEntropy.textContent = result.entropyBits + " bits";
      metricLength.textContent = String(result.length);
      metricPool.textContent = String(result.poolSize);

      crackThrottled.textContent = result.crackTimes.onlineThrottled;
      crackOnline.textContent = result.crackTimes.onlineUnthrottled;
      crackSlow.textContent = result.crackTimes.offlineSlowHash;
      crackFast.textContent = result.crackTimes.offlineFastHash;

      renderChecks(result.checks);

      if (result.warnings.length) {
        warningsBox.classList.remove("tt-hidden");
        renderList(warningsList, result.warnings, "warning");
      } else {
        warningsBox.classList.add("tt-hidden");
        warningsList.textContent = "";
      }

      if (result.suggestions.length) {
        suggestionsBox.classList.remove("tt-hidden");
        renderList(suggestionsList, result.suggestions, "info");
      } else {
        suggestionsBox.classList.add("tt-hidden");
        suggestionsList.textContent = "";
      }

      var statusType = result.score <= 1 ? "error" : result.score === 2 ? "warning" : "success";
      var message;

      if (result.common) {
        message = "This password is common or predictable. Choose a unique passphrase instead.";
      } else if (result.score === 0) {
        message = "Very weak. Increase the length and avoid repeated characters, sequences, and common words.";
      } else if (result.score === 1) {
        message = "Weak. Add length and variety, and avoid predictable patterns.";
      } else if (result.score === 2) {
        message = "Fair. Consider a longer passphrase and remove predictable words or patterns.";
      } else if (result.score === 3) {
        message = "Strong. Use it only on one account and store it in a password manager.";
      } else {
        message = "Very strong. Keep it unique, store it safely, and enable multi-factor authentication.";
      }

      toolkit.setStatus(status, statusType, message);
    }

    var debouncedRender = toolkit.debounce(render, 100);

    function setVisibility(visible) {
      input.type = visible ? "text" : "password";
      toggleBtn.setAttribute("aria-pressed", String(visible));
      toggleBtn.setAttribute("aria-label", visible ? "Hide password" : "Show password");
      toggleBtn.title = visible ? "Hide password" : "Show password";

      var icon = toggleBtn.querySelector("i");
      if (icon) {
        icon.className = "bi " + (visible ? "bi-eye-slash" : "bi-eye");
      }
    }

    input.addEventListener("input", debouncedRender);

    input.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && input.type === "text") {
        setVisibility(false);
      }
    });

    toggleBtn.addEventListener("click", function () {
      var show = input.type === "password";
      setVisibility(show);
      input.focus();
    });

    resetBtn.addEventListener("click", function () {
      input.value = "";
      setVisibility(false);
      render();
      input.focus();
    });

    setVisibility(false);
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
