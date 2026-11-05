(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.HtaccessLogic = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var HOST_LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  var CONTROL_RE = /[\u0000-\u001f\u007f]/;

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizeHost(raw) {
    var host = String(raw == null ? "" : raw).trim().toLowerCase().replace(/\.+$/, "");

    if (!host) {
      return { error: "Enter a canonical hostname, for example www.example.com." };
    }

    if (/[:\/\\?#\s]/.test(host) || CONTROL_RE.test(host)) {
      return { error: "Enter only the hostname, without a protocol, port, path, or spaces." };
    }

    if (host.length > 253) {
      return { error: "The hostname is too long." };
    }

    if (host === "localhost") {
      return { value: host, labels: [host] };
    }

    var labels = host.split(".");
    if (labels.length < 2) {
      return { error: "Use a full hostname such as www.example.com or example.com." };
    }

    for (var i = 0; i < labels.length; i += 1) {
      if (!labels[i] || !HOST_LABEL_RE.test(labels[i])) {
        return { error: "The hostname contains an invalid label." };
      }
    }

    if (!/^[a-z]{2,63}$/i.test(labels[labels.length - 1]) && !/^xn--[a-z0-9-]+$/i.test(labels[labels.length - 1])) {
      return { error: "The hostname must end with a valid top-level domain, such as .com." };
    }

    return { value: host, labels: labels };
  }

  function validateSourcePath(raw) {
    var value = String(raw == null ? "" : raw).trim();

    if (!value) {
      return { error: "Enter a source path." };
    }

    if (value.charAt(0) !== "/") {
      return { error: 'Source paths must start with "/".' };
    }

    if (CONTROL_RE.test(value) || /\s/.test(value)) {
      return { error: "Source paths cannot contain spaces or control characters." };
    }

    if (/[?#\\]/.test(value)) {
      return { error: "Source paths cannot contain ?, #, or backslashes. Use the query-string option instead." };
    }

    if (/(^|\/)\.\.(\/|$)/.test(value) || /%2e%2e/i.test(value)) {
      return { error: "Source paths cannot contain parent-directory segments (..)." };
    }

    if (/\*\*/.test(value)) {
      return { error: "Use single * wildcards rather than **." };
    }

    var wildcardCount = (value.match(/\*/g) || []).length;
    if (wildcardCount > 9) {
      return { error: "Use no more than nine wildcards in a source path." };
    }

    return {
      value: value,
      normalized: value.replace(/\/+$/, "") || "/",
      wildcardCount: wildcardCount
    };
  }

  function validateDestination(raw, wildcardCount, canonicalHost) {
    var value = String(raw == null ? "" : raw).trim();

    if (!value) {
      return { error: "Enter a destination path or URL." };
    }

    if (CONTROL_RE.test(value) || /\s/.test(value)) {
      return { error: "Destinations cannot contain spaces or control characters." };
    }

    if (value.indexOf("\\") !== -1 || value.indexOf("#") !== -1) {
      return { error: "Destinations cannot contain backslashes or fragments (#)." };
    }

    if (/^(javascript|data|vbscript|file|ftp):/i.test(value)) {
      return { error: "Use an internal path or an http(s) URL. Script and data URLs are not allowed." };
    }

    if (value.indexOf("//") === 0) {
      return { error: "Protocol-relative destinations (starting with //) are not allowed." };
    }

    var references = value.match(/\$\d/g) || [];
    for (var i = 0; i < references.length; i += 1) {
      var index = Number(references[i].charAt(1));
      if (index === 0 || index > wildcardCount) {
        return { error: "Destination references $" + index + " but the source does not provide that capture." };
      }
    }

    if (value.charAt(0) === "/") {
      if (/(^|\/)\.\.(\/|$)/.test(value) || /%2e%2e/i.test(value)) {
        return { error: "Destinations cannot contain parent-directory segments (..)." };
      }

      return {
        value: value,
        type: "path",
        path: value.split("?")[0],
        host: canonicalHost || ""
      };
    }

    if (!/^https?:\/\//i.test(value)) {
      return { error: 'Use a path starting with "/" or an absolute http(s) URL.' };
    }

    var url;
    try {
      url = new URL(value);
    } catch (error) {
      return { error: "The destination URL is not valid." };
    }

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { error: "Only http and https destinations are supported." };
    }

    if (!url.hostname) {
      return { error: "The destination URL needs a hostname." };
    }

    if (url.username || url.password) {
      return { error: "Destinations cannot include a username or password." };
    }

    return {
      value: value,
      type: "url",
      path: url.pathname,
      host: url.hostname
    };
  }

  function buildSourcePattern(value) {
    var raw = value.replace(/\/+$/, "");
    if (raw === "") raw = "/";
    if (raw === "/") return "^$";

    var path = raw.charAt(0) === "/" ? raw.slice(1) : raw;

    if (path.indexOf("*") !== -1) {
      return "^" + path.split("*").map(escapeRegExp).join("(.*)") + "$";
    }

    return "^" + escapeRegExp(path) + "/?$";
  }

  function normalizeComparablePath(value) {
    return value.replace(/\/+$/, "") || "/";
  }

  function destinationReferencesAsPattern(path, wildcardCount) {
    var result = path;
    for (var i = 1; i <= wildcardCount; i += 1) {
      result = result.split("$" + i).join("*");
    }
    return result;
  }

  function createsLoop(source, destination, canonicalHost) {
    var sourcePattern = source.normalized;
    var destinationPath = normalizeComparablePath(destination.path);

    if (source.wildcardCount > 0) {
      var resolved = normalizeComparablePath(
        destinationReferencesAsPattern(destination.path, source.wildcardCount)
      );
      if (resolved === normalizeComparablePath(source.value)) {
        return true;
      }
    } else if (destinationPath === sourcePattern) {
      return true;
    }

    if (destination.type === "url" && canonicalHost) {
      var targetHost = destination.host.toLowerCase();
      if (targetHost === canonicalHost.toLowerCase() && destinationPath === sourcePattern) {
        return true;
      }
    }

    return false;
  }

  function isBroadWildcard(source) {
    return source.value === "/*" || source.value === "/*/";
  }

  function generate(config) {
    var cfg = config || {};
    var errors = [];
    var warnings = [];
    var sections = [];
    var ruleCount = 0;

    var forceHttps = Boolean(cfg.forceHttps);
    var canonicalMode = cfg.canonicalMode || "none";
    var canonicalStatus = Number(cfg.canonicalStatus) === 302 ? 302 : 301;
    var canonicalHost = "";
    var canonicalReady = canonicalMode === "none";

    if (canonicalMode !== "none") {
      var hostResult = normalizeHost(cfg.canonicalHost);

      if (hostResult.error) {
        errors.push(hostResult.error);
      } else {
        var hostValue = hostResult.value;

        if (canonicalMode === "add-www" && !/^www\./i.test(hostValue)) {
          errors.push('The "Add WWW" mode needs a canonical hostname that starts with www., for example www.example.com.');
        } else if (canonicalMode === "remove-www" && /^www\./i.test(hostValue)) {
          errors.push('The "Remove WWW" mode needs a canonical hostname without www., for example example.com.');
        } else {
          canonicalHost = hostValue;
          canonicalReady = true;
        }
      }
    }

    var hasCanonical = canonicalMode !== "none" && canonicalReady;

    if (hasCanonical || (forceHttps && !hasCanonical)) {
      var canonicalLines = [];

      if (!hasCanonical) {
        canonicalLines.push("# Force HTTPS");
        canonicalLines.push("# %{HTTPS} may not be reliable behind a reverse proxy or CDN.");
        canonicalLines.push("RewriteCond %{HTTPS} off");
        canonicalLines.push("RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=" + canonicalStatus + "]");
      } else {
        var hostPattern = escapeRegExp(canonicalHost);
        var hostCondition;

        if (canonicalMode === "add-www") {
          hostCondition = "!^" + hostPattern + "(:[0-9]+)?$";
        } else {
          hostCondition = "^www\\." + hostPattern + "(:[0-9]+)?$";
        }

        var scheme = forceHttps ? "https" : "%{REQUEST_SCHEME}";
        var target = scheme + "://" + canonicalHost;

        canonicalLines.push("# Canonical hostname" + (forceHttps ? " and HTTPS" : ""));
        canonicalLines.push("# Each hostname or scheme variant is redirected in a single step.");
        if (!forceHttps) {
          canonicalLines.push("# %{REQUEST_SCHEME} requires Apache 2.4+; enable Force HTTPS for an explicit scheme.");
        } else {
          canonicalLines.push("# If HTTPS is terminated by a proxy or CDN, %{HTTPS} may need adjusting for your host.");
        }
        if (forceHttps) {
          canonicalLines.push("RewriteCond %{HTTPS} off [OR]");
        }
        canonicalLines.push("RewriteCond %{HTTP_HOST} " + hostCondition + " [NC]");
        canonicalLines.push("RewriteRule ^ " + target + "%{REQUEST_URI} [L,R=" + canonicalStatus + "]");
      }

      sections.push(canonicalLines.join("\n"));
      ruleCount += 1;

      if (forceHttps) {
        warnings.push(
          "HTTPS detection can fail behind a reverse proxy or CDN. If HTTPS is terminated before Apache, the %{HTTPS} conditions may need adjustment for your host."
        );
      }

      if (canonicalMode !== "none" && !forceHttps) {
        warnings.push(
          "Canonical-only redirects use %{REQUEST_SCHEME}. It requires Apache 2.4+ and can be unreliable behind a proxy."
        );
      }

      if (canonicalStatus === 302) {
        warnings.push("The canonical/HTTPS redirect is temporary (302). Use 301 when the change is permanent.");
      }
    }

    if (canonicalMode !== "none" && !canonicalReady) {
      warnings.push("Canonical hostname rules were not generated because the hostname is invalid.");
    }

    var rows = Array.isArray(cfg.pathRedirects) ? cfg.pathRedirects : [];
    var validRows = [];
    var seenSources = Object.create(null);
    var customLines = [];
    var skippedRows = 0;

    for (var rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      var row = rows[rowIndex] || {};
      var sourceRaw = String(row.source == null ? "" : row.source).trim();
      var destinationRaw = String(row.destination == null ? "" : row.destination).trim();

      if (!sourceRaw && !destinationRaw) continue;

      var sourceResult = validateSourcePath(sourceRaw);
      if (sourceResult.error) {
        errors.push("Redirect " + (rowIndex + 1) + ": " + sourceResult.error);
        skippedRows += 1;
        continue;
      }

      var destinationResult = validateDestination(destinationRaw, sourceResult.wildcardCount, canonicalHost);
      if (destinationResult.error) {
        errors.push("Redirect " + (rowIndex + 1) + ": " + destinationResult.error);
        skippedRows += 1;
        continue;
      }

      if (createsLoop(sourceResult, destinationResult, canonicalHost)) {
        errors.push("Redirect " + (rowIndex + 1) + ": Source and destination point to the same path, which would create a redirect loop.");
        skippedRows += 1;
        continue;
      }

      var sourceKey = sourceResult.normalized + "|" + String(sourceResult.wildcardCount);
      if (seenSources[sourceKey]) {
        errors.push("Redirect " + (rowIndex + 1) + ": The source path duplicates redirect " + seenSources[sourceKey] + ".");
        skippedRows += 1;
        continue;
      }
      seenSources[sourceKey] = rowIndex + 1;

      var status = Number(row.status) === 302 ? 302 : 301;
      var preserveQuery = row.preserveQuery !== false;
      var pattern = buildSourcePattern(sourceResult.value);
      var target = destinationResult.value;
      var flags = ["L", "R=" + status];

      if (!preserveQuery && target.indexOf("?") === -1) {
        target += "?";
      }

      if (preserveQuery && target.indexOf("?") !== -1) {
        flags.push("QSA");
      }

      if (isBroadWildcard(sourceResult)) {
        warnings.push(
          "Redirect " + (rowIndex + 1) + " uses a catch-all source. Rules below it may never be reached because of the [L] flag."
        );
      }

      if (destinationResult.type === "url") {
        warnings.push(
          "Redirect " + (rowIndex + 1) + " sends visitors to an external URL. The generator cannot verify that the target exists or is trustworthy."
        );
      }

      customLines.push("# Redirect " + (rowIndex + 1) + ": " + sourceResult.value + " -> " + target);
      customLines.push("RewriteRule " + pattern + " " + target + " [" + flags.join(",") + "]");

      validRows.push({
        number: rowIndex + 1,
        source: sourceResult,
        destination: destinationResult,
        target: target
      });
    }

    if (skippedRows > 0) {
      warnings.push(skippedRows + " custom redirect row(s) were skipped because of validation errors.");
    }

    for (var a = 0; a < validRows.length; a += 1) {
      for (var b = 0; b < validRows.length; b += 1) {
        if (a === b) continue;
        if (
          validRows[a].destination.type === "path" &&
          normalizeComparablePath(validRows[a].destination.path) === validRows[b].source.normalized
        ) {
          warnings.push(
            "Redirect " + validRows[a].number + " points to a path that is also redirected by row " + validRows[b].number + ". Visitors may see an extra redirect hop."
          );
        }
      }
    }

    if (customLines.length) {
      var customHeader = [
        "# Legacy path redirects",
        "# More specific rules should appear before broader rules.",
        "# Query strings are preserved unless a row uses the drop-query option."
      ];
      sections.push(customHeader.concat(customLines).join("\n"));
      ruleCount += validRows.length;
    }

    var trailingMode = cfg.trailingSlash || "none";
    if (trailingMode === "add" || trailingMode === "remove") {
      if (trailingMode === "add") {
        sections.push(
          [
            "# Trailing slash normalization: add a slash to non-file URLs",
            "# This runs after the redirects above.",
            "RewriteCond %{REQUEST_FILENAME} !-f",
            "RewriteCond %{REQUEST_URI} !/$",
            "RewriteRule ^(.*)$ /$1/ [L,R=301]"
          ].join("\n")
        );
      } else {
        sections.push(
          [
            "# Trailing slash normalization: remove the slash from non-directory URLs",
            "# This runs after the redirects above.",
            "RewriteCond %{REQUEST_FILENAME} !-d",
            "RewriteCond %{REQUEST_URI} (.+)/$",
            "RewriteRule ^ %1 [L,R=301]"
          ].join("\n")
        );
      }
      ruleCount += 1;

      if (validRows.length > 0) {
        warnings.push(
          "Custom path redirects run before trailing-slash normalization. Some destinations may receive an extra redirect hop."
        );
      }
    }

    if (ruleCount > 0) {
      warnings.push(
        "If this site uses WordPress, place these rules above the # BEGIN WordPress block and leave the existing WordPress block intact."
      );
    }

    var code = "";
    if (ruleCount > 0) {
      code =
        [
          "# .htaccess redirect rules generated with Taskly Tools",
          "# Back up your existing .htaccess file before editing or replacing it.",
          "# Review these rules on a staging site before deploying them.",
          "#",
          "<IfModule mod_rewrite.c>",
          "RewriteEngine On",
          "",
          sections.join("\n\n"),
          "</IfModule>"
        ].join("\n") + "\n";
    }

    return {
      code: code,
      errors: errors,
      warnings: warnings,
      ruleCount: ruleCount
    };
  }

  return {
    normalizeHost: normalizeHost,
    validateSourcePath: validateSourcePath,
    validateDestination: validateDestination,
    buildSourcePattern: buildSourcePattern,
    generate: generate
  };
});
