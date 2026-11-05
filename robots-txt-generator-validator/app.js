(function () {
  "use strict";

  function init() {
    var logic = window.RobotsLogic;
    var toolkit = window.TasklyToolkit;

    if (!logic || !toolkit) return;

    var presetSelect = document.getElementById("robotsPreset");
    var groupsContainer = document.getElementById("robotsGroups");
    var addGroupBtn = document.getElementById("addBotGroupBtn");
    var sitemapInput = document.getElementById("sitemapUrl");
    var output = document.getElementById("robotsOutput");
    var outputWrap = document.getElementById("robotsOutputWrap");
    var emptyOutput = document.getElementById("robotsEmpty");
    var outputCount = document.getElementById("robotsRuleCount");
    var generatorStatus = document.getElementById("robotsStatus");
    var errorsBox = document.getElementById("robotsErrors");
    var errorList = document.getElementById("robotsErrorList");
    var warningsBox = document.getElementById("robotsWarnings");
    var warningList = document.getElementById("robotsWarningList");
    var copyBtn = document.getElementById("copyRobotsBtn");
    var downloadBtn = document.getElementById("downloadRobotsBtn");
    var resetBtn = document.getElementById("resetRobotsBtn");
    var validateOutputBtn = document.getElementById("validateRobotsOutputBtn");

    var panelGenerate = document.getElementById("panelGenerate");
    var panelValidate = document.getElementById("panelValidate");
    var tabGenerate = document.getElementById("tabGenerate");
    var tabValidate = document.getElementById("tabValidate");

    var validatorInput = document.getElementById("robotsInput");
    var validateBtn = document.getElementById("validateRobotsBtn");
    var validationStatus = document.getElementById("validationStatus");
    var validationIssues = document.getElementById("validationIssues");
    var validationEmpty = document.getElementById("validationEmpty");
    var validationSummary = document.getElementById("validationSummary");
    var statGroups = document.getElementById("statGroups");
    var statRules = document.getElementById("statRules");
    var statSitemaps = document.getElementById("statSitemaps");
    var statLines = document.getElementById("statLines");

    if (!groupsContainer || !output || !validatorInput) return;

    var applyingPreset = false;

    function createRuleRow(rule) {
      var row = document.createElement("div");
      row.className = "tt-group-rule";

      var typeWrap = document.createElement("div");
      var typeLabel = document.createElement("label");
      typeLabel.className = "tt-label";
      typeLabel.textContent = "Rule";
      var typeSelect = document.createElement("select");
      typeSelect.className = "tt-select";
      typeSelect.setAttribute("data-rule-field", "directive");
      var allowOption = document.createElement("option");
      allowOption.value = "Allow";
      allowOption.textContent = "Allow";
      var disallowOption = document.createElement("option");
      disallowOption.value = "Disallow";
      disallowOption.textContent = "Disallow";
      typeSelect.appendChild(allowOption);
      typeSelect.appendChild(disallowOption);
      typeSelect.value = rule && rule.directive === "Allow" ? "Allow" : "Disallow";
      typeWrap.appendChild(typeLabel);
      typeWrap.appendChild(typeSelect);

      var pathWrap = document.createElement("div");
      var pathLabel = document.createElement("label");
      pathLabel.className = "tt-label";
      pathLabel.textContent = "Path";
      var pathInput = document.createElement("input");
      pathInput.type = "text";
      pathInput.className = "tt-input";
      pathInput.placeholder = "/";
      pathInput.setAttribute("data-rule-field", "path");
      pathInput.value = rule && rule.path ? rule.path : "";
      pathWrap.appendChild(pathLabel);
      pathWrap.appendChild(pathInput);

      var actions = document.createElement("div");
      actions.className = "tt-rule-actions";
      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "tt-btn tt-btn-secondary tt-btn-icon";
      removeBtn.setAttribute("data-remove-rule", "true");
      removeBtn.setAttribute("aria-label", "Remove rule");
      removeBtn.title = "Remove rule";
      var icon = document.createElement("i");
      icon.className = "bi bi-trash";
      icon.setAttribute("aria-hidden", "true");
      removeBtn.appendChild(icon);
      actions.appendChild(removeBtn);

      row.appendChild(typeWrap);
      row.appendChild(pathWrap);
      row.appendChild(actions);

      return row;
    }

    function createGroup(group) {
      var wrapper = document.createElement("div");
      wrapper.className = "tt-group";
      wrapper.setAttribute("data-group", "true");

      var head = document.createElement("div");
      head.className = "tt-group-head";

      var agentRow = document.createElement("div");
      agentRow.className = "tt-form-row";
      var agentLabel = document.createElement("label");
      agentLabel.className = "tt-label";
      agentLabel.textContent = "User-agent";
      var agentInput = document.createElement("input");
      agentInput.type = "text";
      agentInput.className = "tt-input";
      agentInput.placeholder = "*";
      agentInput.setAttribute("data-group-field", "userAgent");
      agentInput.value = group && group.userAgent ? group.userAgent : "";
      agentInput.autocomplete = "off";
      agentInput.spellcheck = false;
      agentRow.appendChild(agentLabel);
      agentRow.appendChild(agentInput);

      var removeGroupBtn = document.createElement("button");
      removeGroupBtn.type = "button";
      removeGroupBtn.className = "tt-btn tt-btn-secondary tt-btn-small";
      removeGroupBtn.setAttribute("data-remove-group", "true");
      removeGroupBtn.innerHTML = '<i class="bi bi-trash" aria-hidden="true"></i> Remove group';

      head.appendChild(agentRow);
      head.appendChild(removeGroupBtn);

      var rulesContainer = document.createElement("div");
      rulesContainer.className = "tt-rows";
      rulesContainer.setAttribute("data-group-rules", "true");

      var rules = group && Array.isArray(group.rules) ? group.rules : [];
      if (rules.length) {
        for (var r = 0; r < rules.length; r += 1) {
          rulesContainer.appendChild(createRuleRow(rules[r]));
        }
      } else {
        rulesContainer.appendChild(createRuleRow({ directive: "Disallow", path: "" }));
      }

      var rulesActions = document.createElement("div");
      rulesActions.className = "tt-btn-row";
      var addRuleBtn = document.createElement("button");
      addRuleBtn.type = "button";
      addRuleBtn.className = "tt-btn tt-btn-secondary tt-btn-small";
      addRuleBtn.setAttribute("data-add-rule", "true");
      addRuleBtn.innerHTML = '<i class="bi bi-plus-lg" aria-hidden="true"></i> Add rule';

      var delayRow = document.createElement("div");
      delayRow.className = "tt-form-row";
      delayRow.style.margin = "0 0 0 auto";
      delayRow.style.minWidth = "150px";
      var delayLabel = document.createElement("label");
      delayLabel.className = "tt-label";
      delayLabel.textContent = "Crawl-delay (optional)";
      var delayInput = document.createElement("input");
      delayInput.type = "number";
      delayInput.className = "tt-input";
      delayInput.min = "0";
      delayInput.step = "0.1";
      delayInput.placeholder = "e.g. 1";
      delayInput.setAttribute("data-group-field", "crawlDelay");
      delayInput.value = group && group.crawlDelay ? group.crawlDelay : "";
      delayRow.appendChild(delayLabel);
      delayRow.appendChild(delayInput);

      rulesActions.appendChild(addRuleBtn);
      rulesActions.appendChild(delayRow);

      wrapper.appendChild(head);
      wrapper.appendChild(rulesContainer);
      wrapper.appendChild(rulesActions);

      return wrapper;
    }

    function addGroup(group) {
      groupsContainer.appendChild(createGroup(group));
      return groupsContainer.lastElementChild;
    }

    function applyPreset(id) {
      var preset = logic.createPreset(id);
      if (!preset) return;

      applyingPreset = true;
      groupsContainer.textContent = "";
      for (var i = 0; i < preset.groups.length; i += 1) {
        addGroup(preset.groups[i]);
      }
      presetSelect.value = id;
      applyingPreset = false;
      renderGenerator();
    }

    function collectGroups() {
      var groups = [];
      var groupElements = groupsContainer.querySelectorAll("[data-group]");

      for (var i = 0; i < groupElements.length; i += 1) {
        var groupElement = groupElements[i];
        var agent = groupElement.querySelector('[data-group-field="userAgent"]').value;
        var delay = groupElement.querySelector('[data-group-field="crawlDelay"]').value;
        var ruleElements = groupElement.querySelectorAll(".tt-group-rule");
        var rules = [];

        for (var r = 0; r < ruleElements.length; r += 1) {
          var directive = ruleElements[r].querySelector('[data-rule-field="directive"]').value;
          var path = ruleElements[r].querySelector('[data-rule-field="path"]').value;
          rules.push({ directive: directive, path: path });
        }

        groups.push({
          userAgent: agent,
          rules: rules,
          crawlDelay: delay
        });
      }

      return groups;
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

    function renderGenerator() {
      var sitemapValue = sitemapInput.value.trim();
      var result = logic.generate({
        groups: collectGroups(),
        sitemaps: sitemapValue ? [sitemapValue] : []
      });

      var hasErrors = result.errors.length > 0;
      var code = result.code;

      output.textContent = code;
      outputWrap.classList.toggle("tt-hidden", !code);
      emptyOutput.classList.toggle("tt-hidden", Boolean(code));
      outputCount.textContent = result.groupCount + " group" + (result.groupCount === 1 ? "" : "s") + " / " + result.ruleCount + " rule" + (result.ruleCount === 1 ? "" : "s");

      renderMessages(errorsBox, errorList, result.errors, "error");
      renderMessages(warningsBox, warningList, result.warnings, "warning");

      if (hasErrors) {
        toolkit.setStatus(generatorStatus, "error", "Fix " + result.errors.length + " validation issue(s) before copying or downloading the file.");
      } else if (code && result.warnings.length) {
        toolkit.setStatus(generatorStatus, "warning", "Generated robots.txt with " + result.warnings.length + " warning(s). Review the notes before publishing.");
      } else if (code) {
        toolkit.setStatus(generatorStatus, "success", "Generated a valid robots.txt file. Review it, then copy or download it.");
      } else {
        toolkit.setStatus(generatorStatus, "neutral", "Add a user-agent group or sitemap URL to generate robots.txt.");
      }

      copyBtn.disabled = hasErrors || !code;
      downloadBtn.disabled = hasErrors || !code;
      validateOutputBtn.disabled = hasErrors || !code;
    }

    var debouncedGenerator = toolkit.debounce(renderGenerator, 140);

    function setActiveTab(which) {
      var showGenerate = which === "generate";
      panelGenerate.classList.toggle("tt-hidden", !showGenerate);
      panelValidate.classList.toggle("tt-hidden", showGenerate);
      tabGenerate.setAttribute("aria-selected", String(showGenerate));
      tabValidate.setAttribute("aria-selected", String(!showGenerate));
      tabGenerate.tabIndex = showGenerate ? 0 : -1;
      tabValidate.tabIndex = showGenerate ? -1 : 0;

      if (!showGenerate && validatorInput.value.trim()) {
        renderValidation();
      }
    }

    tabGenerate.addEventListener("click", function () {
      setActiveTab("generate");
    });

    tabValidate.addEventListener("click", function () {
      setActiveTab("validate");
    });

    tabGenerate.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveTab("validate");
        tabValidate.focus();
      }
    });

    tabValidate.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveTab("generate");
        tabGenerate.focus();
      }
    });

    groupsContainer.addEventListener("input", function (event) {
      if (!applyingPreset && (event.target.matches('[data-group-field="userAgent"]') || event.target.matches('[data-group-field="crawlDelay"]') || event.target.matches('[data-rule-field="path"]') || event.target.matches('[data-rule-field="directive"]'))) {
        presetSelect.value = "custom";
      }
      debouncedGenerator();
    });

    groupsContainer.addEventListener("change", function (event) {
      if (!applyingPreset) {
        presetSelect.value = "custom";
      }
      debouncedGenerator();
    });

    groupsContainer.addEventListener("click", function (event) {
      var removeGroupBtn = event.target.closest("[data-remove-group]");
      if (removeGroupBtn) {
        var groupElement = removeGroupBtn.closest("[data-group]");
        if (groupElement) {
          groupElement.parentNode.removeChild(groupElement);
          presetSelect.value = "custom";
          renderGenerator();
        }
        return;
      }

      var removeRuleBtn = event.target.closest("[data-remove-rule]");
      if (removeRuleBtn) {
        var ruleElement = removeRuleBtn.closest(".tt-group-rule");
        if (ruleElement) {
          var rulesParent = ruleElement.parentNode;
          rulesParent.removeChild(ruleElement);
          if (!rulesParent.querySelector(".tt-group-rule")) {
            rulesParent.appendChild(createRuleRow({ directive: "Disallow", path: "" }));
          }
          presetSelect.value = "custom";
          renderGenerator();
        }
        return;
      }

      var addRuleBtn = event.target.closest("[data-add-rule]");
      if (addRuleBtn) {
        var group = addRuleBtn.closest("[data-group]");
        var rules = group.querySelector("[data-group-rules]");
        var newRule = createRuleRow({ directive: "Disallow", path: "" });
        rules.appendChild(newRule);
        presetSelect.value = "custom";
        renderGenerator();
        newRule.querySelector('[data-rule-field="path"]').focus();
      }
    });

    addGroupBtn.addEventListener("click", function () {
      var group = addGroup({ userAgent: "", rules: [{ directive: "Disallow", path: "" }], crawlDelay: "" });
      presetSelect.value = "custom";
      renderGenerator();
      group.querySelector('[data-group-field="userAgent"]').focus();
    });

    presetSelect.addEventListener("change", function () {
      if (presetSelect.value === "custom") {
        renderGenerator();
        return;
      }
      applyPreset(presetSelect.value);
    });

    sitemapInput.addEventListener("input", debouncedGenerator);

    copyBtn.addEventListener("click", function () {
      if (!output.textContent) return;
      toolkit.copyText(output.textContent).then(function () {
        toolkit.flashButton(copyBtn, "Copied");
        toolkit.setStatus(generatorStatus, "success", "Copied robots.txt to the clipboard.");
      }).catch(function () {
        toolkit.setStatus(generatorStatus, "error", "Copy failed. Select the output manually and copy it.");
      });
    });

    downloadBtn.addEventListener("click", function () {
      if (!output.textContent) return;
      toolkit.downloadText("robots.txt", output.textContent, "text/plain");
      toolkit.setStatus(generatorStatus, "info", "Downloaded robots.txt. Review it before uploading it to your site root.");
    });

    resetBtn.addEventListener("click", function () {
      applyingPreset = true;
      sitemapInput.value = "";
      presetSelect.value = "allow-all";
      groupsContainer.textContent = "";
      var preset = logic.createPreset("allow-all");
      for (var i = 0; i < preset.groups.length; i += 1) {
        addGroup(preset.groups[i]);
      }
      applyingPreset = false;
      renderGenerator();
      groupsContainer.querySelector('[data-group-field="userAgent"]').focus();
    });

    function renderValidation() {
      var text = validatorInput.value;

      if (!text.trim()) {
        validationStatus.className = "tt-status tt-status--neutral";
        validationStatus.textContent = "Paste a robots.txt file or validate the generated output.";
        validationIssues.textContent = "";
        validationIssues.classList.add("tt-hidden");
        validationEmpty.classList.remove("tt-hidden");
        validationSummary.textContent = "";
        statGroups.textContent = "0";
        statRules.textContent = "0";
        statSitemaps.textContent = "0";
        statLines.textContent = "0";
        toolkit.setStatus(validationStatus, "neutral", "Paste a robots.txt file or validate the generated output.");
        return;
      }

      var result = logic.validate(text);
      var stats = result.stats;

      statGroups.textContent = String(stats.groups);
      statRules.textContent = String(stats.rules);
      statSitemaps.textContent = String(stats.sitemaps);
      statLines.textContent = String(stats.lines);
      validationSummary.textContent = stats.errors + " error" + (stats.errors === 1 ? "" : "s") + " and " + stats.warnings + " warning" + (stats.warnings === 1 ? "" : "s") + " found.";

      validationIssues.textContent = "";
      if (!result.issues.length) {
        validationIssues.classList.add("tt-hidden");
        validationEmpty.classList.remove("tt-hidden");
        toolkit.setStatus(validationStatus, "success", "No syntax errors or warnings found.");
        return;
      }

      validationEmpty.classList.add("tt-hidden");
      validationIssues.classList.remove("tt-hidden");

      for (var i = 0; i < result.issues.length; i += 1) {
        var issue = result.issues[i];
        var item = document.createElement("li");
        item.className = "tt-message tt-message--" + (issue.severity === "error" ? "error" : "warning");

        var head = document.createElement("div");
        head.className = "tt-message-head";

        var badge = document.createElement("span");
        badge.className = "tt-badge tt-badge--" + (issue.severity === "error" ? "error" : "warning");
        badge.textContent = issue.severity === "error" ? "Error" : "Warning";

        var line = document.createElement("span");
        line.className = "tt-line";
        line.textContent = "Line " + issue.line;

        head.appendChild(badge);
        head.appendChild(line);

        var message = document.createElement("span");
        message.textContent = issue.message;

        item.appendChild(head);
        item.appendChild(message);
        validationIssues.appendChild(item);
      }

      if (stats.errors > 0) {
        toolkit.setStatus(validationStatus, "error", "Found " + stats.errors + " error(s) and " + stats.warnings + " warning(s). Fix the errors before publishing.");
      } else if (stats.warnings > 0) {
        toolkit.setStatus(validationStatus, "warning", "No syntax errors found, but there are " + stats.warnings + " warning(s) to review.");
      } else {
        toolkit.setStatus(validationStatus, "success", "No syntax errors or warnings found.");
      }
    }

    var debouncedValidation = toolkit.debounce(renderValidation, 220);

    validatorInput.addEventListener("input", debouncedValidation);
    validateBtn.addEventListener("click", renderValidation);

    validateOutputBtn.addEventListener("click", function () {
      if (!output.textContent) return;
      validatorInput.value = output.textContent;
      setActiveTab("validate");
      renderValidation();
      validatorInput.focus();
    });

    var initialPreset = logic.createPreset("allow-all");
    applyingPreset = true;
    for (var i = 0; i < initialPreset.groups.length; i += 1) {
      addGroup(initialPreset.groups[i]);
    }
    presetSelect.value = "allow-all";
    applyingPreset = false;

    setActiveTab("generate");
    renderGenerator();
    renderValidation();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
