(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./tool-utils.js'));
  } else {
    root.TasklyInvoice = factory(root.TasklyToolUtils);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (utils) {
  'use strict';

  function validOptionalEmail(value) {
    var email = String(value === null || value === undefined ? '' : value).trim();
    return !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function toItems(items) {
    return (Array.isArray(items) ? items : [])
      .map(function (item, index) {
        var source = item || {};
        var description = String(source.description || '').trim();
        var quantity = Math.max(0, utils.parseNumber(source.quantity, 0));
        var unitPrice = Math.max(0, utils.parseNumber(source.unitPrice, 0));
        var amount = utils.round2(quantity * unitPrice);

        return {
          description: description,
          quantity: quantity,
          unitPrice: unitPrice,
          amount: amount,
          rowIndex: index,
          active: !utils.isBlank(description) || quantity > 0 || unitPrice > 0
        };
      })
      .filter(function (item) {
        return item.active;
      });
  }

  function calculate(data) {
    var source = data || {};
    var items = toItems(source.items);
    var subtotal = utils.round2(
      items.reduce(function (sum, item) {
        return sum + item.amount;
      }, 0)
    );

    var discountType = source.discountType === 'fixed' ? 'fixed' : 'percent';
    var rawDiscount = Math.max(0, utils.parseNumber(source.discountValue, 0));
    var discountAmount = 0;

    if (discountType === 'percent') {
      discountAmount = utils.round2(subtotal * (Math.min(rawDiscount, 100) / 100));
    } else {
      discountAmount = utils.round2(Math.min(rawDiscount, subtotal));
    }

    var taxableAmount = utils.round2(Math.max(0, subtotal - discountAmount));
    var taxRate = Math.min(Math.max(utils.parseNumber(source.taxRate, 0), 0), 100);
    var taxAmount = utils.round2(taxableAmount * (taxRate / 100));
    var total = utils.round2(taxableAmount + taxAmount);

    return {
      currency: utils.normalizeCurrency(source.currency),
      items: items,
      itemCount: items.length,
      totalQuantity: utils.round2(
        items.reduce(function (sum, item) {
          return sum + item.quantity;
        }, 0)
      ),
      subtotal: subtotal,
      discountType: discountType,
      discountValue: rawDiscount,
      discountAmount: discountAmount,
      taxableAmount: taxableAmount,
      taxRate: taxRate,
      taxAmount: taxAmount,
      total: total
    };
  }

  function validate(data) {
    var source = data || {};
    var errors = {};
    var items = toItems(source.items);
    var totals = calculate(source);
    var issueDate = String(source.issueDate || '').trim();
    var dueDate = String(source.dueDate || '').trim();
    var discountNumber = utils.parseNumber(source.discountValue, 0);
    var rawDiscount = Math.max(0, discountNumber);

    if (utils.isBlank(source.invoiceNumber)) {
      errors.invoiceNumber = 'Enter an invoice number.';
    }

    if (utils.isBlank(source.fromName)) {
      errors.fromName = 'Enter your business or name.';
    }

    if (utils.isBlank(source.clientName)) {
      errors.clientName = 'Enter your client or customer name.';
    }

    if (!validOptionalEmail(source.fromEmail)) {
      errors.fromEmail = 'Enter a valid email address or leave this field blank.';
    }

    if (!validOptionalEmail(source.clientEmail)) {
      errors.clientEmail = 'Enter a valid email address or leave this field blank.';
    }

    if (utils.isBlank(issueDate)) {
      errors.issueDate = 'Choose an issue date.';
    }

    if (utils.isBlank(dueDate)) {
      errors.dueDate = 'Choose a due date.';
    } else if (issueDate && dueDate < issueDate) {
      errors.dueDate = 'The due date cannot be before the issue date.';
    }

    if (!items.length) {
      errors.items = 'Add at least one line item with a description.';
    } else {
      items.forEach(function (item) {
        var rawItem = Array.isArray(source.items) ? source.items[item.rowIndex] || {} : {};
        var rawQuantity = utils.parseNumber(rawItem.quantity, 0);
        var rawUnitPrice = utils.parseNumber(rawItem.unitPrice, 0);

        if (utils.isBlank(item.description)) {
          errors['item-description-' + item.rowIndex] = 'Enter a description for this line.';
        }

        if (rawQuantity < 0) {
          errors['item-quantity-' + item.rowIndex] = 'Quantity cannot be negative.';
        } else if (item.quantity <= 0) {
          errors['item-quantity-' + item.rowIndex] = 'Quantity must be greater than 0.';
        }

        if (rawUnitPrice < 0) {
          errors['item-unitPrice-' + item.rowIndex] = 'Unit price cannot be negative.';
        }
      });
    }

    var taxRate = utils.parseNumber(source.taxRate, 0);

    if (taxRate < 0 || taxRate > 100) {
      errors.taxRate = 'Tax rate must be between 0 and 100.';
    }

    if (discountNumber < 0) {
      errors.discountValue = 'Discount cannot be negative.';
    } else if (source.discountType === 'percent' && rawDiscount > 100) {
      errors.discountValue = 'Percentage discount cannot be more than 100.';
    }

    if (source.discountType === 'fixed' && totals.subtotal > 0 && rawDiscount > totals.subtotal) {
      errors.discountValue = 'Discount cannot be more than the subtotal.';
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
