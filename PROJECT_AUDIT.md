# TasklyTools.org - Phase 0 Project Audit

- Audit date: 2026-11-03
- Mode: read-only inspection
- Scope: existing repository, homepage reference, navigation, footer, CSS, JavaScript, assets, SEO, deployment, tools and URLs
- Result: audit complete; no existing file was created, modified, renamed, moved, or deleted by this audit

---

## 1. Executive summary

The repository is a static GitHub Pages mirror of a WordPress site. It is not a hand-built
static site: it contains WordPress theme, plugin, upload, JSON API, and Cloudflare artifacts
copied into folders that GitHub Pages serves directly.

The live homepage reference is `index-old.html` (206 lines). It contains only page content;
the navigation and footer are injected at runtime from `navbar.html` and `footer.html` by
`nav.js` and `footer-script.js`.

Two facts dominate all planning:

1. The working tree already had 103 modified files, 1 deleted file (`index.html`), and 15
   untracked files before this audit started. The root `index.html` still exists in git
   `HEAD` but is absent from the working tree.
2. The new platform must be built with new files only. The root `index.html` cannot be
   created or overwritten under the current preservation rules. This is a migration blocker
   that must be resolved explicitly before launch.

The existing navigation and footer can be reused without editing their source files by
including the same container elements and the same `nav.js` / `footer-script.js` files in new
pages. Their markup contract and behavior are documented in
`NAVIGATION_AND_FOOTER_ANALYSIS.md`.

---

## 2. Baseline repository state (pre-existing, not caused by this audit)

`git status` at audit start:

- Branch: `main`, up to date with `origin/main`
- 103 modified tracked files
- 1 deleted tracked file: `index.html`
- 15 untracked files, including `index-old.html`, `assets/`, and the four newer tool folders
- Last commits: `54f1982 update`, `17a2dd5 update`, `47e42f7 update v1.1.1`

The repository is 12 MB with 62 HTML files and roughly 180 tracked files in `HEAD`.

This dirty state is pre-existing. It must not be staged, committed, reverted, or "cleaned"
without explicit owner approval. See `PRESERVATION_RULES.md`.

---

## 3. Existing project structure

### Top-level files

| File | Purpose |
| --- | --- |
| `index-old.html` | Reference copy of the current homepage. Untracked. Read-only. |
| `404.html` | Custom GitHub Pages 404 page. |
| `CNAME` | Custom domain: `tasklytools.org`. |
| `_config.yml` | Jekyll/GitHub Pages config, `permalink: pretty`, `theme: minima`. |
| `robots.txt` | Crawl rules and sitemap reference. |
| `sitemap.xml` | Hand-maintained sitemap of 19 URLs. |
| `.htaccess` | Apache rewrite rules. Ignored by GitHub Pages. |
| `navbar.html` | Navigation partial, fetched at runtime. |
| `footer.html` | Footer partial, fetched at runtime. |
| `nav.js` | Loads navbar, sticky behavior, scroll-to-top, anchor scrolling. |
| `footer-script.js` | Loads preloader, navbar (again), sidebar, footer. |
| `sidebar.html` | Sidebar partial used on legacy pages. |
| `pre-load.html` | Preloader markup injected by `footer-script.js`. |
| `search.html` | Client-side search over a hard-coded page list. |
| `test.html`, `socialandauthor.html` | Legacy test/widget partials. |
| `demo-index.html.txt`, `demo copy.html.txt` | Legacy demo copies. |
| `xmlrpc0db0.html` | Captured WordPress XML-RPC response. |

### Directories

| Directory | Contents |
| --- | --- |
| `assets/tools/` | Newer shared tool design system: `toolkit.css`, `toolkit.js`. |
| `wp-content/themes/aj-square/` | Active WordPress theme: root `style.css`, `assets/css/style.css`, `assets/css/toolsf269.css`, Bootstrap 4.6.2, Bootstrap Icons, JS. |
| `wp-content/plugins/` | Captured plugin CSS/JS (Akismet, WPForms, Site Kit, card elements, hero banner, etc.). |
| `wp-content/uploads/` | Images, logo, favicons, blog thumbnails. |
| `wp-includes/` | Captured WordPress core CSS/JS/fonts (jQuery, dashicons, block library). |
| `wp-json/` | Captured WordPress REST API responses. |
| `cdn-cgi/` | Cloudflare email-protection artifacts. |
| `tools/` | Security tool pages: malware scanner, redirect checker, blacklist checker. |
| `utility-tools/` | All-in-one utility tool directory page. |
| `base64-encoder-decoder/` | Newer standalone tool with `index.html`, `app.js`, `logic.js`. |
| `htaccess-redirect-generator/` | Newer standalone tool with `index.html`, `app.js`, `logic.js`. |
| `password-strength-checker/` | Newer standalone tool with `index.html`, `app.js`, `logic.js`. |
| `robots-txt-generator-validator/` | Newer standalone tool with `index.html`, `app.js`, `logic.js`. |
| Content folders | `about-us/`, `contact-us/`, `privacy-policy/`, `terms-and-conditions/`, `disclaimer/`, `blog/`, `best-free-online-tools/`, `category/`, `author/`, `feed/`, `comments/`, `2025/05/`, `fix/`, plus individual blog/tool pages. |

The site mixes two generations of tooling:

- Legacy WordPress-derived pages with heavy inline CSS/JS and jQuery.
- Newer standalone tools using `assets/tools/toolkit.css` and `assets/tools/toolkit.js`.

---

## 4. Current homepage (`index-old.html`)

### Document head

- HTML5, `lang="en-US"`, responsive viewport.
- Title: `All-in-One Free Tools - Taskly Tools`.
- Description: security-tool positioning, not productivity/business positioning.
- Canonical: `https://tasklytools.org/`.
- Yoast-style Open Graph and Twitter meta.
- Google site verification, Google Analytics (`GT-MJWCNQXM`), Google Tag Manager (`GTM-P879KSTN`).
- Google Fonts Roboto; Bootstrap 4.6.2; Bootstrap Icons; Font Awesome CDN; theme CSS.
- Favicons under `/wp-content/uploads/2025/05/`.
- Canonical and social image reference `taskly-tools-1.png`; the repository contains
  `taskly-tools.png` but not `taskly-tools-1.png` (broken social image).

### Body

- Preloader placeholder: `#pre-load-animation`.
- Back-to-top button: `#myBtn` calling `topFunction()` inline.
- Header: `<header id="main-header"><div id="navbar-container"></div></header>`.
- Content sections: hacked-site hero, common problems, free security tools, developer and
  privacy tools, "Need a Complete Fix?" CTA.
- Footer: `<footer class="footer-section"><div id="footer-container"></div></footer>`.
- Scripts: `footer-script.js`, `nav.js`, theme `script.js`, Bootstrap bundle.

The homepage is security-services oriented. The new business positioning (freelancers, small
businesses, creators, marketers, entrepreneurs) is a strategic departure and should not reuse
the homepage copy.

---

## 5. Existing navigation

Source: `navbar.html` (34 lines), loaded by `nav.js` and again by `footer-script.js`.

Structure:

- Brand link to `https://tasklytools.org/` with logo `taskly-tools.png`.
- Custom hamburger button `#navbarToggler` with an inline `onclick` that toggles `.show` on
  `#navbarSupportedContent`.
- Collapsible `#navbarSupportedContent` containing `#menu-primary`.
- Desktop links:
  - Home -> `https://tasklytools.org/`
  - Security Tools -> `https://tasklytools.org/security-tools`
  - Fix Website -> `https://tasklytools.org/fix-website`
  - Utility Tools -> `https://tasklytools.org/utility-tools`
  - Blog (dropdown) -> `https://tasklytools.org/category/free-tools`
- Search icon -> `/search.html`.
- Hidden search form -> submits `?s=` to `https://tasklytools.org/`.

Observed defects in the existing navigation:

- `/security-tools` does not exist in the repository; the real page is `/tools/`.
- `/fix-website` does not exist; the real content lives under `/fix/...`.
- The hidden search form targets WordPress `?s=` search, but the site is static; it will not
  return results. `/search.html` uses a separate hard-coded client-side list.
- Two scripts attach different behavior to `#searchIcon`: `nav.js` redirects to
  `search.html`, while `script.js` toggles the hidden form.
- The navbar is fetched twice (by `nav.js` and by `footer-script.js`).
- Mobile dropdown is driven by hover CSS and Bootstrap attributes, not by the custom toggler;
  behavior is inconsistent across breakpoints.

These defects are documented, not fixed. Fixing existing files is prohibited in Phase 0.

---

## 6. Existing footer

Source: `footer.html` (63 lines), loaded by `footer-script.js`.

Structure:

- Four-column layout inside `.footer-section`:
  - Brand blurb: "Taskly Tools".
  - Quick Links: Malware Scanner, Fix Hacked Site, Utility Tools.
  - Contact: email placeholder (`[email protected]`, Cloudflare-obfuscated) and WhatsApp.
  - Legal: About Us, Contact Us, Privacy Policy, Disclaimer, Terms & Conditions.
- Horizontal rule.
- Credit bar `#credit-footer`: 2026 copyright and Facebook/X social icons.

All footer links are root-relative, so they work from nested new pages. The contact email is
obfuscated by Cloudflare (`cdn-cgi/l/email-protection.html`) in the captured copy; the literal
value in the partial is `[email protected]`, which is not a usable email.

---

## 7. CSS architecture

Primary stylesheets:

| Stylesheet | Lines | Role |
| --- | --- | --- |
| `wp-content/themes/aj-square/style.css` | 25 | Theme metadata/header. |
| `wp-content/themes/aj-square/assets/css/style.css` | 1605 | Global design tokens, layout, navbar, footer, preloader, blog, responsive rules. |
| `wp-content/themes/aj-square/assets/css/toolsf269.css` | 588 | Legacy tool page styling. |
| `wp-content/themes/aj-square/assets/css/bootstrap.min.css` | vendor | Bootstrap 4.6.2 grid/components. |
| `wp-content/themes/aj-square/assets/bootstrap-icons/bootstrap-icons95a1.css` | vendor | Icon font. |
| `assets/tools/toolkit.css` | 962 | Newer self-contained tool design system. |
| Font Awesome CDN | vendor | Legacy icons. |

Global tokens in `style.css`:

- `--primary-color: #007bff`
- `--text-color: #343a40`
- `--link-color: #007bff`
- `--link-hover-color: #0056b3`
- `--pink-color: #ef0067`
- `--pink-hover-color: #e6146f`

The homepage and newer tool pages override `--link-color: #ef0067` and
`--link-hover-color: #f2268c` inline.

Navigation CSS highlights (`style.css`):

- `.navbar`, `.navbar-brand`, `.navbar-nav`, `.navbar-collapse`
- `#navbarSupportedContent` display/max-height and `.show`
- `.navbar-nav .dropdown-menu`, `.dropdown:hover > .dropdown-menu`
- `.navbar-toggler`, `#navbarToggler`
- `#main-header`, `#main-header.is-stuck`, `#main-header.is-hidden`, `body.has-fixed-header`
- `#myBtn`
- Breakpoints at 991px and 650px; explicit mobile toggler rules at the end of the file.

Footer CSS highlights:

- `footer.footer-section h2`, `li`, `a`, `a:hover`
- `.footer-social-icons`, `a.social-icon`
- `#credit-footer`

Preloader CSS: `#app-boot-bg-loader`, `.pre-load-animation`, `.hide`.

Concerns for new pages:

- The global stylesheet is large and sets large base `ul`/`li` font sizes (1.3rem).
- Navbar color rules depend on CSS variables that some pages override inline.
- Font Awesome is loaded from a CDN in legacy pages; Bootstrap Icons is local.
- Google Fonts requests to `fonts.googleapis.com` and `fonts.gstatic.com` are third-party.
- `toolkit.css` is the cleanest base for new tools, but it does not include nav/footer styles;
  those still come from the theme stylesheet.

---

## 8. JavaScript architecture

| Script | Role | Notes |
| --- | --- | --- |
| `nav.js` | Fetches `navbar.html`, injects it, sets header height, sticky/hide-on-scroll, back-to-top, smooth anchors, search redirect. | 87 lines. Runs immediately with `defer`. |
| `footer-script.js` | On DOMContentLoaded, fetches `pre-load.html`, `navbar.html`, `sidebar.html`, `sidebar-top.html` (missing file), and `footer.html`. | 77 lines. Duplicate navbar fetch. Missing `sidebar-top.html` produces a console error. |
| `script.js` | Search toggle, back-to-top, header hide, anchor scrolling, plus legacy helpers. | 255 lines. Conflicts with `nav.js` search behavior. |
| `taskly.script.js` | 3072 lines of legacy tool/site logic. | Loaded on legacy WordPress-style pages. |
| `bootstrap.bundle.min.js` | Bootstrap 4 components (dropdown, collapse). | Required for dropdown attributes. |
| `assets/tools/toolkit.js` | `TasklyToolkit` helpers: copy, download text/bytes, debounce, status, button flash. | Clean, framework-free utility layer. |
| Tool `logic.js` + `app.js` | Per-tool business logic and DOM binding. | Newer tools follow this pattern. |

Important: the new pages must load `footer-script.js` and `nav.js` (plus Bootstrap) to obtain
the existing nav/footer. Loading only one of the two still works but changes the preloader
behavior.

---

## 9. Images and assets

- Logo: `/wp-content/uploads/2025/05/taskly-tools.png` (used by navbar and preloader).
- Favicons: 32x32, 180x180, 192x192 under `/wp-content/uploads/2025/05/`.
- Blog thumbnails: WebP images under `/wp-content/uploads/2025/05/` and `2025/09/`, `2025/10/`.
- Homepage social image `taskly-tools-1.png` is referenced but missing from the repository.
- Bootstrap Icons font files are local; Font Awesome is CDN.
- All assets are served from the repository root on GitHub Pages.

New pages should reference existing assets read-only and add any new images under a new
directory to avoid collisions.

---

## 10. SEO implementation

Existing strengths:

- Canonical URLs on major pages.
- Open Graph and Twitter cards on most pages.
- Yoast JSON-LD on legacy pages.
- `robots.txt` with sitemap reference.
- `sitemap.xml` with 19 priority-0.8 URLs.
- Descriptive titles/descriptions on newer tool pages.
- Semantic headings and breadcrumbs on newer tool pages.

Existing gaps and risks:

- Sitemap omits many existing pages and all future pages.
- Some canonical/OG URLs are wrong. Example: `tools/index.html` declares its canonical as
  `/tools/` but its OG URL points to the Ultra Tool blog post.
- `search.html` canonicals and OG tags point to `pixelradar.online` (wrong domain).
- Duplicate/legacy WordPress meta (generator, shortlink, oEmbed, XML-RPC) on many pages.
- No Organization/WebSite/SoftwareApplication structured data on newer tools.
- Root homepage has no `index.html` in the working tree, so the live root may be broken or
  served from an older deployment.
- Thin/duplicate content and off-topic pages (hacked WordPress, IELTS, love calculator) dilute
  the productivity-tools positioning.
- No consent management for analytics/ads.

New pages need their own canonical, OG, Twitter, and JSON-LD blocks and must be added to the
sitemap through a controlled update (a new sitemap file if the existing one must remain
untouched).

---

## 11. GitHub Pages and custom domain

- Hosting: GitHub Pages from branch `main`.
- Custom domain: `tasklytools.org` via `CNAME`.
- Jekyll config present: `_config.yml` with `theme: minima` and `permalink: pretty`.
- No `.github/` workflows and no `.nojekyll` file found.
- `.htaccess` is irrelevant on GitHub Pages and should not be modified.
- Static directories are served as-is; `pretty` permalinks do not rewrite existing files.
- A root `index.html` is required for the site root. It is currently deleted in the working
  tree but present in `HEAD`.
- Any new root-level `index.html` would collide with the preservation rules.

Do not change `CNAME`, `_config.yml`, or deployment configuration in this phase or any later
phase without explicit written approval.

---

## 12. Existing tools and content

Security tools:

- `/tools/malware-scanner/`
- `/tools/redirect-checker/`
- `/tools/blacklist-checker/`

Utility tools:

- `/utility-tools/` (directory page, 1067 lines)
- `/htaccess-redirect-generator/`
- `/robots-txt-generator-validator/`
- `/base64-encoder-decoder/`
- `/password-strength-checker/`

Other tools/calculators:

- `/tip-calculator/`
- `/currency-converter-calculator/`
- `/Sleep-Calculator/`
- `/Sleep-Calculator-How-Much-Sleep-Did-I-Get/`
- `/empower-your-health-the-ultimate-bmi-calculator/`
- `/love-love-calculator-true-love-calculator-soulmate/`
- `/placeholder-images-generator/`
- `/photo-placeholder-image-converter/`
- `/image-compressor-compress-image-free-online/`
- `/convert-image-to-png-jpeg-webp-gif-and-bmp-free-online-tool/`
- `/convert-images-to-pdf/`
- `/instant-pdf-merger-combine-files-with-one-click/`
- `/delete-pages-from-pdf-free/`
- `/free-pdf-extract-pages-your-ultimate-tool-for-managing-pdfs/`
- `/input-output-games-online/`

Content pages:

- `/blog/`, `/best-free-online-tools/`, `/fix/...`, `/about-us/`, `/contact-us/`,
  `/privacy-policy/`, `/terms-and-conditions/`, `/disclaimer/`.

The existing business model is free tools plus website-fixing services. The proposed model is
premium digital products, templates, subscriptions, affiliates, and ads. Both can coexist, but
the new platform should be isolated from legacy content until a deliberate migration.

---

## 13. Existing URLs and internal links

Navigation and footer links:

- `/` (homepage)
- `/security-tools` (broken)
- `/fix-website` (broken)
- `/utility-tools/`
- `/category/free-tools`
- `/search.html`
- `/tools/malware-scanner/`
- `/fix/fix-hacked-wordpress-site/`
- `/about-us/`
- `/contact-us/`
- `/privacy-policy/`
- `/disclaimer/`
- `/terms-and-conditions/`

Homepage content links:

- `/tools/malware-scanner/`, `/tools/redirect-checker/`, `/tools/blacklist-checker/`
- `/htaccess-redirect-generator/`, `/robots-txt-generator-validator/`
- `/base64-encoder-decoder/`, `/password-strength-checker/`
- `/fix/fix-hacked-wordpress-site/`, `/fix/hacked-wordpress-site/`

Sitemap URLs (19): love calculator, input-output games, BMI calculator, tip calculator,
image converter, image compressor, placeholder generator, photo placeholder converter, PDF
merger, images-to-PDF, PDF extract, PDF delete, Sleep Calculator, best-free-online-tools,
utility-tools, and the four newer utility tools.

Internal link risks:

- Absolute links to `https://tasklytools.org/...` bypass staging/preview environments.
- Broken `/security-tools` and `/fix-website` links.
- Root-relative links in new pages work at the domain root but not under a subpath preview
  such as `/tasklytools.github.io/preview/`.
- The search page hard-codes absolute production URLs.

---

## 14. What must be preserved vs. what can be reused

Must preserve unchanged:

- All existing files and directories, including WordPress, plugin, upload, JSON API, and
  Cloudflare artifacts.
- `CNAME`, `_config.yml`, `.htaccess`, `robots.txt`, `sitemap.xml`, `404.html`.
- `index-old.html` as the reference snapshot.
- Existing navigation and footer source files (`navbar.html`, `footer.html`, `nav.js`,
  `footer-script.js`, `pre-load.html`).
- Existing CSS, JS, images, and tool pages.

Can be reused without modification:

- The navbar/footer injection contract: `#navbar-container`, `#footer-container`,
  `#pre-load-animation`, `#myBtn`.
- `nav.js` and `footer-script.js` loaded as-is by new pages.
- Existing logo, favicons, and image assets by URL.
- Bootstrap 4.6.2 and Bootstrap Icons from the existing theme folders.
- `assets/tools/toolkit.css` and `assets/tools/toolkit.js` as the base for new tools.
- The standalone tool pattern (`index.html` + `app.js` + `logic.js` per tool folder).
- Existing legal page URLs, while adding new versions under new paths if content changes.

Recommended for new work:

- A new isolated namespace (for example `next/`) containing all new pages and assets.
- A new shared layout CSS/JS that does not override the old theme globally.
- New JSON data files for tool catalogs and product catalogs.
- New legal pages under new filenames if the existing legal text must change.

---

## 15. Key findings and blockers

Findings:

1. The site is a captured WordPress installation, not a clean static codebase.
2. Navigation and footer are runtime-injected partials with a simple, reusable contract.
3. Navigation contains two broken links and conflicting search behavior.
4. The root homepage is missing from the working tree, while still present in `HEAD`.
5. The working tree is already dirty with 103 modifications and a deleted `index.html`.
6. The sitemap does not cover all existing pages and will not cover new pages automatically.
7. SEO on legacy pages includes off-domain and mismatched canonical/OG values.
8. The newer tool pattern is clean, accessible, dependency-light, and suitable to extend.
9. `footer-script.js` requests a missing `sidebar-top.html` file.
10. The preloader depends on `window.load`; slow third-party fonts can delay or hide content.

Blockers requiring owner decisions:

- How to launch a new homepage without creating or overwriting root `index.html`.
- Whether new tools may use `index.html` inside brand-new directories.
- Whether the existing dirty working tree should be preserved as-is or committed/backed up
  before Phase 1.
- Whether the new platform lives at the domain root, a subdirectory, or a subdomain during
  development.
- Email, checkout, analytics, and consent provider choices.
- Whether legacy security-service content remains, redirects, or is retired.

See `DEVELOPMENT_ROADMAP.md` and `PRESERVATION_RULES.md` for proposed handling.
