(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TasklyToolUtils = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var DEFAULT_CURRENCY = 'USD';
  var DEFAULT_LOCALE = 'en-US';

  function parseNumber(value, fallback) {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : typeof fallback === 'number' ? fallback : 0;
    }

    if (value === null || value === undefined) {
      return typeof fallback === 'number' ? fallback : 0;
    }

    var text = String(value).trim();

    if (!text) {
      return typeof fallback === 'number' ? fallback : 0;
    }

    var negative = false;

    if (/^\(.*\)$/.test(text)) {
      negative = true;
      text = text.slice(1, -1);
    }

    text = text.replace(/[^0-9.,\-+]/g, '').replace(/,/g, '');

    if (!text || !/[0-9]/.test(text)) {
      return typeof fallback === 'number' ? fallback : 0;
    }

    var parsed = Number(text);

    if (!Number.isFinite(parsed)) {
      return typeof fallback === 'number' ? fallback : 0;
    }

    return negative ? -Math.abs(parsed) : parsed;
  }

  function roundTo(value, decimals) {
    var places = typeof decimals === 'number' ? decimals : 2;
    var factor = Math.pow(10, Math.max(0, places));
    return Math.round((parseNumber(value, 0) + Number.EPSILON) * factor) / factor;
  }

  function round2(value) {
    return roundTo(value, 2);
  }

  function clamp(value, minimum, maximum) {
    var number = parseNumber(value, 0);
    var min = parseNumber(minimum, 0);
    var max = parseNumber(maximum, 0);

    if (min > max) {
      return min;
    }

    return Math.min(Math.max(number, min), max);
  }

  function normalizeCurrency(currency) {
    var code = String(currency || DEFAULT_CURRENCY).trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(code)) {
      return DEFAULT_CURRENCY;
    }

    try {
      new Intl.NumberFormat(DEFAULT_LOCALE, { style: 'currency', currency: code }).format(0);
      return code;
    } catch (error) {
      return DEFAULT_CURRENCY;
    }
  }

  function numberFormatter(currency, options) {
    var settings = {
      style: 'currency',
      currency: normalizeCurrency(currency),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };

    if (options) {
      Object.keys(options).forEach(function (key) {
        settings[key] = options[key];
      });
    }

    try {
      return new Intl.NumberFormat(DEFAULT_LOCALE, settings);
    } catch (error) {
      return null;
    }
  }

  function formatCurrency(value, currency) {
    var amount = round2(value);
    var formatter = numberFormatter(currency);

    if (formatter) {
      return formatter.format(amount);
    }

    return '$' + amount.toFixed(2);
  }

  function currencySymbol(currency) {
    var code = normalizeCurrency(currency);

    try {
      var parts = new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: 'currency',
        currency: code
      }).formatToParts(0);

      for (var index = 0; index < parts.length; index += 1) {
        if (parts[index].type === 'currency') {
          return parts[index].value;
        }
      }
    } catch (error) {
      return '$';
    }

    return code === 'USD' ? '$' : code;
  }

  function formatNumber(value, decimals) {
    var places = typeof decimals === 'number' ? Math.max(0, decimals) : 2;
    var amount = roundTo(value, places);

    try {
      return new Intl.NumberFormat(DEFAULT_LOCALE, {
        minimumFractionDigits: places,
        maximumFractionDigits: places
      }).format(amount);
    } catch (error) {
      return amount.toFixed(places);
    }
  }

  function formatPercent(value, decimals) {
    var places = typeof decimals === 'number' ? Math.max(0, decimals) : 1;
    return formatNumber(parseNumber(value, 0) * 100, places) + '%';
  }

  function formatDate(value, locale) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));

    if (!match) {
      return String(value || '');
    }

    var date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

    if (Number.isNaN(date.getTime())) {
      return String(value || '');
    }

    try {
      return new Intl.DateTimeFormat(locale || DEFAULT_LOCALE, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return date.toDateString();
    }
  }

  function todayISO() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var day = String(now.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function addDaysISO(value, days) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    var date = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      : new Date();

    if (Number.isNaN(date.getTime())) {
      date = new Date();
    }

    date.setDate(date.getDate() + parseNumber(days, 0));

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function truncate(value, length) {
    var text = String(value === null || value === undefined ? '' : value);
    var limit = Math.max(0, parseNumber(length, 0));

    if (text.length <= limit) {
      return text;
    }

    return text.slice(0, limit).replace(/\s+$/, '') + '…';
  }

  function debounce(fn, wait) {
    var timer = null;

    return function debounced() {
      var context = this;
      var args = arguments;

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(function () {
        timer = null;
        fn.apply(context, args);
      }, Math.max(0, parseNumber(wait, 0)));
    };
  }

  function setText(id, value) {
    if (typeof document === 'undefined') {
      return null;
    }

    var element = document.getElementById(id);

    if (element) {
      element.textContent = value === null || value === undefined ? '' : String(value);
    }

    return element;
  }

  function setFieldError(id, message) {
    if (typeof document === 'undefined') {
      return;
    }

    var field = document.getElementById(id);
    var error = document.getElementById(id + '-error');

    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.classList.add('tt-input-error');
    }

    if (error) {
      error.textContent = message || 'Please check this field.';
      error.hidden = false;
    }
  }

  function clearFieldError(id) {
    if (typeof document === 'undefined') {
      return;
    }

    var field = document.getElementById(id);
    var error = document.getElementById(id + '-error');

    if (field) {
      field.removeAttribute('aria-invalid');
      field.classList.remove('tt-input-error');
    }

    if (error) {
      error.textContent = '';
      error.hidden = true;
    }
  }

  function clearFieldErrors(ids) {
    (ids || []).forEach(clearFieldError);
  }

  function isBlank(value) {
    return String(value === null || value === undefined ? '' : value).trim() === '';
  }

  return {
    DEFAULT_CURRENCY: DEFAULT_CURRENCY,
    DEFAULT_LOCALE: DEFAULT_LOCALE,
    parseNumber: parseNumber,
    roundTo: roundTo,
    round2: round2,
    clamp: clamp,
    normalizeCurrency: normalizeCurrency,
    formatCurrency: formatCurrency,
    currencySymbol: currencySymbol,
    formatNumber: formatNumber,
    formatPercent: formatPercent,
    formatDate: formatDate,
    todayISO: todayISO,
    addDaysISO: addDaysISO,
    escapeHtml: escapeHtml,
    truncate: truncate,
    debounce: debounce,
    setText: setText,
    setFieldError: setFieldError,
    clearFieldError: clearFieldError,
    clearFieldErrors: clearFieldErrors,
    isBlank: isBlank
  };
});
