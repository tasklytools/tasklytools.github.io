(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./tool-utils.js'));
  } else {
    root.TasklyRate = factory(root.TasklyToolUtils);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (utils) {
  'use strict';

  function nonNegative(value) {
    return Math.max(0, utils.parseNumber(value, 0));
  }

  function calculate(data) {
    var source = data || {};
    var incomeGoal = nonNegative(source.incomeGoal);
    var taxRate = Math.min(Math.max(utils.parseNumber(source.taxRate, 0), 0), 99);
    var annualExpenses = nonNegative(source.annualExpenses);
    var bufferPercent = nonNegative(source.bufferPercent);
    var weeksPerYear = nonNegative(source.weeksPerYear);
    var hoursPerWeek = nonNegative(source.hoursPerWeek);
    var utilizationPercent = Math.min(
      Math.max(utils.parseNumber(source.utilizationPercent, 0), 0),
      100
    );
    var projectHours = nonNegative(source.projectHours);

    var preTaxIncome = incomeGoal / (1 - taxRate / 100);
    var taxReserve = preTaxIncome - incomeGoal;
    var baseRevenue = preTaxIncome + annualExpenses;
    var bufferAmount = baseRevenue * (bufferPercent / 100);
    var targetRevenue = baseRevenue + bufferAmount;

    var billableHoursPerWeek = hoursPerWeek * (utilizationPercent / 100);
    var billableHoursPerYear = weeksPerYear * billableHoursPerWeek;
    var billableHoursPerDay = billableHoursPerWeek / 5;
    var workingHoursPerYear = weeksPerYear * hoursPerWeek;

    var hourlyRate =
      billableHoursPerYear > 0 ? targetRevenue / billableHoursPerYear : 0;

    return {
      currency: utils.normalizeCurrency(source.currency),
      incomeGoal: utils.round2(incomeGoal),
      taxRate: taxRate,
      annualExpenses: utils.round2(annualExpenses),
      bufferPercent: bufferPercent,
      weeksPerYear: weeksPerYear,
      hoursPerWeek: hoursPerWeek,
      utilizationPercent: utilizationPercent,
      projectHours: projectHours,
      preTaxIncome: utils.round2(preTaxIncome),
      taxReserve: utils.round2(taxReserve),
      baseRevenue: utils.round2(baseRevenue),
      bufferAmount: utils.round2(bufferAmount),
      targetRevenue: utils.round2(targetRevenue),
      workingHoursPerYear: utils.round2(workingHoursPerYear),
      billableHoursPerWeek: utils.round2(billableHoursPerWeek),
      billableHoursPerYear: utils.round2(billableHoursPerYear),
      billableHoursPerDay: utils.round2(billableHoursPerDay),
      hourlyRate: utils.round2(hourlyRate),
      dailyRate: utils.round2(hourlyRate * billableHoursPerDay),
      weeklyRate: utils.round2(hourlyRate * billableHoursPerWeek),
      monthlyRate: utils.round2(targetRevenue / 12),
      projectRate: utils.round2(hourlyRate * projectHours)
    };
  }

  function validate(data) {
    var source = data || {};
    var errors = {};
    var totals = calculate(source);

    if (utils.isBlank(source.incomeGoal)) {
      errors.incomeGoal = 'Enter your desired annual take-home income.';
    } else if (utils.parseNumber(source.incomeGoal, 0) < 0) {
      errors.incomeGoal = 'Income goal cannot be negative.';
    }

    var taxRate = utils.parseNumber(source.taxRate, 0);

    if (taxRate < 0 || taxRate > 99) {
      errors.taxRate = 'Tax rate must be between 0 and 99.';
    }

    if (utils.parseNumber(source.annualExpenses, 0) < 0) {
      errors.annualExpenses = 'Annual expenses cannot be negative.';
    }

    if (utils.parseNumber(source.bufferPercent, 0) < 0) {
      errors.bufferPercent = 'Buffer percentage cannot be negative.';
    }

    if (utils.parseNumber(source.weeksPerYear, 0) <= 0) {
      errors.weeksPerYear = 'Enter at least 1 working week per year.';
    }

    if (utils.parseNumber(source.hoursPerWeek, 0) <= 0) {
      errors.hoursPerWeek = 'Enter the hours you work per week.';
    }

    var utilization = utils.parseNumber(source.utilizationPercent, 0);

    if (utilization <= 0 || utilization > 100) {
      errors.utilizationPercent = 'Billable utilization must be between 1 and 100.';
    }

    if (utils.parseNumber(source.projectHours, 0) <= 0) {
      errors.projectHours = 'Enter the hours for a typical project.';
    }

    if (totals.billableHoursPerYear <= 0) {
      errors.utilizationPercent =
        errors.utilizationPercent || 'This setup produces no billable hours.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      totals: totals
    };
  }

  return {
    calculate: calculate,
    validate: validate
  };
});
