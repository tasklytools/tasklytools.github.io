(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./tool-utils.js'));
  } else {
    root.TasklyProfit = factory(root.TasklyToolUtils);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (utils) {
  'use strict';

  function nonNegative(value) {
    return Math.max(0, utils.parseNumber(value, 0));
  }

  function calculate(data) {
    var source = data || {};
    var revenue = nonNegative(source.revenue);
    var cogs = nonNegative(source.cogs);
    var operating = nonNegative(source.operating);
    var marketing = nonNegative(source.marketing);
    var other = nonNegative(source.other);
    var taxRate = Math.min(Math.max(utils.parseNumber(source.taxRate, 0), 0), 100);

    var grossProfit = utils.round2(revenue - cogs);
    var fixedExpenses = utils.round2(operating + marketing + other);
    var totalExpenses = utils.round2(cogs + fixedExpenses);
    var netBeforeTax = utils.round2(revenue - totalExpenses);
    var taxAmount = netBeforeTax > 0 ? utils.round2(netBeforeTax * (taxRate / 100)) : 0;
    var netAfterTax = utils.round2(netBeforeTax - taxAmount);

    var grossMargin = revenue > 0 ? grossProfit / revenue : 0;
    var netMargin = revenue > 0 ? netBeforeTax / revenue : 0;
    var afterTaxMargin = revenue > 0 ? netAfterTax / revenue : 0;
    var breakEvenRevenue =
      grossMargin > 0 ? utils.round2(fixedExpenses / grossMargin) : null;

    return {
      currency: utils.normalizeCurrency(source.currency),
      revenue: revenue,
      cogs: cogs,
      operating: operating,
      marketing: marketing,
      other: other,
      taxRate: taxRate,
      grossProfit: grossProfit,
      grossMargin: grossMargin,
      fixedExpenses: fixedExpenses,
      totalExpenses: totalExpenses,
      netBeforeTax: netBeforeTax,
      netMargin: netMargin,
      taxAmount: taxAmount,
      netAfterTax: netAfterTax,
      afterTaxMargin: afterTaxMargin,
      breakEvenRevenue: breakEvenRevenue,
      breakEvenGap: breakEvenRevenue === null ? null : utils.round2(revenue - breakEvenRevenue)
    };
  }

  function validate(data) {
    var source = data || {};
    var errors = {};
    var numericFields = [
      { key: 'revenue', label: 'Revenue' },
      { key: 'cogs', label: 'Cost of goods sold' },
      { key: 'operating', label: 'Operating expenses' },
      { key: 'marketing', label: 'Marketing expenses' },
      { key: 'other', label: 'Other expenses' }
    ];

    if (utils.isBlank(source.revenue)) {
      errors.revenue = 'Enter your revenue.';
    }

    numericFields.forEach(function (field) {
      var value = utils.parseNumber(source[field.key], 0);

      if (value < 0) {
        errors[field.key] = field.label + ' cannot be negative.';
      }
    });

    var taxRate = utils.parseNumber(source.taxRate, 0);

    if (taxRate < 0 || taxRate > 100) {
      errors.taxRate = 'Tax rate must be between 0 and 100.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      totals: calculate(source)
    };
  }

  return {
    calculate: calculate,
    validate: validate
  };
});
