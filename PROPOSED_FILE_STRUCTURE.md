# TasklyTools.org - Proposed New File Structure

This is a proposal for Phase 1 onward. No files in this structure are created in Phase 0
except the five audit documents at the repository root.

---

## 1. Design principles

1. Preserve every existing file. New work lives in new paths.
2. Use a dedicated namespace so collision checks are trivial and legacy pages are untouched.
3. Keep the site static-first: HTML5, CSS3, vanilla JavaScript, GitHub Pages compatible.
4. Reuse the existing navbar/footer contract instead of forking it.
5. Separate content, tool logic, and presentation so tools are easy to add and test.
6. Keep every core tool functional with no paid API and no backend.
7. Make SEO metadata a required part of every page template, not an afterthought.
8. Avoid a build step unless it is strictly necessary and CI-only.

---

## 2. Namespace decision

Proposed staging namespace: `/next/`

Reasons:

- It does not collide with any existing directory.
- It can be served immediately at `https://tasklytools.org/next/`.
- It can be previewed on GitHub Pages without changing `CNAME` or deployment settings.
- It can be promoted to root later with a controlled migration.

Alternative: `/v2/`. Either is acceptable. `/next/` is used below.

Important: the root `/index.html` is not created. The staging entry point is
`/next/home.html`. A root launch requires owner approval (Blocker B1).

If the owner approves `index.html` inside a brand-new directory, new tool pages may use
`/next/tools/<tool>/index.html` for clean trailing-slash URLs. Otherwise use explicit
`.html` filenames. Both options are listed below.

---

## 3. Proposed directory tree

```text
/next/
  home.html                          # staging homepage (not root index.html)
  README.md                          # how to preview and promote
  assets/
    site.css                         # new global styles, scoped to .tt-next
    site.js                          # new global behavior, no legacy edits
    tokens.css                       # colors, spacing, typography, breakpoints
    components.css                   # new cards, grids, pricing, marketplace
    nav-overrides.css                # optional, scoped additions only
    images/                          # new images; do not reuse existing filenames
  partials/
    head-meta.html                   # optional include pattern for metadata
    nav-additive.html                # optional additive nav (owner approval required)
    cta-band.html                    # reusable conversion band
    newsletter.html                  # email capture block (provider-dependent)
  data/
    tools.json                       # tool catalog: slug, title, category, path, status
    products.json                    # premium products and checkout URLs
    categories.json                  # business, freelancer, marketing, utility
    faq.json                         # optional FAQ content
  tools/
    index.html                       # tools directory
    business/
      index.html                     # business tools category
      invoice-generator/
        index.html
        app.js
        logic.js
        styles.css                   # optional tool-specific styles
      profit-calculator/
        index.html
        app.js
        logic.js
      freelance-rate-calculator/
        index.html
        app.js
        logic.js
    freelancer/
      index.html                     # freelancer tools category
      proposal-generator/
        index.html
        app.js
        logic.js
      freelance-rate-calculator/     # if categorized here instead of business
        index.html
    marketing/
      index.html                     # marketing tools category
      utm-builder/
        index.html
        app.js
        logic.js
    utility/
      index.html                     # links to existing utility tools
  templates/
    index.html                       # templates marketplace listing
    product.html                     # reusable product detail template
    product-<slug>.html              # one page per product if static
  pricing/
    index.html                       # free vs premium vs future subscription
  about/
    index.html                       # new about page (do not edit /about-us/)
  contact/
    index.html                       # new contact page (do not edit /contact-us/)
  legal/
    privacy.html                     # new privacy policy (do not edit /privacy-policy/)
    terms.html                       # new terms (do not edit /terms-and-conditions/)
    affiliate-disclosure.html        # required for affiliate content
    refund-policy.html               # required if selling products
  checkout/
    success.html                     # post-checkout return page
    cancel.html                      # checkout cancel page
  blog/
    index.html                       # new editorial index
    <slug>.html                      # new articles
  sitemap-next.xml                   # new sitemap, existing sitemap untouched
  robots-next.txt                    # optional staging robots, if needed
```

Notes:

- Do not create `/next/index.html` unless the owner explicitly approves a new `index.html`
  in a new directory. `home.html` is the safe default.
- The existing `/tools/` and `/utility-tools/` remain untouched. New categories live under
  `/next/tools/`.
- Legal pages get new filenames to avoid modifying existing legal pages.
- New About/Contact pages get new paths. The existing footer links still point to the old
  pages, which must remain valid.

### Flat-filename variant (strictest interpretation)

If no new `index.html` file may be created anywhere:

```text
/next/tools/invoice-generator.html
/next/tools/profit-calculator.html
/next/tools/freelance-rate-calculator.html
/next/tools/proposal-generator.html
/next/tools/utm-builder.html
/next/tools/business.html
/next/tools/freelancer.html
/next/tools/marketing.html
/next/templates.html
/next/pricing.html
/next/about.html
/next/contact.html
/next/privacy.html
/next/terms.html
```

Trade-off: URLs end in `.html`, which is slightly less clean for SEO but fully avoids the
`index.html` restriction. GitHub Pages does not rewrite extensionless URLs without files.

---

## 4. Shared layout contract

Every new page must include the existing component placeholders:

```html
<body class="tt-next">
  <div id="pre-load-animation"></div>
  <button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>

  <header class="container-fluid sticky-top" id="main-header">
    <div id="navbar-container"></div>
  </header>

  <main id="main-content">
    <!-- page content -->
  </main>

  <footer class="container-fluid footer-section pt-5 pb-3">
    <div id="footer-container"></div>
  </footer>
</body>
```

Existing assets to load unchanged:

- `/wp-content/themes/aj-square/style.css`
- `/wp-content/themes/aj-square/assets/css/style.css`
- `/wp-content/themes/aj-square/assets/css/bootstrap.min.css`
- `/wp-content/themes/aj-square/assets/bootstrap-icons/bootstrap-icons95a1.css`
- `/assets/tools/toolkit.css`
- `/footer-script.js`, `/nav.js`
- `/wp-content/themes/aj-square/assets/js/bootstrap.bundle.min.js`
- `/assets/tools/toolkit.js`

New assets:

- `/next/assets/tokens.css`
- `/next/assets/site.css`
- `/next/assets/components.css`
- `/next/assets/site.js`

Do not modify the existing files. New CSS must be scoped to `.tt-next` where it could
otherwise affect legacy pages.

---

## 5. Tool page pattern

Each new tool should follow the proven pattern used by
`base64-encoder-decoder/`, `htaccess-redirect-generator/`,
`password-strength-checker/`, and `robots-txt-generator-validator/`:

```text
<tool>/
  index.html   # semantic markup, metadata, breadcrumbs, explanation, FAQ
  logic.js     # pure functions; no DOM access; easy to test
  app.js       # DOM binding, validation, output, downloads
```

Rules:

- `logic.js` exposes pure functions and constants.
- `app.js` reads inputs, calls `logic.js`, and updates the DOM.
- No global variables. Use IIFEs or modules.
- Use `TasklyToolkit` for copy, download, debounce, and status.
- All processing is local unless a feature explicitly requires a service.
- Every tool page includes:
  - Unique title and meta description.
  - Canonical URL.
  - Open Graph and Twitter tags.
  - BreadcrumbList JSON-LD.
  - WebApplication or SoftwareApplication JSON-LD.
  - Accessible form labels, status regions, and keyboard support.
  - A "Related tools" section.
  - A privacy statement describing local processing.

### Initial tool mapping

| Tool | Category | Client-side | External need |
| --- | --- | --- | --- |
| Invoice Generator | Business | Yes: form, calculations, print/PDF via browser | None for core; optional hosted PDF for premium |
| Profit Calculator | Business | Yes | None |
| Freelance Rate Calculator | Freelancer | Yes | None |
| Proposal Generator | Freelancer | Yes: template-based text generation and download | None for core; optional AI later |
| UTM Builder | Marketing | Yes: URL construction, validation, copy | None |

---

## 6. Data-driven catalog

`/next/data/tools.json` example:

```json
[
  {
    "slug": "invoice-generator",
    "title": "Invoice Generator",
    "category": "business",
    "path": "/next/tools/business/invoice-generator/",
    "description": "Create and print a professional invoice in your browser.",
    "status": "live",
    "premium": false
  }
]
```

`/next/data/products.json` example:

```json
[
  {
    "slug": "freelance-starter-kit",
    "title": "Freelance Starter Kit",
    "price": "29.00",
    "currency": "USD",
    "checkoutUrl": "https://checkout.example.com/...",
    "type": "download",
    "active": true
  }
]
```

These files are static JSON fetched by the browser. Keep them small. If they grow, split by
category.

---

## 7. URL strategy

### During development and preview

- New platform: `https://tasklytools.org/next/` (entry `home.html`).
- Existing site: unchanged at the root.
- Preview on GitHub Pages: `/next/...` works without touching `CNAME`.

### At launch (requires owner approval)

Option A: Promote `/next/` to root.

- Copy new files to root paths only where no collision exists.
- Root `/index.html` must be created or replaced. This violates current preservation rules
  and requires explicit approval and a rollback plan.
- Existing URLs must keep working or redirect.

Option B: Keep old site at root and run the new platform under `/next/`.

- No collision, but weaker SEO and brand cohesion.
- The navbar must link to `/next/` pages.

Option C: Subdomain, for example `app.tasklytools.org`.

- Requires DNS and GitHub Pages configuration changes. Not allowed without approval.

Recommendation: build and validate under `/next/`, then request explicit approval for a
root migration with a redirect map and backup.

---

## 8. SEO files

Do not modify the existing `robots.txt` or `sitemap.xml` in early phases.

Create:

- `/next/sitemap-next.xml` for new pages.
- Later, an owner-approved combined sitemap at the root.

Each new page must have a canonical URL. During staging, decide whether canonicals point to
the staging path or the eventual production path. Recommendation: staging pages use
`noindex` and canonical to the staging URL until launch; switch to production canonicals at
promotion.

If `/next/` must remain crawlable, add a staging-specific robots policy only after owner
approval.

---

## 9. Jekyll / GitHub Pages considerations

- `_config.yml` uses `theme: minima` and `permalink: pretty`. Do not modify it.
- New pages are plain HTML and do not need Jekyll processing.
- Jekyll may still process files. Avoid Liquid syntax in new pages unless intentional.
- Do not add `.nojekyll` without approval; it changes how the whole site is served.
- Keep filenames ASCII, lowercase, hyphenated.
- Avoid spaces in new filenames.
- Keep paths case-sensitive and consistent.

---

## 10. Collision avoidance list

Before creating any file, confirm it is not one of these existing paths:

```text
/index.html
/navbar.html
/footer.html
/nav.js
/footer-script.js
/pre-load.html
/sidebar.html
/search.html
/404.html
/sitemap.xml
/robots.txt
/CNAME
/_config.yml
/.htaccess
/about-us/
/contact-us/
/privacy-policy/
/terms-and-conditions/
/disclaimer/
/tools/
/utility-tools/
/base64-encoder-decoder/
/htaccess-redirect-generator/
/password-strength-checker/
/robots-txt-generator-validator/
/assets/
/wp-content/
/wp-includes/
/wp-json/
/cdn-cgi/
```

All proposed tool slugs (`invoice-generator`, `profit-calculator`,
`freelance-rate-calculator`, `proposal-generator`, `utm-builder`) are currently free.

---

## 11. What stays where

| Concern | Location |
| --- | --- |
| Existing site | Root paths, unchanged |
| New platform | `/next/` |
| Existing nav/footer sources | Root `navbar.html`, `footer.html`, `nav.js`, `footer-script.js` |
| New nav/footer enhancements | `/next/partials/`, `/next/assets/` |
| Shared tool utilities | `/assets/tools/toolkit.*` (read-only) |
| New shared tool utilities | `/next/assets/site.js` or additional new files |
| New tool pages | `/next/tools/<category>/<tool>/` |
| New products/templates | `/next/templates/` |
| New legal pages | `/next/legal/` |
| New docs | Repository root, `.md` files with unique names |

---

## 12. Phase 1 starting set

Minimum files for the first implementation phase:

1. `/next/home.html`
2. `/next/assets/tokens.css`
3. `/next/assets/site.css`
4. `/next/assets/components.css`
5. `/next/assets/site.js`
6. `/next/tools/index.html`
7. `/next/tools/business/index.html`
8. `/next/tools/freelancer/index.html`
9. `/next/tools/marketing/index.html`
10. `/next/tools/business/invoice-generator/index.html` + `app.js` + `logic.js`
11. `/next/pricing/index.html`
12. `/next/about/index.html`
13. `/next/contact/index.html`
14. `/next/legal/privacy.html`
15. `/next/legal/terms.html`

Remaining tools and the marketplace follow in later phases.
