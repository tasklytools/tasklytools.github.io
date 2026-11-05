/* Invoice Generator DOM controller. Calculations live in invoice-logic.js. */
(function (root) {
  "use strict";

  function init() {
    var form = document.getElementById("invoiceForm");
    if (!form || !root.TasklyInvoice || !root.TasklyToolUtils) return;

    var utils = root.TasklyToolUtils;
    var itemsContainer = document.getElementById("invoiceItems");
    var template = document.getElementById("invoiceItemTemplate");
    var addButton = document.getElementById("addInvoiceItem");
    var printButton = document.getElementById("printInvoiceBtn");
    var resetButton = document.getElementById("resetInvoiceBtn");
    var summary = document.getElementById("invoiceErrorSummary");
    var summaryList = document.getElementById("invoiceErrorList");

    if (!itemsContainer || !template) return;

    document.body.classList.add("tt-print-page");

    var itemFields = ["description", "quantity", "unitPrice"];

    function fieldValue(id) {
      var field = document.getElementById(id);
      return field ? field.value : "";
    }

    function readForm() {
      return {
        invoiceNumber: fieldValue("invoiceNumber"),
        issueDate: fieldValue("issueDate"),
        dueDate: fieldValue("dueDate"),
        currency: fieldValue("currency"),
        fromName: fieldValue("fromName"),
        fromEmail: fieldValue("fromEmail"),
        fromAddress: fieldValue("fromAddress"),
        clientName: fieldValue("clientName"),
        clientEmail: fieldValue("clientEmail"),
        clientAddress: fieldValue("clientAddress"),
        taxRate: fieldValue("taxRate"),
        discountType: fieldValue("discountType"),
        discountValue: fieldValue("discountValue"),
        notes: fieldValue("invoiceNotes"),
        terms: fieldValue("invoiceTerms"),
        items: getItemRows().map(function (row) {
          return {
            description: row.querySelector('[data-field="description"]').value,
            quantity: row.querySelector('[data-field="quantity"]').value,
            unitPrice: row.querySelector('[data-field="unitPrice"]').value
          };
        })
      };
    }

    function getItemRows() {
      return Array.prototype.slice.call(
        itemsContainer.querySelectorAll("[data-invoice-item]")
      );
    }

    function reindexItems() {
      getItemRows().forEach(function (row, index) {
        itemFields.forEach(function (field) {
          var input = row.querySelector('[data-field="' + field + '"]');
          var label = row.querySelector('[data-label-for="' + field + '"]');
          var error = row.querySelector('[data-error-for="' + field + '"]');
          var id = "item-" + field + "-" + index;

          if (input) {
            input.id = id;
            input.setAttribute("aria-describedby", id + "-error");
          }

          if (label) {
            label.setAttribute("for", id);
          }

          if (error) {
            error.id = id + "-error";
          }
        });

        var total = row.querySelector("[data-line-total]");
        if (total && root.TasklyInvoice) {
          var currency = fieldValue("currency");
          var amount = utils.parseNumber(
            row.querySelector('[data-field="quantity"]').value,
            0
          ) * utils.parseNumber(row.querySelector('[data-field="unitPrice"]').value, 0);
          total.textContent = utils.formatCurrency(amount, currency);
        }
      });
    }

    function addItem(values, focus) {
      var fragment = template.content.cloneNode(true);
      var row = fragment.querySelector("[data-invoice-item]");
      var source = values || {};

      if (source.description) {
        row.querySelector('[data-field="description"]').value = source.description;
      }
      if (source.quantity !== undefined && source.quantity !== "") {
        row.querySelector('[data-field="quantity"]').value = source.quantity;
      }
      if (source.unitPrice !== undefined && source.unitPrice !== "") {
        row.querySelector('[data-field="unitPrice"]').value = source.unitPrice;
      }

      itemsContainer.appendChild(row);
      reindexItems();

      if (focus) {
        var input = itemsContainer.querySelector(
          "[data-invoice-item]:last-child [data-field=\"description\"]"
        );
        if (input) input.focus();
      }
    }

    function setPreviewText(id, value) {
      var element = document.getElementById(id);
      if (element) element.textContent = value;
    }

    function contactText(email, address) {
      return [email, address]
        .map(function (part) {
          return String(part || "").trim();
        })
        .filter(Boolean)
        .join("\n");
    }

    function formatQuantity(value) {
      var number = utils.parseNumber(value, 0);
      return utils.formatNumber(number, Number.isInteger(number) ? 0 : 2);
    }

    function appendCell(row, value) {
      var cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }

    function renderItems(items, currency) {
      var tbody = document.getElementById("invoicePreviewItems");
      if (!tbody) return;

      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

      if (!items.length) {
        var emptyRow = document.createElement("tr");
        var emptyCell = document.createElement("td");
        emptyCell.colSpan = 4;
        emptyCell.className = "tt-invoice-empty";
        emptyCell.textContent = "Your line items will appear here.";
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        return;
      }

      items.forEach(function (item) {
        var row = document.createElement("tr");
        appendCell(row, item.description || "Item");
        appendCell(row, formatQuantity(item.quantity));
        appendCell(row, utils.formatCurrency(item.unitPrice, currency));
        appendCell(row, utils.formatCurrency(item.amount, currency));
        tbody.appendChild(row);
      });
    }

    function renderPreview(data, totals) {
      var currency = totals.currency;

      setPreviewText("previewBusinessName", String(data.fromName || "").trim() || "Your business");
      setPreviewText("previewBusinessContact", contactText(data.fromEmail, data.fromAddress));
      setPreviewText("previewClientName", String(data.clientName || "").trim() || "Client name");
      setPreviewText("previewClientContact", contactText(data.clientEmail, data.clientAddress));
      setPreviewText("previewInvoiceNumber", String(data.invoiceNumber || "").trim() || "Not set");
      setPreviewText("previewIssueDate", utils.formatDate(data.issueDate) || "Not set");
      setPreviewText("previewDueDate", utils.formatDate(data.dueDate) || "Not set");
      setPreviewText("previewSubtotal", utils.formatCurrency(totals.subtotal, currency));
      setPreviewText("previewTotal", utils.formatCurrency(totals.total, currency));

      renderItems(totals.items, currency);

      var discountRow = document.getElementById("previewDiscountRow");
      var discountLabel = document.getElementById("previewDiscountLabel");
      if (discountRow) discountRow.hidden = totals.discountAmount <= 0;
      if (discountLabel) {
        discountLabel.textContent =
          totals.discountType === "percent" && totals.discountAmount > 0
            ? "Discount (" + utils.formatNumber(totals.discountValue, 2) + "%)"
            : "Discount";
      }
      setPreviewText("previewDiscount", "-" + utils.formatCurrency(totals.discountAmount, currency));

      var taxRow = document.getElementById("previewTaxRow");
      var taxLabel = document.getElementById("previewTaxLabel");
      if (taxRow) taxRow.hidden = totals.taxRate <= 0;
      if (taxLabel) {
        taxLabel.textContent =
          "Tax (" + utils.formatNumber(totals.taxRate, 2) + "%)";
      }
      setPreviewText("previewTax", utils.formatCurrency(totals.taxAmount, currency));

      var notesSection = document.getElementById("previewNotesSection");
      var termsSection = document.getElementById("previewTermsSection");
      var hasNotes = !utils.isBlank(data.notes);
      var hasTerms = !utils.isBlank(data.terms);

      if (notesSection) notesSection.hidden = !hasNotes;
      if (termsSection) termsSection.hidden = !hasTerms;
      setPreviewText("previewNotes", data.notes);
      setPreviewText("previewTerms", data.terms);
    }

    function update() {
      var data = readForm();
      var totals = root.TasklyInvoice.calculate(data);
      renderPreview(data, totals);
      reindexItems();

      if (totals.itemCount > 0) {
        utils.clearFieldError("invoiceItems");
      }
    }

    function clearAllErrors() {
      form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });

      form.querySelectorAll(".tt-input-error").forEach(function (field) {
        field.classList.remove("tt-input-error");
      });

      form.querySelectorAll(".tt-error").forEach(function (error) {
        error.textContent = "";
        error.hidden = true;
      });

      itemsContainer.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });

      if (summary) summary.hidden = true;
      if (summaryList) summaryList.textContent = "";
    }

    function showErrors(result) {
      clearAllErrors();

      var messages = [];
      Object.keys(result.errors).forEach(function (key) {
        var message = result.errors[key];
        messages.push(message);

        if (key === "items") {
          utils.setFieldError("invoiceItems", message);
          return;
        }

        utils.setFieldError(key, message);
      });

      if (summary && summaryList && messages.length) {
        messages.forEach(function (message) {
          var item = document.createElement("li");
          item.textContent = message;
          summaryList.appendChild(item);
        });
        summary.hidden = false;
      }

      var firstKey = Object.keys(result.errors)[0];
      var target =
        firstKey === "items"
          ? itemsContainer.querySelector('[data-field="description"]')
          : document.getElementById(firstKey);

      if (target && target.focus) {
        target.focus();
        if (target.scrollIntoView) {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }

    function defaultNumber() {
      return "INV-" + utils.todayISO().replace(/-/g, "");
    }

    function applyDefaults() {
      var issue = document.getElementById("issueDate");
      var due = document.getElementById("dueDate");
      var number = document.getElementById("invoiceNumber");

      if (issue && !issue.value) issue.value = utils.todayISO();
      if (due && !due.value) due.value = utils.addDaysISO(issue ? issue.value : utils.todayISO(), 14);
      if (number && !number.value) number.value = defaultNumber();
    }

    function reset() {
      var confirmed = window.confirm(
        "Reset this invoice? All entered invoice details and line items will be cleared."
      );

      if (!confirmed) return;

      form.reset();
      itemsContainer.textContent = "";
      summary.hidden = true;
      clearAllErrors();
      applyDefaults();
      addItem({ quantity: 1 });
      update();

      var first = document.getElementById("invoiceNumber");
      if (first) first.focus();
    }

    form.addEventListener("input", function (event) {
      if (event.target && event.target.id) {
        utils.clearFieldError(event.target.id);
      }

      if (summary) summary.hidden = true;
      update();
    });

    form.addEventListener("change", function (event) {
      if (event.target && event.target.id) {
        utils.clearFieldError(event.target.id);
      }
      update();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      update();
    });

    itemsContainer.addEventListener("click", function (event) {
      var removeButton = event.target.closest("[data-remove-item]");
      if (!removeButton) return;

      var row = removeButton.closest("[data-invoice-item]");
      var rows = getItemRows();

      if (row && rows.length === 1) {
        row.querySelectorAll("[data-field]").forEach(function (input) {
          input.value = "";
        });
        var description = row.querySelector('[data-field="description"]');
        if (description) description.focus();
      } else if (row) {
        row.remove();
        var nextRow = itemsContainer.querySelector("[data-invoice-item]:last-child");
        if (nextRow) {
          var nextDescription = nextRow.querySelector('[data-field="description"]');
          if (nextDescription) nextDescription.focus();
        }
      }

      reindexItems();
      update();
    });

    if (addButton) {
      addButton.addEventListener("click", function () {
        addItem({ quantity: 1 }, true);
        update();
      });
    }

    if (printButton) {
      printButton.addEventListener("click", function () {
        var result = root.TasklyInvoice.validate(readForm());

        if (!result.valid) {
          showErrors(result);
          return;
        }

        clearAllErrors();
        update();
        window.print();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", reset);
    }

    window.addEventListener("beforeprint", update);

    applyDefaults();
    addItem({ quantity: 1 });
    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
