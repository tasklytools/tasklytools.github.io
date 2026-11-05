(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RobotsLogic = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var CONTROL_RE = /[\u0000-\u001f\u007f]/;
  var KNOWN_EXTENSIONS = {
    host: "Host is a Yandex-specific extension and is ignored by most other crawlers.",
    "clean-param": "Clean-param is a Yandex-specific extension and is ignored by most other crawlers.",
    "request-rate": "Request-rate is not part of the widely supported robots.txt standard.",
    "visit-time": "Visit-time is not part of the widely supported robots.txt standard."
  };

  var AI_CRAWLERS = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "Google-Extended",
    "ClaudeBot",
    "anthropic-ai",
    "CCBot",
    "PerplexityBot",
    "Bytespider",
    "Amazonbot",
    "Applebot-Extended",
    "meta-externalagent",
    "cohere-ai",
    "YouBot"
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function makeGroup(userAgent, rules) {
    return {
      userAgent: userAgent,
      rules: rules || [],
      crawlDelay: ""
    };
  }

  function blockAiGroups() {
    var groups = [makeGroup("*", [{ directive: "Allow", path: "/" }])];
    for (var i = 0; i < AI_CRAWLERS.length; i += 1) {
      groups.push(makeGroup(AI_CRAWLERS[i], [{ directive: "Disallow", path: "/" }]));
    }
    return groups;
  }

  var PRESETS = {
    "allow-all": {
      id: "allow-all",
      name: "Allow all crawlers",
      description: "Allow every crawler to access the whole site.",
      groups: [makeGroup("*", [{ directive: "Allow", path: "/" }])]
    },
    "block-all": {
      id: "block-all",
      name: "Block all crawlers",
      description: "Block every crawler, useful for staging or private sites.",
      groups: [makeGroup("*", [{ directive: "Disallow", path: "/" }])]
    },
    "block-ai": {
      id: "block-ai",
      name: "Allow search, block AI crawlers",
      description: "Keep search engines welcome while blocking a list of common AI crawlers.",
      groups: blockAiGroups()
    }
  };

  function createPreset(id) {
    var preset = PRESETS[id];
    if (!preset) return null;
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      groups: clone(preset.groups)
    };
  }

  function validateSitemapUrl(raw) {
    var value = String(raw == null ? "" : raw).trim();

    if (!value) {
      return { error: "Sitemap URL is empty." };
    }

    if (CONTROL_RE.test(value) || /\s/.test(value)) {
      return { error: "Sitemap URLs cannot contain spaces or control characters." };
    }

    if (!/^https?:\/\//i.test(value)) {
      return { error: "Sitemap URLs must start with http:// or https://." };
    }

    var url;
    try {
      url = new URL(value);
    } catch (error) {
      return { error: "The sitemap URL is not valid." };
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { error: "Only http and https sitemap URLs are supported." };
    }

    if (!url.hostname) {
      return { error: "The sitemap URL needs a hostname." };
    }

    if (url.username || url.password) {
      return { error: "Sitemap URLs cannot include a username or password." };
    }

    if (url.hash) {
      return { error: "Sitemap URLs cannot include a fragment (#)." };
    }

    return { value: value };
  }

  function validateRulePath(raw, directive) {
    var value = String(raw == null ? "" : raw).trim();

    if (!value) {
      if (directive === "Allow") {
        return { error: "An Allow rule needs a path. Remove the row or enter a path such as /." };
      }
      return { value: "" };
    }

    if (value.charAt(0) !== "/") {
      return { error: "Rule paths must start with /." };
    }

    if (CONTROL_RE.test(value) || /\s/.test(value)) {
      return { error: "Rule paths cannot contain spaces or control characters. Percent-encode special characters." };
    }

    if (value.indexOf("#") !== -1) {
      return { error: "Rule paths cannot contain #. Percent-encode it as %23." };
    }

    return { value: value };
  }

  function validateUserAgent(raw) {
    var value = String(raw == null ? "" : raw).trim();

    if (!value) {
      return { error: "Enter a user-agent name, or use * for all crawlers." };
    }

    if (CONTROL_RE.test(value) || /\s/.test(value)) {
      return { error: "User-agent names cannot contain spaces or control characters." };
    }

    if (value.length > 150) {
      return { error: "The user-agent name is too long." };
    }

    if (value !== "*" && value.indexOf("*") !== -1) {
      return { error: "Use * by itself for all crawlers. Wildcards are not supported in user-agent names." };
    }

    return { value: value };
  }

  function validateCrawlDelay(raw) {
    var value = String(raw == null ? "" : raw).trim();

    if (!value) return { value: "" };

    if (!/^\d+(\.\d+)?$/.test(value) || Number(value) <= 0) {
      return { error: "Crawl-delay must be a positive number." };
    }

    return { value: value };
  }

  function generate(config) {
    var cfg = config || {};
    var errors = [];
    var warnings = [];
    var blocks = [];
    var ruleCount = 0;
    var groupCount = 0;
    var groups = Array.isArray(cfg.groups) ? cfg.groups : [];
    var sitemaps = Array.isArray(cfg.sitemaps)
      ? cfg.sitemaps
      : cfg.sitemapUrl
        ? [cfg.sitemapUrl]
        : [];
    var seenAgents = Object.create(null);
    var hasCrawlDelay = false;
    var hasBlockAll = false;

    for (var i = 0; i < groups.length; i += 1) {
      var group = groups[i] || {};
      var agentResult = validateUserAgent(group.userAgent);
      var groupLabel = "Group " + (i + 1);

      if (agentResult.error) {
        errors.push(groupLabel + ": " + agentResult.error);
        continue;
      }

      var agent = agentResult.value;
      if (seenAgents[agent.toLowerCase()]) {
        warnings.push(
          groupLabel + ': User-agent "' + agent + '" appears more than once. Some crawlers combine duplicate groups, while others use only one.'
        );
      } else {
        seenAgents[agent.toLowerCase()] = true;
      }

      var groupLines = ["User-agent: " + agent];
      var rules = Array.isArray(group.rules) ? group.rules : [];
      var seenRules = Object.create(null);
      var validRules = [];
      var hasAllowAll = false;
      var groupBlocksAll = false;

      for (var r = 0; r < rules.length; r += 1) {
        var rule = rules[r] || {};
        var directive = rule.directive === "Allow" ? "Allow" : "Disallow";
        var pathResult = validateRulePath(rule.path, directive);

        if (pathResult.error) {
          errors.push(groupLabel + ", rule " + (r + 1) + ": " + pathResult.error);
          continue;
        }

        var key = directive.toLowerCase() + ":" + pathResult.value;
        if (seenRules[key]) {
          warnings.push(groupLabel + ": Duplicate " + directive + " rule for \"" + (pathResult.value || "/") + "\" was skipped.");
          continue;
        }
        seenRules[key] = true;

        validRules.push({ directive: directive, path: pathResult.value });

        if (directive === "Disallow" && pathResult.value === "/") {
          groupBlocksAll = true;
          if (agent === "*") {
            hasBlockAll = true;
          }
        }

        if (directive === "Allow" && pathResult.value === "/") {
          hasAllowAll = true;
        }
      }

      if (hasAllowAll && groupBlocksAll) {
        warnings.push(groupLabel + ' contains both "Allow: /" and "Disallow: /". The effect is ambiguous, so use only the rule you intend.');
      }

      for (var v = 0; v < validRules.length; v += 1) {
        groupLines.push(validRules[v].directive + ": " + validRules[v].path);
      }
      ruleCount += validRules.length;

      var delayResult = validateCrawlDelay(group.crawlDelay);
      if (delayResult.error) {
        errors.push(groupLabel + ": " + delayResult.error);
      } else if (delayResult.value) {
        groupLines.push("Crawl-delay: " + delayResult.value);
        hasCrawlDelay = true;
      }

      if (validRules.length === 0 && !delayResult.value) {
        warnings.push(groupLabel + ' has no rules, so "' + agent + '" is allowed by default.');
      }

      blocks.push(groupLines.join("\n"));
      groupCount += 1;
    }

    var sitemapLines = [];
    var seenSitemaps = Object.create(null);

    for (var s = 0; s < sitemaps.length; s += 1) {
      var sitemapResult = validateSitemapUrl(sitemaps[s]);

      if (sitemapResult.error) {
        errors.push("Sitemap " + (s + 1) + ": " + sitemapResult.error);
        continue;
      }

      var sitemapKey = sitemapResult.value.toLowerCase();
      if (seenSitemaps[sitemapKey]) {
        warnings.push('Sitemap "' + sitemapResult.value + '" is listed more than once.');
        continue;
      }
      seenSitemaps[sitemapKey] = true;
      sitemapLines.push("Sitemap: " + sitemapResult.value);
    }

    if (sitemapLines.length) {
      blocks.push(sitemapLines.join("\n"));
    }

    if (!blocks.length) {
      warnings.push("Add at least one user-agent group or sitemap URL to generate a robots.txt file.");
    }

    if (sitemapLines.length && !groupCount) {
      warnings.push("A sitemap is listed, but there are no User-agent groups. A sitemap does not control crawling.");
    }

    if (sitemapLines.length && hasBlockAll) {
      warnings.push("A Sitemap line is included, but a wildcard group blocks all crawling. Search engines may not crawl the sitemap.");
    }

    if (hasCrawlDelay) {
      warnings.push("Crawl-delay is not supported by Google. Use it only for crawlers that honor it.");
    }

    var code = "";
    if (blocks.length) {
      code = "# robots.txt generated with Taskly Tools\n\n" + blocks.join("\n\n") + "\n";
    }

    return {
      code: code,
      errors: errors,
      warnings: warnings,
      ruleCount: ruleCount,
      groupCount: groupCount
    };
  }

  function addIssue(issues, line, severity, message) {
    issues.push({ line: line, severity: severity, message: message });
  }

  function parse(text) {
    var source = String(text == null ? "" : text)
      .replace(/^\uFEFF/, "")
      .replace(/\r\n?/g, "\n");
    var lines = source.split("\n");
    var issues = [];
    var groups = [];
    var sitemaps = [];
    var current = null;
    var hasContent = false;
    var seenSitemaps = Object.create(null);
    var delayWarned = false;

    function finalizeGroup() {
      if (current) {
        groups.push(current);
        current = null;
      }
    }

    function ensureGroup(lineNumber) {
      if (current) return current;
      addIssue(issues, lineNumber, "error", "A rule appears before any User-agent line. Add a User-agent group first.");
      current = {
        userAgents: ["*"],
        rules: [],
        crawlDelay: null,
        line: lineNumber,
        implicit: true
      };
      return current;
    }

    for (var i = 0; i < lines.length; i += 1) {
      var lineNumber = i + 1;
      var rawLine = lines[i];
      var commentIndex = rawLine.indexOf("#");
      var content = (commentIndex === -1 ? rawLine : rawLine.slice(0, commentIndex)).trim();

      if (!content) {
        finalizeGroup();
        continue;
      }

      hasContent = true;
      var colonIndex = content.indexOf(":");
      if (colonIndex === -1) {
        addIssue(issues, lineNumber, "error", "Missing colon. Expected a directive such as User-agent:, Allow:, or Disallow:.");
        continue;
      }

      var field = content.slice(0, colonIndex).trim().toLowerCase();
      var value = content.slice(colonIndex + 1).trim();

      if (field === "user-agent" || field === "useragent") {
        if (field === "useragent") {
          addIssue(issues, lineNumber, "warning", 'The standard spelling is "User-agent". Most crawlers accept both, but use the standard spelling.');
        }

        var agentResult = validateUserAgent(value);
        if (agentResult.error) {
          addIssue(issues, lineNumber, "error", agentResult.error);
        }

        if (current && (current.rules.length > 0 || current.crawlDelay !== null)) {
          finalizeGroup();
        }

        if (!current) {
          current = {
            userAgents: [],
            rules: [],
            crawlDelay: null,
            line: lineNumber,
            implicit: false
          };
        }

        if (!agentResult.error) {
          current.userAgents.push(agentResult.value);
        }
        continue;
      }

      if (field === "allow" || field === "disallow") {
        var group = ensureGroup(lineNumber);
        var directive = field === "allow" ? "Allow" : "Disallow";
        var pathResult = validateRulePath(value, directive);

        if (pathResult.error) {
          if (!value && directive === "Allow") {
            addIssue(issues, lineNumber, "warning", "An empty Allow rule has no effect.");
          } else {
            addIssue(issues, lineNumber, "error", pathResult.error);
          }
        }

        var pathValue = pathResult.error ? value : pathResult.value;
        var duplicate = group.rules.some(function (rule) {
          return rule.directive === directive && rule.path === pathValue;
        });

        if (duplicate) {
          addIssue(issues, lineNumber, "warning", "This " + directive + " rule duplicates an earlier rule in the same group.");
        }

        group.rules.push({
          directive: directive,
          path: pathValue,
          line: lineNumber
        });
        continue;
      }

      if (field === "crawl-delay") {
        var delayGroup = ensureGroup(lineNumber);
        var delayResult = validateCrawlDelay(value);

        if (delayResult.error) {
          addIssue(issues, lineNumber, "error", delayResult.error);
        } else if (delayGroup.crawlDelay !== null) {
          addIssue(issues, lineNumber, "warning", "This group has more than one Crawl-delay directive.");
        } else {
          delayGroup.crawlDelay = delayResult.value;
        }

        if (!delayWarned) {
          addIssue(issues, lineNumber, "warning", "Crawl-delay is not supported by Google. Use it only for crawlers that honor it.");
          delayWarned = true;
        }
        continue;
      }

      if (field === "sitemap") {
        var sitemapResult = validateSitemapUrl(value);
        if (sitemapResult.error) {
          addIssue(issues, lineNumber, "error", sitemapResult.error);
        } else {
          var sitemapKey = sitemapResult.value.toLowerCase();
          if (seenSitemaps[sitemapKey]) {
            addIssue(issues, lineNumber, "warning", "This sitemap URL is listed more than once.");
          }
          seenSitemaps[sitemapKey] = true;
          sitemaps.push({ url: sitemapResult.value, line: lineNumber });
        }
        continue;
      }

      if (field === "noindex") {
        addIssue(issues, lineNumber, "warning", "Noindex is not a supported robots.txt directive. Use an X-Robots-Tag header or a meta robots tag instead.");
        continue;
      }

      if (field === "change-frequency" || field === "priority" || field === "lastmod") {
        addIssue(issues, lineNumber, "warning", "This is a sitemap directive, not a robots.txt directive.");
        continue;
      }

      if (KNOWN_EXTENSIONS[field]) {
        addIssue(issues, lineNumber, "warning", KNOWN_EXTENSIONS[field]);
        continue;
      }

      addIssue(issues, lineNumber, "warning", 'Unknown directive "' + field + '". Most crawlers ignore it.');
    }

    finalizeGroup();

    if (!hasContent) {
      addIssue(issues, 1, "warning", "The file is empty, so every crawler is allowed by default.");
    }

    var seenAgents = Object.create(null);

    for (var g = 0; g < groups.length; g += 1) {
      var group = groups[g];
      var agents = group.userAgents.length ? group.userAgents : ["*"];

      for (var a = 0; a < agents.length; a += 1) {
        var agentKey = agents[a].toLowerCase();
        if (seenAgents[agentKey]) {
          addIssue(
            issues,
            group.line,
            "warning",
            'User-agent "' + agents[a] + '" appears in more than one group. Some crawlers combine these groups, while others use only one.'
          );
        } else {
          seenAgents[agentKey] = true;
        }
      }

      var hasAllowAll = group.rules.some(function (rule) {
        return rule.directive === "Allow" && rule.path === "/";
      });
      var hasBlockAll = group.rules.some(function (rule) {
        return rule.directive === "Disallow" && rule.path === "/";
      });

      if (hasAllowAll && hasBlockAll) {
        addIssue(
          issues,
          group.line,
          "warning",
          'This group contains both "Allow: /" and "Disallow: /". The outcome can be unclear, so use only the rule you intend.'
        );
      }

      if (hasBlockAll && agents.indexOf("*") !== -1 && sitemaps.length) {
        addIssue(
          issues,
          group.line,
          "warning",
          "This wildcard group blocks all crawling, but the file also lists a sitemap. Search engines may not crawl the sitemap."
        );
      }
    }

    if (!groups.length && sitemaps.length) {
      addIssue(issues, sitemaps[0].line, "warning", "No User-agent groups were found. Sitemaps do not control crawling.");
    }

    issues.sort(function (a, b) {
      if (a.line !== b.line) return a.line - b.line;
      if (a.severity === b.severity) return 0;
      return a.severity === "error" ? -1 : 1;
    });

    var errorCount = issues.filter(function (issue) {
      return issue.severity === "error";
    }).length;
    var warningCount = issues.filter(function (issue) {
      return issue.severity === "warning";
    }).length;
    var ruleCount = groups.reduce(function (total, group) {
      return total + group.rules.length;
    }, 0);

    return {
      issues: issues,
      groups: groups,
      sitemaps: sitemaps,
      stats: {
        errors: errorCount,
        warnings: warningCount,
        groups: groups.length,
        rules: ruleCount,
        sitemaps: sitemaps.length,
        lines: lines.length
      },
      valid: errorCount === 0
    };
  }

  function validate(text) {
    return parse(text);
  }

  return {
    AI_CRAWLERS: AI_CRAWLERS.slice(),
    PRESETS: PRESETS,
    createPreset: createPreset,
    validateSitemapUrl: validateSitemapUrl,
    validateRulePath: validateRulePath,
    validateUserAgent: validateUserAgent,
    generate: generate,
    parse: parse,
    validate: validate
  };
});
