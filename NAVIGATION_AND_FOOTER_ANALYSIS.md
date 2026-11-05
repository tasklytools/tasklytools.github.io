# TasklyTools.org - Navigation and Footer Analysis

Read-only analysis of the existing navigation and footer, how they work, and how new pages can
reuse them without modifying any existing file.

Sources inspected:

- `index-old.html`
- `navbar.html`
- `footer.html`
- `nav.js`
- `footer-script.js`
- `pre-load.html`
- `wp-content/themes/aj-square/assets/css/style.css`
- `wp-content/themes/aj-square/assets/js/script.js`
- `wp-content/themes/aj-square/assets/js/bootstrap.bundle.min.js`
- `base64-encoder-decoder/index.html` (example of a newer page using the same partials)

---

## 1. How the components are assembled

The existing site does not put the navbar and footer directly in each HTML file. Instead:

1. The page contains empty placeholder elements.
2. A script fetches an HTML partial.
3. The partial is injected with `innerHTML`.
4. CSS and JavaScript then enhance the injected markup.

Homepage skeleton from `index-old.html`:

```html
<div id="pre-load-animation"></div>
<button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>

<header class="container-fluid sticky-top" id="main-header">
    <div id="navbar-container"></div>
</header>

...

<footer class="container-fluid footer-section pt-5 pb-3">
    <div id="footer-container"></div>
</footer>

<script src="/footer-script.js" defer></script>
<script src="/nav.js" defer></script>
<script src="/wp-content/themes/aj-square/assets/js/script.js?ver=1.1.0" defer></script>
<script src="/wp-content/themes/aj-square/assets/js/bootstrap.bundle.min.js?ver=4.6.2" defer></script>
```

Required placeholder contract:

| Element ID / class | Purpose | Required |
| --- | --- | --- |
| `#pre-load-animation` | Target for `pre-load.html` | Recommended |
| `#main-header` | Sticky header wrapper, height measurement, hide/show | Yes |
| `#navbar-container` | Target for `navbar.html` | Yes |
| `#footer-container` | Target for `footer.html` | Yes |
| `.footer-section` | Footer styling hook | Yes |
| `#myBtn` | Back-to-top button | Optional, but styled by existing CSS |
| `#credit-footer` | Footer credit bar styling | Inside partial |

---

## 2. Navigation structure

Source file: `navbar.html` (34 lines).

```html
<nav class="navbar navbar-expand-lg navbar-dark w-100" style="position:relative;z-index:9999;">
  <div class="container-fluid">
    <a class="navbar-brand custom-logo-widget" href="https://tasklytools.org/">
      <img src="/wp-content/uploads/2025/05/taskly-tools.png" alt="Pixel Radar Online" width="125" height="125">
    </a>
    <button class="navbar-toggler" type="button" id="navbarToggler" aria-label="Toggle navigation"
      onclick="document.getElementById('navbarSupportedContent').classList.toggle('show');">
      <i class="bi bi-list"></i>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul id="menu-primary" class="navbar-nav ms-auto" ...>
        <li ...><a href="https://tasklytools.org/" class="nav-link">Home</a></li>
        <li ...><a href="https://tasklytools.org/security-tools" class="nav-link">Security Tools</a></li>
        <li ...><a href="https://tasklytools.org/fix-website" class="nav-link">Fix Website</a></li>
        <li ...><a href="https://tasklytools.org/utility-tools" class="nav-link">Utility Tools</a></li>
        <li class="... dropdown"><a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Blog</a>
          <ul class="dropdown-menu">
            <li ...><a href="https://tasklytools.org/category/free-tools" class="nav-link">Free Tools</a></li>
          </ul>
        </li>
      </ul>
      <div class="nav-item nav-search">
        <a class="nav-link" href="/search.html" id="searchIcon" aria-label="Search">
          <i class="bi bi-search"></i>
        </a>
      </div>
    </div>
  </div>
  <div class="nav-item" id="searchForm" style="display: none;">
    <form role="search" method="get" class="search-form" action="https://tasklytools.org/">
      <input type="search" class="search-field" placeholder="Search &hellip;" value="" name="s" />
      <button type="submit" class="search-submit"><i class="bi bi-search"></i></button>
    </form>
  </div>
</nav>
```

### Navigation links and observed status

| Label | Target | Status |
| --- | --- | --- |
| Home | `https://tasklytools.org/` | Works when root homepage is deployed |
| Security Tools | `https://tasklytools.org/security-tools` | Broken: no such directory; real page is `/tools/` |
| Fix Website | `https://tasklytools.org/fix-website` | Broken: no such directory; real content is `/fix/...` |
| Utility Tools | `https://tasklytools.org/utility-tools` | Works (directory index) |
| Blog | `#` with dropdown | Opens dropdown only |
| Free Tools | `https://tasklytools.org/category/free-tools` | Works |
| Search icon | `/search.html` | Works via `nav.js` redirect |
| Search form | `https://tasklytools.org/?s=` | Non-functional on static hosting |

Absolute production URLs mean the navbar points at production even when a page is previewed
on `github.io` or locally.

---

## 3. Navigation behavior and controlling functions

### 3.1 Navbar injection

`nav.js` lines 73-80:

```js
fetch(basePath + "/navbar.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar-container").innerHTML = html;
    initStickyHeader();
    initNavbarInteractions();
  })
  .catch(err => console.error("Error loading navbar:", err));
```

`footer-script.js` lines 38-41 performs a second fetch and injection on `DOMContentLoaded`.

Consequences:

- The navbar is fetched twice per page load.
- `nav.js` attaches sticky and interaction behavior only after its own fetch resolves.
- `footer-script.js` can replace the navbar DOM after `nav.js` has attached behavior, which
  can leave listeners stale. The markup is identical, so visual behavior usually survives, but
  the design is fragile.
- Both files are required today for the full experience (preloader + sticky behavior).

### 3.2 Sticky / hide-on-scroll header

`nav.js` lines 3-41, `initStickyHeader()`:

- Reads `#main-header` height and writes `--header-h` CSS variable.
- Adds `body.has-fixed-header`, which applies `padding-top: var(--header-h, 72px)`.
- On scroll:
  - `y > 10` adds `is-stuck` (shadow).
  - `y > 80` and scrolling down adds `is-hidden` (translateY(-100%)).
  - Scrolling up removes `is-hidden`.
- Uses `requestAnimationFrame` and a passive scroll listener.

CSS: `#main-header`, `#main-header.is-hidden`, `#main-header.is-stuck`,
`body.has-fixed-header` in `style.css` around lines 671-693.

### 3.3 Mobile toggle

Two mechanisms coexist:

1. Inline `onclick` on `#navbarToggler` toggles the `show` class on
   `#navbarSupportedContent`.
2. `script.js` lines 16-21 attaches another click listener that also toggles `show`.

CSS at the end of `style.css`:

```css
@media (max-width: 991px) {
  #navbarToggler { display: block !important; }
  #navbarSupportedContent { display: none !important; }
  #navbarSupportedContent.show { display: block !important; }
}
@media (min-width: 992px) {
  #navbarToggler { display: none !important; }
  #navbarSupportedContent { display: flex !important; }
}
```

`#navbarSupportedContent` also has max-height transition rules around lines 566-577.

### 3.4 Dropdown

- Markup uses Bootstrap 4 dropdown classes and `data-bs-toggle="dropdown"`.
- Bootstrap 4 actually expects `data-toggle`, not `data-bs-toggle` (Bootstrap 5 syntax).
- Desktop hover is handled by CSS:
  `.navbar-nav .dropdown:hover > .dropdown-menu` displays the menu.
- No dedicated JavaScript dropdown handler was found in `nav.js` or `footer-script.js`.
- Result: hover works on desktop via CSS; click behavior depends on Bootstrap version
  compatibility and is inconsistent on touch devices.

### 3.5 Search behavior

Two conflicting handlers target `#searchIcon`:

- `nav.js` lines 82-86: sets `window.location.href = "search.html"`.
- `script.js` lines 4-23 and 25-32: toggles the hidden `#searchForm`.
- `script.js` also toggles again through a second listener.

Because `nav.js` assigns `location.href`, the redirect usually wins. The hidden form is
effectively dead behavior on static hosting.

### 3.6 Back to top

- `#myBtn` has inline `onclick="topFunction()"`.
- `nav.js` lines 43-60 adds a click listener that calls `window.scrollTo({top:0})`.
- `script.js` lines 38-62 contains duplicate scroll logic.
- `#myBtn` CSS is around `style.css` lines 250-266.
- `topFunction` itself is not defined in the reviewed files; the inline handler may throw.
  The `nav.js` listener still works.

### 3.7 Smooth anchor scrolling

`nav.js` lines 62-70 intercepts all `a[href^="#"]` and smooth-scrolls to the target. This
includes the Blog dropdown toggle (`href="#"`), where `preventDefault()` is called and the
target lookup fails. This can interfere with dropdown behavior.

### 3.8 Preloader

`footer-script.js` lines 4-35 fetches `pre-load.html`, injects it into
`#pre-load-animation`, sets the logo, then hides the loader on `window.load` after 800 ms,
with a 3-second fallback.

`pre-load.html`:

```html
<div id="app-boot-bg-loader" class="pre-load-animation">
  <div class="border-glow-wrapper">
    <div class="linkedin-image">
      <img id="dynamic-logo" src="" alt="Site Logo" />
      <div class="loading-bar"><div class="blue-bar"></div></div>
    </div>
  </div>
</div>
```

CSS: `#app-boot-bg-loader` and `.hide` around `style.css` lines 115-126.

Risk: it depends on `window.load`, which waits for third-party fonts and images. If the
script fails, the loader can cover content until the fallback runs.

---

## 4. Navigation CSS classes and assets

Required stylesheets for the existing navbar appearance:

- `/wp-content/themes/aj-square/style.css`
- `/wp-content/themes/aj-square/assets/css/style.css`
- `/wp-content/themes/aj-square/assets/css/bootstrap.min.css`
- `/wp-content/themes/aj-square/assets/bootstrap-icons/bootstrap-icons95a1.css`
- `/wp-content/themes/aj-square/assets/css/toolsf269.css` (legacy tool pages)
- Google Fonts Roboto (`https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap`)

Navbar-related selectors in `style.css`:

- `.navbar`, `.navbar.sticky-top`, `.navbar-brand`, `.navbar-nav`, `.navbar-collapse`
- `.navbar-collapse li`, `.navbar-collapse li a`
- `#navbarSupportedContent`, `#navbarSupportedContent.show`
- `.navbar-nav .dropdown-menu`, `.navbar-nav .dropdown:hover > .dropdown-menu`
- `.navbar-nav .dropdown > a::after` (custom caret)
- `.dropdown-item:hover`, `ul.dropdown-menu li`
- `.navbar-toggler`, `.navbar-toggler i`, `#navbarToggler`
- `.nav-item`, `.nav-item.nav-search`
- `#main-header`, `.is-stuck`, `.is-hidden`, `body.has-fixed-header`
- `#myBtn`
- `#searchForm`, `form.search-form`

Logo asset:

- `/wp-content/uploads/2025/05/taskly-tools.png`

Note: the logo `alt` text is "Pixel Radar Online", a leftover from a previous site. It is an
accessibility/SEO defect but must not be fixed in the existing file.

---

## 5. Footer structure

Source file: `footer.html` (63 lines).

```
footer.footer-section
  #footer-container
    .container
      .row
        .col-sm-12
          #block-29.widget
            .wp-block-columns.row.top-footer
              column 1: "Taskly Tools" + description
              column 2: "Quick Links"
                - /tools/malware-scanner/
                - /fix/fix-hacked-wordpress-site/
                - /utility-tools/
              column 3: "Contact"
                - Email: [email protected] (Cloudflare-obfuscated)
                - WhatsApp: +880684-618959
              column 4: "Legal"
                - /about-us/
                - /contact-us/
                - /privacy-policy/
                - /disclaimer/
                - /terms-and-conditions/
    hr
    section#credit-footer
      copyright: "(c) 2026 - Taskly Tools Org. All rights reserved."
      social icons:
        - https://www.facebook.com/tasklytools
        - https://x.com/tasklytools
```

### Footer links

| Label | Target | Notes |
| --- | --- | --- |
| Malware Scanner | `/tools/malware-scanner/` | Root-relative, works |
| Fix Hacked Site | `/fix/fix-hacked-wordpress-site/` | Root-relative, works |
| Utility Tools | `/utility-tools/` | Root-relative, works |
| About Us | `/about-us/` | Root-relative, works |
| Contact Us | `/contact-us/` | Root-relative, works |
| Privacy Policy | `/privacy-policy/` | Root-relative, works |
| Disclaimer | `/disclaimer/` | Root-relative, works |
| Terms & Conditions | `/terms-and-conditions/` | Root-relative, works |
| Facebook | `https://www.facebook.com/tasklytools` | External, `rel="noopener noreferrer"` |
| X | `https://x.com/tasklytools` | External, `rel="noopener noreferrer"` |

Footer links are root-relative, so they resolve correctly from nested new pages served at the
domain root.

---

## 6. Footer behavior and controlling functions

- `footer-script.js` lines 73-76 fetch `footer.html` and inject it into `#footer-container`.
- No footer-specific JavaScript behavior exists beyond injection.
- `footer-script.js` also fetches:
  - `pre-load.html` (present)
  - `navbar.html` (duplicate with `nav.js`)
  - `sidebar.html` (present)
  - `sidebar-top.html` (missing; logs an error)
- Footer styling lives in `style.css`:
  - `footer.footer-section h2`, `li`, `a`, `a:hover`
  - `.footer-social-icons a`
  - `a.social-icon`, `a.social-icon:hover`
  - `#credit-footer`
- Footer background color is not defined in the reviewed footer rules; it depends on the
  global theme/tool CSS and page context. New pages must check contrast after integration.

---

## 7. Reuse plan for new pages

### 7.1 Required skeleton

Every new page should include:

```html
<body class="tt-next">
  <div id="pre-load-animation"></div>
  <button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>

  <header class="container-fluid sticky-top" id="main-header">
    <div id="navbar-container"></div>
  </header>

  <main>
    <!-- new page content -->
  </main>

  <footer class="container-fluid footer-section pt-5 pb-3">
    <div id="footer-container"></div>
  </footer>
</body>
```

### 7.2 Required assets

Load the existing assets unchanged:

```html
<link rel="stylesheet" href="/wp-content/themes/aj-square/style.css?ver=1.0.0">
<link rel="stylesheet" href="/wp-content/themes/aj-square/assets/css/style.css?ver=1.0.0">
<link rel="stylesheet" href="/wp-content/themes/aj-square/assets/css/bootstrap.min.css?ver=4.6.2">
<link rel="stylesheet" href="/wp-content/themes/aj-square/assets/bootstrap-icons/bootstrap-icons95a1.css?ver=1.10.5">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap">
<link rel="stylesheet" href="/assets/tools/toolkit.css?ver=1.0.0">
<link rel="stylesheet" href="/next/assets/site.css">
```

```html
<script src="/footer-script.js" defer></script>
<script src="/nav.js" defer></script>
<script src="/wp-content/themes/aj-square/assets/js/script.js?ver=1.1.0" defer></script>
<script src="/wp-content/themes/aj-square/assets/js/bootstrap.bundle.min.js?ver=4.6.2" defer></script>
<script src="/assets/tools/toolkit.js?ver=1.0.0" defer></script>
```

`/next/assets/site.css` is a new file in the new namespace. It must not modify the originals.
It should scope any overrides under `.tt-next`.

### 7.3 Do not

- Do not copy and edit `navbar.html` or `footer.html`.
- Do not inline a new navbar that diverges from the existing one.
- Do not change `nav.js` or `footer-script.js`.
- Do not add new global CSS variables that affect legacy pages.
- Do not load new scripts on legacy pages.

### 7.4 If new navigation items are needed

The existing navbar has no links to the new platform pages (Tools directory, Templates,
Pricing, About, Contact). Options, in order of preservation safety:

1. **Additive new partial (recommended).** Create `next/partials/navbar.html` and
   `next/assets/nav.js` that render the same design plus new items. Old pages keep using the
   old partial. This technically diverges but never touches existing files. The owner should
   approve because it means two navbars.
2. **Enhance injected DOM.** A new script in the new namespace waits for `#navbar-container`
   to be populated, then adds new menu items and rewires mobile behavior. No existing file
   changes, but the DOM is mutated at runtime and may be fragile.
3. **Owner-approved edit to `navbar.html`.** Cleanest long-term, but currently prohibited.

Recommendation: option 1 for Phase 1, with a later owner-approved consolidation.

---

## 8. Known defects to design around (not fix in Phase 0)

1. Broken nav links `/security-tools` and `/fix-website`.
2. Search icon has conflicting redirect and toggle behavior.
3. Hidden search form posts to WordPress `?s=` on a static site.
4. Duplicate navbar injection from two scripts.
5. `sidebar-top.html` is missing, causing a console error on every page.
6. Bootstrap 4 is loaded, but dropdown markup uses Bootstrap 5 `data-bs-toggle`.
7. Inline `topFunction()` is undefined in reviewed files.
8. Smooth-scroll handler intercepts `href="#"` dropdown toggles.
9. Logo alt text says "Pixel Radar Online".
10. Footer contact email is obfuscated to `[email protected]`.
11. Root homepage missing from working tree.
12. Absolute production URLs break staging/preview navigation.

New pages should not depend on the broken behaviors. For example, do not rely on the hidden
search form; link to `/search.html` explicitly if search is needed, and plan a new search
implementation under the new namespace later.

---

## 9. Verification checklist for new pages

- [ ] `#navbar-container` becomes populated on load.
- [ ] `#footer-container` becomes populated on load.
- [ ] Logo and icons render.
- [ ] Mobile hamburger opens and closes the menu.
- [ ] Blog dropdown is reachable by keyboard and touch.
- [ ] Sticky header hides on scroll down and returns on scroll up.
- [ ] Content is not hidden under the fixed header (`--header-h` applied).
- [ ] Footer links resolve from a nested page.
- [ ] Preloader disappears within 3 seconds.
- [ ] No console errors beyond the known missing `sidebar-top.html`.
- [ ] No existing file shows as modified in `git status`.
