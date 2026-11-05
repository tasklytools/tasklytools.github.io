/* Freelance Rate Calculator DOM controller. Calculations live in rate-logic.js. */
(function (root) {
  "use strict";

  function init() {
    var form = document.getElementById("rateForm");
    if (!form || !root.TasklyRate || !root.TasklyToolUtils) return;

    var utils = root.TasklyToolUtils;
    var resetButton = document.getElementById("resetRateBtn");
    var resultsPanel = document.getElementById("rateResults");

    var fields = [
      "incomeGoal",
      "taxRate",
      "annualExpenses",
      "bufferPercent",
      "weeksPerYear",
      "hoursPerWeek",
      "utilizationPercent",
      "projectHours"
    ];

    function fieldValue(id) {
      var field = document.getElementById(id);
      return field ? field.value : "";
    }

    function readForm() {
      return {
        currency: fieldValue("currency"),
        incomeGoal: fieldValue("incomeGoal"),
        taxRate: fieldValue("taxRate"),
        annualExpenses: fieldValue("annualExpenses"),
        bufferPercent: fieldValue("bufferPercent"),
        weeksPerYear: fieldValue("weeksPerYear"),
        hoursPerWeek: fieldValue("hoursPerWeek"),
        utilizationPercent: fieldValue("utilizationPercent"),
        projectHours: fieldValue("projectHours")
      };
    }

    function setText(id, value) {
      var element = document.getElementById(id);
      if (element) element.textContent = value;
    }

    function setStatus(type, message) {
      var status = document.getElementById("rateStatus");
      if (!status) return;

      if (root.TasklyUI) {
        root.TasklyUI.setStatus(status, type, message);
      } else {
        status.className = "tt-status tt-status--" + type;
        status.textContent = message;
      }
    }

    function formatHours(value) {
      var number = utils.parseNumber(value, 0);
      return utils.formatNumber(number, Number.isInteger(number) ? 0 : 1);
    }

    function clearAllErrors() {
      fields.forEach(function (id) {
        utils.clearFieldError(id);
      });
    }

    function showErrors(result) {
      clearAllErrors();

      Object.keys(result.errors).forEach(function (key) {
        utils.setFieldError(key, result.errors[key]);
      });

      setStatus("error", "Check the highlighted fields before relying on these rates.");

      var firstKey = Object.keys(result.errors)[0];
      var target = document.getElementById(firstKey);
      if (target && target.focus) {
        target.focus();
        if (target.scrollIntoView) {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        }
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
      var totals = root.TasklyRate.calculate(data);
      var currency = totals.currency;
      var invalid = false;

      [
        "incomeGoal",
        "annualExpenses",
        "bufferPercent",
        "weeksPerYear",
        "hoursPerWeek",
        "projectHours"
      ].forEach(function (id) {
        var value = fieldValue(id);
        var isNegative = !utils.isBlank(value) && utils.parseNumber(value, 0) < 0;
        markInvalid(id, isNegative);
        if (isNegative) invalid = true;
      });

      var tax = utils.parseNumber(fieldValue("taxRate"), 0);
      var taxInvalid = tax < 0 || tax > 99;
      markInvalid("taxRate", taxInvalid);
      if (taxInvalid) invalid = true;

      var utilization = utils.parseNumber(fieldValue("utilizationPercent"), 0);
      var utilizationInvalid = utilization <= 0 || utilization > 100;
      markInvalid("utilizationPercent", utilizationInvalid);
      if (utilizationInvalid) invalid = true;

      setText("hourlyRate", utils.formatCurrency(totals.hourlyRate, currency));
      setText("dailyRate", utils.formatCurrency(totals.dailyRate, currency));
      setText("weeklyRate", utils.formatCurrency(totals.weeklyRate, currency));
      setText("monthlyRate", utils.formatCurrency(totals.monthlyRate, currency));
      setText("projectRate", utils.formatCurrency(totals.projectRate, currency));

      setText(
        "hourlyRateNote",
        totals.billableHoursPerYear > 0
          ? "Based on " + utils.formatNumber(totals.billableHoursPerYear, 0) +
            " billable hours a year at " + utils.formatNumber(totals.utilizationPercent, 0) +
            "% utilization."
          : "Add your income goal and working hours to calculate a rate."
      );

      setText(
        "weeklyRateNote",
        "Assumes " + formatHours(totals.billableHoursPerWeek) + " billable hours per week."
      );

      setText(
        "projectRateNote",
        "For a typical " + formatHours(totals.projectHours) + "-hour project."
      );

      setText("summaryTakeHome", utils.formatCurrency(totals.incomeGoal, currency));
      setText("summaryTaxReserve", utils.formatCurrency(totals.taxReserve, currency));
      setText("summaryPreTaxIncome", utils.formatCurrency(totals.preTaxIncome, currency));
      setText("summaryExpenses", utils.formatCurrency(totals.annualExpenses, currency));
      setText("summaryBuffer", utils.formatCurrency(totals.bufferAmount, currency));
      setText("summaryTargetRevenue", utils.formatCurrency(totals.targetRevenue, currency));
      setText(
        "summaryBufferLabel",
        "Profit buffer (" + utils.formatNumber(totals.bufferPercent, 1) + "%)"
      );
      setText(
        "rateHoursSummary",
        formatHours(totals.workingHoursPerYear) + " working hours a year, of which " +
          formatHours(totals.billableHoursPerYear) +
          " are billable. Daily and weekly rates use the same utilization assumption."
      );

      if (invalid) {
        setStatus(
          "error",
          "Amounts cannot be negative, tax must be between 0 and 99, and utilization must be between 1 and 100."
        );
      } else if (totals.targetRevenue <= 0) {
        setStatus(
          "info",
          "Enter your desired take-home income to calculate a sustainable hourly rate."
        );
      } else {
        setStatus(
          "success",
          "Rates update automatically. Every calculation runs in your browser."
        );
      }
    }

    form.addEventListener("input", function (event) {
      if (event.target && event.target.id) {
        utils.clearFieldError(event.target.id);
      }
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

      var result = root.TasklyRate.validate(readForm());

      if (!result.valid) {
        showErrors(result);
        return;
      }

      clearAllErrors();
      update();

      if (resultsPanel) {
        resultsPanel.setAttribute("tabindex", "-1");
        resultsPanel.focus({ preventScroll: true });
      }
    });

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        form.reset();
        clearAllErrors();
        update();
        var first = document.getElementById("incomeGoal");
        if (first) first.focus();
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
