(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./tool-utils.js'));
  } else {
    root.TasklyProposal = factory(root.TasklyToolUtils);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (utils) {
  'use strict';

  function text(value) {
    return String(value === null || value === undefined ? '' : value).trim();
  }

  function validOptionalEmail(value) {
    var email = text(value);
    return !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function lines(value) {
    return String(value === null || value === undefined ? '' : value)
      .split(/\r?\n/)
      .map(function (line) {
        return line.trim();
      })
      .filter(Boolean);
  }

  function buildProposal(data) {
    var source = data || {};
    var investmentText = text(source.investment);
    var investment =
      investmentText === '' ? null : Math.max(0, utils.parseNumber(investmentText, 0));

    return {
      title: text(source.projectTitle),
      businessName: text(source.businessName),
      businessEmail: text(source.businessEmail),
      clientName: text(source.clientName),
      clientEmail: text(source.clientEmail),
      preparedDate: text(source.preparedDate),
      validUntil: text(source.validUntil),
      currency: utils.normalizeCurrency(source.currency),
      overview: text(source.overview),
      scope: text(source.scope),
      deliverables: lines(source.deliverables),
      timeline: lines(source.timeline),
      investment: investment,
      paymentTerms: text(source.paymentTerms),
      nextSteps: lines(source.nextSteps)
    };
  }

  function proposalToText(proposal) {
    var model = proposal || {};
    var output = [];
    var title = text(model.title) || 'Project proposal';

    output.push(title.toUpperCase());
    output.push('');

    if (text(model.clientName)) {
      output.push(
        'Prepared for: ' + text(model.clientName) +
          (text(model.clientEmail) ? ' (' + text(model.clientEmail) + ')' : '')
      );
    }

    if (text(model.businessName)) {
      output.push(
        'Prepared by: ' + text(model.businessName) +
          (text(model.businessEmail) ? ' (' + text(model.businessEmail) + ')' : '')
      );
    }

    if (text(model.preparedDate)) {
      output.push('Date: ' + utils.formatDate(model.preparedDate));
    }

    if (text(model.validUntil)) {
      output.push('Valid until: ' + utils.formatDate(model.validUntil));
    }

    output.push('');

    if (text(model.overview)) {
      output.push('OVERVIEW', '', text(model.overview), '');
    }

    if (text(model.scope)) {
      output.push('SCOPE', '', text(model.scope), '');
    }

    if (model.deliverables && model.deliverables.length) {
      output.push('DELIVERABLES', '');
      model.deliverables.forEach(function (item) {
        output.push('- ' + item);
      });
      output.push('');
    }

    if (model.timeline && model.timeline.length) {
      output.push('TIMELINE', '');
      model.timeline.forEach(function (item) {
        output.push('- ' + item);
      });
      output.push('');
    }

    if (model.investment !== null && model.investment !== undefined) {
      output.push(
        'INVESTMENT',
        '',
        utils.formatCurrency(model.investment, model.currency)
      );

      if (text(model.paymentTerms)) {
        output.push('', text(model.paymentTerms));
      }

      output.push('');
    }

    if (model.nextSteps && model.nextSteps.length) {
      output.push('NEXT STEPS', '');
      model.nextSteps.forEach(function (item) {
        output.push('- ' + item);
      });
      output.push('');
    }

    return output.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function validate(data) {
    var source = data || {};
    var errors = {};
    var preparedDate = text(source.preparedDate);
    var validUntil = text(source.validUntil);
    var investmentText = text(source.investment);

    if (!text(source.projectTitle)) {
      errors.projectTitle = 'Enter a project title.';
    }

    if (!text(source.businessName)) {
      errors.businessName = 'Enter your business or name.';
    }

    if (!text(source.clientName)) {
      errors.clientName = 'Enter the client name.';
    }

    if (!validOptionalEmail(source.businessEmail)) {
      errors.businessEmail = 'Enter a valid email address or leave this field blank.';
    }

    if (!validOptionalEmail(source.clientEmail)) {
      errors.clientEmail = 'Enter a valid email address or leave this field blank.';
    }

    if (!preparedDate) {
      errors.preparedDate = 'Choose a prepared date.';
    }

    if (validUntil && preparedDate && validUntil < preparedDate) {
      errors.validUntil = 'The valid-until date cannot be before the prepared date.';
    }

    if (!text(source.overview)) {
      errors.overview = 'Write a short project overview.';
    }

    if (!text(source.scope)) {
      errors.scope = 'Describe the scope of work.';
    }

    if (!lines(source.deliverables).length) {
      errors.deliverables = 'Add at least one deliverable.';
    }

    if (!lines(source.timeline).length) {
      errors.timeline = 'Add at least one timeline item.';
    }

    if (!investmentText) {
      errors.investment = 'Enter the investment amount.';
    } else if (utils.parseNumber(investmentText, 0) < 0) {
      errors.investment = 'The investment cannot be negative.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
      proposal: buildProposal(source)
    };
  }

  return {
    buildProposal: buildProposal,
    proposalToText: proposalToText,
    validate: validate
  };
});
