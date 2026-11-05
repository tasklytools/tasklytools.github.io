/* Proposal Generator DOM controller. Content logic lives in proposal-logic.js. */
(function (root) {
  "use strict";

  function init() {
    var form = document.getElementById("proposalForm");
    if (!form || !root.TasklyProposal || !root.TasklyToolUtils) return;

    var utils = root.TasklyToolUtils;
    var generateButton = document.getElementById("generateProposalBtn");
    var resetButton = document.getElementById("resetProposalBtn");
    var copyButton = document.getElementById("copyProposalBtn");
    var printButton = document.getElementById("printProposalBtn");
    var paper = document.getElementById("proposalPaper");
    var emptyState = document.getElementById("proposalEmpty");
    var summary = document.getElementById("proposalErrorSummary");
    var summaryList = document.getElementById("proposalErrorList");
    var currentProposal = null;
    var generated = false;

    var fields = [
      "projectTitle",
      "businessName",
      "businessEmail",
      "clientName",
      "clientEmail",
      "preparedDate",
      "validUntil",
      "overview",
      "scope",
      "deliverables",
      "timeline",
      "investment",
      "paymentTerms",
      "nextSteps"
    ];

    document.body.classList.add("tt-print-page");

    function fieldValue(id) {
      var field = document.getElementById(id);
      return field ? field.value : "";
    }

    function readForm() {
      return {
        projectTitle: fieldValue("projectTitle"),
        businessName: fieldValue("businessName"),
        businessEmail: fieldValue("businessEmail"),
        clientName: fieldValue("clientName"),
        clientEmail: fieldValue("clientEmail"),
        preparedDate: fieldValue("preparedDate"),
        validUntil: fieldValue("validUntil"),
        currency: fieldValue("currency"),
        overview: fieldValue("overview"),
        scope: fieldValue("scope"),
        deliverables: fieldValue("deliverables"),
        timeline: fieldValue("timeline"),
        investment: fieldValue("investment"),
        paymentTerms: fieldValue("paymentTerms"),
        nextSteps: fieldValue("nextSteps")
      };
    }

    function setText(id, value) {
      var element = document.getElementById(id);
      if (element) element.textContent = value === null || value === undefined ? "" : String(value);
    }

    function setStatus(type, message) {
      var status = document.getElementById("proposalStatus");
      if (!status) return;

      if (root.TasklyUI) {
        root.TasklyUI.setStatus(status, type, message);
      } else {
        status.className = "tt-status tt-status--" + type;
        status.textContent = message;
      }
    }

    function setActionsEnabled(enabled) {
      [copyButton, printButton].forEach(function (button) {
        if (button) button.disabled = !enabled;
      });
    }

    function clearAllErrors() {
      fields.forEach(function (id) {
        utils.clearFieldError(id);
      });
      if (summary) summary.hidden = true;
      if (summaryList) summaryList.textContent = "";
    }

    function showErrors(result) {
      clearAllErrors();

      var messages = [];
      Object.keys(result.errors).forEach(function (key) {
        messages.push(result.errors[key]);
        utils.setFieldError(key, result.errors[key]);
      });

      if (summary && summaryList) {
        messages.forEach(function (message) {
          var item = document.createElement("li");
          item.textContent = message;
          summaryList.appendChild(item);
        });
        summary.hidden = false;
      }

      setStatus("error", "Check the highlighted fields, then generate the proposal again.");

      var firstKey = Object.keys(result.errors)[0];
      var target = document.getElementById(firstKey);
      if (target && target.focus) {
        target.focus();
        if (target.scrollIntoView) {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }

    function renderList(id, items) {
      var list = document.getElementById(id);
      if (!list) return;

      while (list.firstChild) list.removeChild(list.firstChild);

      items.forEach(function (item) {
        var row = document.createElement("li");
        row.textContent = item;
        list.appendChild(row);
      });

      var section = list.closest("[data-proposal-section]");
      if (section) section.hidden = items.length === 0;
    }

    function contactLine(name, email) {
      var parts = [String(name || "").trim()];

      if (String(email || "").trim()) {
        parts.push("(" + String(email).trim() + ")");
      }

      return parts.filter(Boolean).join(" ");
    }

    function renderProposal(model) {
      setText("previewProposalTitle", model.title || "Project proposal");
      setText("proposalPreparedFor", contactLine(model.clientName, model.clientEmail));
      setText("proposalPreparedBy", contactLine(model.businessName, model.businessEmail));
      setText("proposalDate", model.preparedDate ? utils.formatDate(model.preparedDate) : "");

      var validRow = document.getElementById("proposalValidRow");
      if (validRow) validRow.hidden = !model.validUntil;
      setText(
        "proposalValidUntil",
        model.validUntil ? utils.formatDate(model.validUntil) : ""
      );

      setText("previewOverview", model.overview);
      setText("previewScope", model.scope);
      renderList("previewDeliverables", model.deliverables);
      renderList("previewTimeline", model.timeline);

      var investmentSection = document.getElementById("previewInvestmentSection");
      if (investmentSection) investmentSection.hidden = model.investment === null;
      setText(
        "previewInvestmentAmount",
        model.investment === null
          ? ""
          : utils.formatCurrency(model.investment, model.currency)
      );

      var paymentSection = document.getElementById("previewPaymentSection");
      if (paymentSection) paymentSection.hidden = !model.paymentTerms;
      setText("previewPaymentTerms", model.paymentTerms);

      renderList("previewNextSteps", model.nextSteps);

      if (paper) paper.hidden = false;
      if (emptyState) emptyState.hidden = true;
      setActionsEnabled(true);
    }

    function editableText(id) {
      var element = document.getElementById(id);
      if (!element) return "";
      return String(element.innerText || element.textContent || "").trim();
    }

    function listText(id) {
      var list = document.getElementById(id);
      if (!list) return [];

      return Array.prototype.slice
        .call(list.children)
        .map(function (item) {
          return String(item.innerText || item.textContent || "").trim();
        })
        .filter(Boolean);
    }

    function readPreviewModel() {
      if (!currentProposal) return null;

      return {
        title: String(document.getElementById("previewProposalTitle").textContent || "").trim(),
        businessName: currentProposal.businessName,
        businessEmail: currentProposal.businessEmail,
        clientName: currentProposal.clientName,
        clientEmail: currentProposal.clientEmail,
        preparedDate: currentProposal.preparedDate,
        validUntil: currentProposal.validUntil,
        currency: currentProposal.currency,
        overview: editableText("previewOverview"),
        scope: editableText("previewScope"),
        deliverables: listText("previewDeliverables"),
        timeline: listText("previewTimeline"),
        investment: currentProposal.investment,
        paymentTerms: editableText("previewPaymentTerms"),
        nextSteps: listText("previewNextSteps")
      };
    }

    function generate() {
      var result = root.TasklyProposal.validate(readForm());

      if (!result.valid) {
        showErrors(result);
        return;
      }

      clearAllErrors();
      currentProposal = result.proposal;
      renderProposal(currentProposal);
      generated = true;
      setStatus(
        "success",
        "Proposal generated. Click any section in the preview to fine-tune the wording."
      );
    }

    function reset() {
      var confirmed = window.confirm(
        "Reset this proposal? The form and the current preview will be cleared."
      );

      if (!confirmed) return;

      form.reset();
      currentProposal = null;
      generated = false;
      clearAllErrors();
      setActionsEnabled(false);

      if (paper) paper.hidden = true;
      if (emptyState) emptyState.hidden = false;

      var prepared = document.getElementById("preparedDate");
      if (prepared) prepared.value = utils.todayISO();

      setStatus("info", "Fill in the form and generate a preview. Nothing is uploaded.");
      var first = document.getElementById("projectTitle");
      if (first) first.focus();
    }

    form.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target.tagName === "INPUT") {
        event.preventDefault();
        generate();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      generate();
    });

    form.addEventListener("input", function (event) {
      if (event.target && event.target.id) {
        utils.clearFieldError(event.target.id);
      }

      if (generated) {
        setStatus(
          "info",
          "Form changed. Generate again to update the preview; direct edits in the preview are kept until then."
        );
      }
    });

    if (resetButton) {
      resetButton.addEventListener("click", reset);
    }

    if (copyButton) {
      copyButton.addEventListener("click", function () {
        var model = readPreviewModel();

        if (!model) {
          setStatus("error", "Generate a proposal before copying it.");
          return;
        }

        var text = root.TasklyProposal.proposalToText(model);

        root.TasklyUI.copyText(text).then(
          function () {
            setStatus("success", "Proposal copied to your clipboard as plain text.");

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
            setStatus(
              "error",
              "Copy was blocked by the browser. Select the preview text and copy it manually."
            );
          }
        );
      });
    }

    if (printButton) {
      printButton.addEventListener("click", function () {
        if (!currentProposal) {
          setStatus("error", "Generate a proposal before printing it.");
          return;
        }

        window.print();
      });
    }

    var prepared = document.getElementById("preparedDate");
    if (prepared && !prepared.value) prepared.value = utils.todayISO();

    setActionsEnabled(false);
    setStatus("info", "Fill in the form and generate a preview. Nothing is uploaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
