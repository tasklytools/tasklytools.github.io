/* Profit Calculator DOM controller. Calculations live in profit-logic.js. */
(function (root) {
  "use strict";

  function init() {
    var form = document.getElementById("profitForm");
    if (!form || !root.TasklyProfit || !root.TasklyToolUtils) return;

    var utils = root.TasklyToolUtils;
    var resetButton = document.getElementById("resetProfitBtn");
    var primaryCard = document.getElementById("profitPrimaryCard");
    var resultsPanel = document.getElementById("profitResults");
    var numericIds = ["revenue", "cogs", "operating", "marketing", "other"];

    function fieldValue(id) {
      var field = document.getElementById(id);
      return field ? field.value : "";
    }

    function readForm() {
      return {
        currency: fieldValue("currency"),
        revenue: fieldValue("revenue"),
        cogs: fieldValue("cogs"),
        operating: fieldValue("operating"),
        marketing: fieldValue("marketing"),
        other: fieldValue("other"),
        taxRate: fieldValue("taxRate")
      };
    }

    function setText(id, value) {
      var element = document.getElementById(id);
      if (element) element.textContent = value;
    }

    function setStatus(type, message) {
      var status = document.getElementById("profitStatus");
      if (!status) return;

      if (root.TasklyUI) {
        root.TasklyUI.setStatus(status, type, message);
      } else {
        status.className = "tt-status tt-status--" + type;
        status.textContent = message;
      }
    }

    function markInvalid(id, invalid) {
      var field = document.getElementById(id);
      if (!field) return;

      if (invalid) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    }

    function update() {
      var data = readForm();
      var totals = root.TasklyProfit.calculate(data);
      var currency = totals.currency;
      var invalid = false;

      numericIds.forEach(function (id) {
        var field = document.getElementById(id);
        var value = field ? field.value : "";
        var isNegative = !utils.isBlank(value) && utils.parseNumber(value, 0) < 0;
        markInvalid(id, isNegative);
        if (isNegative) invalid = true;
      });

      var taxValue = fieldValue("taxRate");
      var taxNumber = utils.parseNumber(taxValue, 0);
      var taxInvalid =
        !utils.isBlank(taxValue) && (taxNumber < 0 || taxNumber > 100);
      markInvalid("taxRate", taxInvalid);
      if (taxInvalid) invalid = true;

      var hasValues =
        totals.revenue > 0 ||
        totals.totalExpenses > 0 ||
        totals.fixedExpenses > 0;

      if (primaryCard) {
        var isLoss = totals.netBeforeTax < 0;
        primaryCard.classList.toggle("tt-result-card--warning", isLoss);
        primaryCard.classList.toggle("tt-result-card--primary", !isLoss);
      }

      setText("profitBeforeTax", utils.formatCurrency(totals.netBeforeTax, currency));
      setText("grossProfit", utils.formatCurrency(totals.grossProfit, currency));
      setText("totalExpenses", utils.formatCurrency(totals.totalExpenses, currency));
      setText("taxAmount", utils.formatCurrency(totals.taxAmount, currency));
      setText("netAfterTax", utils.formatCurrency(totals.netAfterTax, currency));

      setText(
        "profitPrimaryNote",
        totals.revenue > 0
          ? "Net margin before tax: " + utils.formatPercent(totals.netMargin, 1) +
            (totals.netBeforeTax < 0 ? " — running at a loss before tax." : ".")
          : "Enter revenue to calculate a meaningful margin."
      );

      setText(
        "grossProfitNote",
        totals.revenue > 0
          ? "Gross margin: " + utils.formatPercent(totals.grossMargin, 1) + "."
          : "Revenue minus cost of goods sold."
      );

      setText(
        "taxNote",
        "Applied at " + utils.formatNumber(totals.taxRate, 1) +
          "% only when profit before tax is positive."
      );

      setText(
        "netAfterTaxNote",
        totals.revenue > 0
          ? "After-tax margin: " + utils.formatPercent(totals.afterTaxMargin, 1) + "."
          : "Profit remaining after estimated tax."
      );

      if (totals.breakEvenRevenue === null) {
        setText("breakEvenRevenue", "Not available");
        setText(
          "breakEvenNote",
          "Break-even needs a gross margin above 0. Your gross profit must be positive for this calculation."
        );
      } else {
        setText(
          "breakEvenRevenue",
          utils.formatCurrency(totals.breakEvenRevenue, currency)
        );

        if (totals.breakEvenGap >= 0) {
          setText(
            "breakEvenNote",
            "You are " + utils.formatCurrency(totals.breakEvenGap, currency) +
              " above the revenue needed to cover fixed expenses."
          );
        } else {
          setText(
            "breakEvenNote",
            "You are " + utils.formatCurrency(Math.abs(totals.breakEvenGap), currency) +
              " below the revenue needed to cover fixed expenses."
          );
        }
      }

      setText("summaryRevenue", utils.formatCurrency(totals.revenue, currency));
      setText("summaryCogs", utils.formatCurrency(totals.cogs, currency));
      setText("summaryOperating", utils.formatCurrency(totals.operating, currency));
      setText("summaryMarketing", utils.formatCurrency(totals.marketing, currency));
      setText("summaryOther", utils.formatCurrency(totals.other, currency));
      setText("summaryTotalExpenses", utils.formatCurrency(totals.totalExpenses, currency));

      if (invalid) {
        setStatus(
          "error",
          "Amounts cannot be negative, and the tax rate must be between 0 and 100. Negative inputs are treated as zero."
        );
      } else if (!hasValues) {
        setStatus(
          "info",
          "Enter revenue and costs to see gross profit, net profit, margins, and break-even."
        );
      } else {
        setStatus(
          "success",
          "Results update automatically. All calculations stay in your browser."
        );
      }
    }

    form.addEventListener("input", update);
    form.addEventListener("change", update);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      update();

      if (resultsPanel) {
        resultsPanel.setAttribute("tabindex", "-1");
        resultsPanel.focus({ preventScroll: true });
      }
    });

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        form.reset();
        update();
        var revenue = document.getElementById("revenue");
        if (revenue) revenue.focus();
      });
    }

    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
