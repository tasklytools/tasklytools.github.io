/* TasklyTools shared UI components and page controllers.
   No frameworks. All content is rendered from TasklyConfig. */
(function (root) {
  "use strict";

  var config = root.TasklyConfig;
  if (!config) return;

  var DIRECTORY_URL = "/tools/all/";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeIcon(name) {
    return String(name || "bi-grid").replace(/[^a-z0-9-]/gi, "");
  }

  function categoryName(id) {
    var category = config.getCategory(id);
    return category ? category.name.replace(/ Tools$/, "") : "Tool";
  }

  function orderedTools() {
    var live = [];
    var soon = [];
    config.tools.forEach(function (tool) {
      if (tool.status === "live") live.push(tool);
      else soon.push(tool);
    });
    return live.concat(soon);
  }

  function statusBadge(status) {
    if (status === "live") {
      return '<span class="tt-badge tt-badge-live"><i class="bi bi-check-circle-fill" aria-hidden="true"></i>Live</span>';
    }
    return '<span class="tt-badge tt-badge-soon"><i class="bi bi-clock" aria-hidden="true"></i>Coming soon</span>';
  }

  function toolCard(tool) {
    var isLive = tool.status === "live" && tool.url;
    var cardClass = "tt-tool-card" + (isLive ? " tt-card-hover" : "");
    var action = isLive
      ? '<a class="tt-card-link" href="' + esc(tool.url) + '">Open tool <i class="bi bi-arrow-right" aria-hidden="true"></i></a>'
      : '<span class="tt-meta"><i class="bi bi-tools" aria-hidden="true"></i>In development</span>';

    return (
      '<article class="' + cardClass + '" data-tool-card data-category="' + esc(tool.category) + '" ' +
      'data-search="' + esc([tool.name, tool.description, categoryName(tool.category)].concat(tool.tags || []).join(" ").toLowerCase()) + '">' +
        '<div class="tt-tool-card-top">' +
          '<span class="tt-icon-box"><i class="bi ' + safeIcon(tool.icon) + '" aria-hidden="true"></i></span>' +
          statusBadge(tool.status) +
        '</div>' +
        '<div>' +
          '<h3 class="tt-tool-card-title">' + esc(tool.name) + '</h3>' +
          '<p class="tt-tool-card-desc">' + esc(tool.description) + '</p>' +
        '</div>' +
        '<div class="tt-tool-card-foot">' +
          '<span class="tt-badge tt-badge-category">' + esc(categoryName(tool.category)) + '</span>' +
          action +
        '</div>' +
      '</article>'
    );
  }

  function searchResult(tool) {
    var isLive = tool.status === "live" && tool.url;
    var action = isLive
      ? '<a class="tt-btn tt-btn-secondary tt-btn-sm" href="' + esc(tool.url) + '">Open</a>'
      : '<span class="tt-badge tt-badge-soon">Coming soon</span>';

    return (
      '<div class="tt-search-result">' +
        '<div class="tt-search-result-main">' +
          '<span class="tt-search-result-icon"><i class="bi ' + safeIcon(tool.icon) + '" aria-hidden="true"></i></span>' +
          '<div>' +
            '<p class="tt-search-result-title">' + esc(tool.name) + '</p>' +
            '<p class="tt-search-result-meta">' + esc(categoryName(tool.category)) + ' tool</p>' +
          '</div>' +
        '</div>' +
        action +
      '</div>'
    );
  }

  function renderFeaturedTools() {
    var target = document.querySelector("[data-featured-tools]");
    if (!target) return;
    target.innerHTML = orderedTools().map(toolCard).join("");
  }

  function renderCategories() {
    var target = document.querySelector("[data-category-grid]");
    if (!target) return;

    target.innerHTML = config.categories
      .map(function (category) {
        var count = config.tools.filter(function (tool) {
          return tool.category === category.id;
        }).length;

        return (
          '<a class="tt-category-card" href="' + DIRECTORY_URL + "?category=" + encodeURIComponent(category.id) + '">' +
            '<div class="tt-category-card-top">' +
              '<span class="tt-icon-box"><i class="bi ' + safeIcon(category.icon) + '" aria-hidden="true"></i></span>' +
              '<span class="tt-badge tt-badge-neutral">' + count + ' tool' + (count === 1 ? "" : "s") + '</span>' +
            '</div>' +
            '<div>' +
              '<h3>' + esc(category.name) + '</h3>' +
              '<p>' + esc(category.description) + '</p>' +
            '</div>' +
            '<div class="tt-category-card-foot">' +
              '<span>Browse category</span>' +
              '<i class="bi bi-arrow-right" aria-hidden="true"></i>' +
            '</div>' +
          '</a>'
        );
      })
      .join("");
  }

  function renderTemplates() {
    var target = document.querySelector("[data-template-grid]");
    if (!target) return;

    target.innerHTML = config.templates
      .map(function (template) {
        return (
          '<article class="tt-template-card">' +
            '<div class="tt-tool-card-top">' +
              '<span class="tt-icon-box tt-icon-box--accent"><i class="bi ' + safeIcon(template.icon) + '" aria-hidden="true"></i></span>' +
              '<span class="tt-badge tt-badge-soon">Coming soon</span>' +
            '</div>' +
            '<h3>' + esc(template.name) + '</h3>' +
            '<p>' + esc(template.description) + '</p>' +
            '<div class="tt-template-card-foot">' +
              '<span class="tt-meta">Digital download</span>' +
              '<span class="tt-meta"><i class="bi bi-hourglass-split" aria-hidden="true"></i>In design</span>' +
            '</div>' +
          '</article>'
        );
      })
      .join("");
  }

  function initHomeSearch() {
    var form = document.querySelector("[data-tool-search]");
    if (!form) return;

    var input = form.querySelector("[data-tool-search-input]");
    var results = document.querySelector("[data-tool-search-results]");
    var hint = document.querySelector("[data-tool-search-hint]");
    if (!input || !results) return;

    function run() {
      var query = input.value.trim().toLowerCase();
      results.innerHTML = "";

      if (!query) {
        results.classList.add("tt-hidden");
        if (hint) hint.classList.remove("tt-hidden");
        return;
      }

      var matches = orderedTools().filter(function (tool) {
        var haystack = [tool.name, tool.description, categoryName(tool.category)]
          .concat(tool.tags || [])
          .join(" ")
          .toLowerCase();
        return haystack.indexOf(query) !== -1;
      });

      results.classList.remove("tt-hidden");
      if (hint) hint.classList.add("tt-hidden");

      if (!matches.length) {
        results.innerHTML =
          '<p class="tt-search-empty">No tools match &ldquo;' + esc(input.value.trim()) +
          '&rdquo; yet. <a href="' + DIRECTORY_URL + '">Browse all tools</a> or try a broader term.</p>';
        return;
      }

      results.innerHTML =
        '<p class="tt-search-result-meta" style="margin:0 0 0.15rem;">' +
        matches.length + ' matching tool' + (matches.length === 1 ? "" : "s") + '</p>' +
        matches.map(searchResult).join("");
    }

    input.addEventListener("input", run);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = input.value.trim();
      window.location.href = DIRECTORY_URL + (query ? "?q=" + encodeURIComponent(query) : "");
    });

    run();
  }

  function initDirectory() {
    var grid = document.querySelector("[data-directory-grid]");
    if (!grid) return;

    var search = document.querySelector("[data-directory-search]");
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var count = document.querySelector("[data-directory-count]");
    var empty = document.querySelector("[data-directory-empty]");
    var clear = document.querySelector("[data-directory-clear]");
    var params = new URLSearchParams(window.location.search);
    var state = {
      query: (params.get("q") || "").trim(),
      category: (params.get("category") || "all").toLowerCase()
    };

    var validCategories = ["all"].concat(
      config.categories.map(function (category) {
        return category.id;
      })
    );
    if (validCategories.indexOf(state.category) === -1) state.category = "all";

    grid.innerHTML = orderedTools().map(toolCard).join("");
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-tool-card]"));

    if (search) search.value = state.query;

    function syncUrl() {
      var next = new URLSearchParams();
      if (state.query) next.set("q", state.query);
      if (state.category !== "all") next.set("category", state.category);
      var suffix = next.toString();
      var url = window.location.pathname + (suffix ? "?" + suffix : "") + window.location.hash;
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", url);
      }
    }

    function apply() {
      var query = state.query.toLowerCase();
      var shown = 0;

      cards.forEach(function (card) {
        var matchesCategory =
          state.category === "all" || card.getAttribute("data-category") === state.category;
        var matchesQuery =
          !query || (card.getAttribute("data-search") || "").indexOf(query) !== -1;
        var visible = matchesCategory && matchesQuery;
        card.classList.toggle("tt-hidden", !visible);
        if (visible) shown += 1;
      });

      filters.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.getAttribute("data-filter") === state.category ? "true" : "false"
        );
      });

      if (count) {
        count.textContent =
          "Showing " + shown + " of " + cards.length + " tool" + (cards.length === 1 ? "" : "s");
      }

      if (empty) empty.classList.toggle("tt-hidden", shown !== 0);
    }

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        state.category = button.getAttribute("data-filter") || "all";
        syncUrl();
        apply();
      });
    });

    if (search) {
      search.addEventListener("input", function () {
        state.query = search.value.trim();
        syncUrl();
        apply();
      });
    }

    if (clear) {
      clear.addEventListener("click", function () {
        state.query = "";
        state.category = "all";
        if (search) search.value = "";
        syncUrl();
        apply();
      });
    }

    apply();
  }

  function setStatus(element, type, message) {
    if (!element) return;
    var icons = {
      info: "bi-info-circle",
      success: "bi-check-circle",
      error: "bi-x-circle"
    };
    element.className = "tt-status tt-status--" + type;
    element.innerHTML =
      '<i class="bi ' + (icons[type] || icons.info) + '" aria-hidden="true"></i>' +
      '<span>' + esc(message) + '</span>';
  }

  function initTopButton() {
    root.topFunction = function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, area.value.length);
      try {
        var copied = document.execCommand("copy");
        document.body.removeChild(area);
        if (copied) resolve();
        else reject(new Error("Copy failed"));
      } catch (error) {
        document.body.removeChild(area);
        reject(error);
      }
    });
  }

  function init() {
    initTopButton();
    renderFeaturedTools();
    renderCategories();
    renderTemplates();
    initHomeSearch();
    initDirectory();
  }

  root.TasklyUI = {
    copyText: copyText,
    setStatus: setStatus,
    esc: esc
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
