(function () {
  "use strict";

  function init() {
    var logic = window.HtaccessLogic;
    var toolkit = window.TasklyToolkit;

    if (!logic || !toolkit) return;

    var form = document.getElementById("htaccessForm");
    var forceHttps = document.getElementById("forceHttps");
    var canonicalMode = document.getElementById("canonicalMode");
    var canonicalHost = document.getElementById("canonicalHost");
    var canonicalHostRow = document.getElementById("canonicalHostRow");
    var canonicalStatus = document.getElementById("canonicalStatus");
    var customRedirectsEnabled = document.getElementById("customRedirectsEnabled");
    var customRedirectsSection = document.getElementById("customRedirectsSection");
    var redirectRows = document.getElementById("redirectRows");
    var addRedirectBtn = document.getElementById("addRedirectBtn");
    var trailingSlash = document.getElementById("trailingSlash");
    var preserveQueries = document.getElementById("preserveQueries");
    var output = document.getElementById("htaccessOutput");
    var outputWrap = document.getElementById("htaccessOutputWrap");
    var emptyOutput = document.getElementById("htaccessEmpty");
    var status = document.getElementById("htaccessStatus");
    var ruleCount = document.getElementById("htaccessRuleCount");
    var errorsBox = document.getElementById("htaccessErrors");
    var errorList = document.getElementById("htaccessErrorList");
    var warningsBox = document.getElementById("htaccessWarnings");
    var warningList = document.getElementById("htaccessWarningList");
    var copyBtn = document.getElementById("copyHtaccessBtn");
    var downloadBtn = document.getElementById("downloadHtaccessBtn");
    var resetBtn = document.getElementById("resetHtaccessBtn");

    if (!form || !output) return;

    function createRow(source, destination, rowStatus) {
      var row = document.createElement("div");
      row.className = "tt-rule-row";

      var sourceWrap = document.createElement("div");
      var sourceLabel = document.createElement("label");
      sourceLabel.className = "tt-label";
      sourceLabel.textContent = "Old path";
      var sourceInput = document.createElement("input");
      sourceInput.type = "text";
      sourceInput.className = "tt-input";
      sourceInput.placeholder = "/old-page/";
      sourceInput.setAttribute("data-field", "source");
      sourceInput.value = source || "";
      sourceWrap.appendChild(sourceLabel);
      sourceWrap.appendChild(sourceInput);

      var destinationWrap = document.createElement("div");
      var destinationLabel = document.createElement("label");
      destinationLabel.className = "tt-label";
      destinationLabel.textContent = "New path or URL";
      var destinationInput = document.createElement("input");
      destinationInput.type = "text";
      destinationInput.className = "tt-input";
      destinationInput.placeholder = "/new-page/";
      destinationInput.setAttribute("data-field", "destination");
      destinationInput.value = destination || "";
      destinationWrap.appendChild(destinationLabel);
      destinationWrap.appendChild(destinationInput);

      var statusWrap = document.createElement("div");
      var statusLabel = document.createElement("label");
      statusLabel.className = "tt-label";
      statusLabel.textContent = "Status";
      var statusSelect = document.createElement("select");
      statusSelect.className = "tt-select";
      statusSelect.setAttribute("data-field", "status");
      var permanent = document.createElement("option");
      permanent.value = "301";
      permanent.textContent = "301";
      var temporary = document.createElement("option");
      temporary.value = "302";
      temporary.textContent = "302";
      statusSelect.appendChild(permanent);
      statusSelect.appendChild(temporary);
      statusSelect.value = String(rowStatus || 301);
      statusWrap.appendChild(statusLabel);
      statusWrap.appendChild(statusSelect);

      var actions = document.createElement("div");
      actions.className = "tt-rule-actions";
      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "tt-btn tt-btn-secondary tt-btn-icon";
      removeBtn.setAttribute("aria-label", "Remove redirect");
      removeBtn.title = "Remove redirect";
      removeBtn.setAttribute("data-remove", "true");
      var removeIcon = document.createElement("i");
      removeIcon.className = "bi bi-trash";
      removeIcon.setAttribute("aria-hidden", "true");
      removeBtn.appendChild(removeIcon);
      actions.appendChild(removeBtn);

      row.appendChild(sourceWrap);
      row.appendChild(destinationWrap);
      row.appendChild(statusWrap);
      row.appendChild(actions);

      return row;
    }

    function addRow(source, destination, rowStatus) {
      var row = createRow(source, destination, rowStatus);
      redirectRows.appendChild(row);
      return row;
    }

    function collectConfig() {
      var rows = [];
      if (customRedirectsEnabled.checked) {
        var rowElements = redirectRows.querySelectorAll(".tt-rule-row");
        for (var i = 0; i < rowElements.length; i += 1) {
          var row = rowElements[i];
          var source = row.querySelector('[data-field="source"]').value;
          var destination = row.querySelector('[data-field="destination"]').value;
          var rowStatus = row.querySelector('[data-field="status"]').value;
          rows.push({
            source: source,
            destination: destination,
            status: Number(rowStatus),
            preserveQuery: preserveQueries.checked
          });
        }
      }

      return {
        forceHttps: forceHttps.checked,
        canonicalMode: canonicalMode.value,
        canonicalHost: canonicalHost.value,
        canonicalStatus: Number(canonicalStatus.value),
        trailingSlash: trailingSlash.value,
        pathRedirects: rows
      };
    }

    function renderMessages(box, list, messages, type) {
      list.textContent = "";
      if (!messages.length) {
        box.classList.add("tt-hidden");
        return;
      }

      box.classList.remove("tt-hidden");
      for (var i = 0; i < messages.length; i += 1) {
        var item = document.createElement("li");
        item.className = "tt-message tt-message--" + type;
        item.textContent = messages[i];
        list.appendChild(item);
      }
    }

    function render() {
      var result = logic.generate(collectConfig());
      var hasErrors = result.errors.length > 0;
      var code = result.code;

      output.textContent = code;
      outputWrap.classList.toggle("tt-hidden", !code);
      emptyOutput.classList.toggle("tt-hidden", Boolean(code));
      ruleCount.textContent = result.ruleCount + (result.ruleCount === 1 ? " rule" : " rules");

      renderMessages(errorsBox, errorList, result.errors, "error");
      renderMessages(warningsBox, warningList, result.warnings, "warning");

      if (hasErrors) {
        toolkit.setStatus(status, "error", "Fix " + result.errors.length + " validation issue(s) before copying or downloading the rules.");
      } else if (code) {
        toolkit.setStatus(status, "success", "Generated " + result.ruleCount + " rule(s). Review the output and back up your existing .htaccess file first.");
      } else {
        toolkit.setStatus(status, "neutral", "Choose at least one redirect rule to generate an .htaccess snippet.");
      }

      copyBtn.disabled = hasErrors || !code;
      downloadBtn.disabled = hasErrors || !code;
    }

    var debouncedRender = toolkit.debounce(render, 120);

    function updateModeFields() {
      canonicalHostRow.classList.toggle("tt-hidden", canonicalMode.value === "none");
      customRedirectsSection.classList.toggle("tt-hidden", !customRedirectsEnabled.checked);

      if (customRedirectsEnabled.checked && !redirectRows.querySelector(".tt-rule-row")) {
        addRow("/old-page/", "/new-page/", 301);
      }
    }

    form.addEventListener("input", debouncedRender);
    form.addEventListener("change", function (event) {
      if (event.target === canonicalMode || event.target === customRedirectsEnabled) {
        updateModeFields();
      }
      debouncedRender();
    });

    redirectRows.addEventListener("click", function (event) {
      var button = event.target.closest("[data-remove]");
      if (!button) return;
      var row = button.closest(".tt-rule-row");
      if (row) {
        row.parentNode.removeChild(row);
        render();
      }
    });

    addRedirectBtn.addEventListener("click", function () {
      var row = addRow("", "", 301);
      render();
      row.querySelector('[data-field="source"]').focus();
    });

    copyBtn.addEventListener("click", function () {
      if (!output.textContent) return;
      toolkit.copyText(output.textContent).then(function () {
        toolkit.flashButton(copyBtn, "Copied");
        toolkit.setStatus(status, "success", "Copied the generated .htaccess rules to the clipboard.");
      }).catch(function () {
        toolkit.setStatus(status, "error", "Copy failed. Select the output manually and copy it.");
      });
    });

    downloadBtn.addEventListener("click", function () {
      if (!output.textContent) return;
      toolkit.downloadText("htaccess-redirects.txt", output.textContent, "text/plain");
      toolkit.setStatus(status, "info", "Downloaded htaccess-redirects.txt. Rename it after backing up your current .htaccess file.");
    });

    resetBtn.addEventListener("click", function () {
      form.reset();
      forceHttps.checked = true;
      canonicalMode.value = "none";
      canonicalHost.value = "";
      canonicalStatus.value = "301";
      trailingSlash.value = "none";
      customRedirectsEnabled.checked = false;
      preserveQueries.checked = true;
      redirectRows.textContent = "";
      updateModeFields();
      render();
      forceHttps.focus();
    });

    updateModeFields();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
