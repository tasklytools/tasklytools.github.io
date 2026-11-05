/* Pure UTM URL logic. No DOM access. Browser + Node compatible. */
(function (root) {
  "use strict";

  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

  function normalizeUrl(value) {
    var raw = String(value == null ? "" : value).trim();
    if (!raw) return "";
    if (/^\/\//.test(raw)) return "https:" + raw;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) return "https://" + raw;
    return raw;
  }

  function parseHttpUrl(value) {
    var candidate = normalizeUrl(value);
    if (!candidate) {
      return { ok: false, error: "Enter the website URL you want to track." };
    }

    var parsed;
    try {
      parsed = new URL(candidate);
    } catch (error) {
      return { ok: false, error: "Enter a valid URL, for example https://example.com/page." };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { ok: false, error: "Use an http:// or https:// website address." };
    }

    if (!parsed.hostname) {
      return { ok: false, error: "The URL needs a valid domain name." };
    }

    return { ok: true, url: parsed };
  }

  function buildUtmUrl(values) {
    var input = values || {};
    var errors = {};

    var parsedResult = parseHttpUrl(input.url);
    if (!parsedResult.ok) {
      errors.url = parsedResult.error;
    }

    var source = String(input.source == null ? "" : input.source).trim();
    var medium = String(input.medium == null ? "" : input.medium).trim();
    var campaign = String(input.campaign == null ? "" : input.campaign).trim();
    var term = String(input.term == null ? "" : input.term).trim();
    var content = String(input.content == null ? "" : input.content).trim();

    if (!source) errors.source = "Campaign source is required.";
    if (!medium) errors.medium = "Campaign medium is required.";
    if (!campaign) errors.campaign = "Campaign name is required.";

    if (!parsedResult.ok) {
      return { ok: false, url: "", errors: errors };
    }

    if (Object.keys(errors).length) {
      return { ok: false, url: "", errors: errors };
    }

    var parsed = parsedResult.url;
    UTM_KEYS.forEach(function (key) {
      parsed.searchParams.delete(key);
    });

    parsed.searchParams.set("utm_source", source);
    parsed.searchParams.set("utm_medium", medium);
    parsed.searchParams.set("utm_campaign", campaign);
    if (term) parsed.searchParams.set("utm_term", term);
    if (content) parsed.searchParams.set("utm_content", content);

    var base = parsed.origin + parsed.pathname;
    var query = parsed.searchParams.toString().replace(/\+/g, "%20");
    var finalUrl = base + (query ? "?" + query : "") + parsed.hash;

    return { ok: true, url: finalUrl, errors: errors };
  }

  function exampleValues() {
    return {
      url: "https://example.com/spring-sale",
      source: "newsletter",
      medium: "email",
      campaign: "spring_launch",
      term: "discount",
      content: "hero_button"
    };
  }

  root.TasklyUtm = {
    buildUtmUrl: buildUtmUrl,
    normalizeUrl: normalizeUrl,
    exampleValues: exampleValues,
    UTM_KEYS: UTM_KEYS
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = root.TasklyUtm;
  }
})(typeof window !== "undefined" ? window : globalThis);
