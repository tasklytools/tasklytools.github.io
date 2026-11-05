# TasklyTools.org - Development Roadmap

Phase 0 is complete. No website implementation has started. This roadmap defines the safe
sequence for later phases, the revenue architecture, and the risks that must be resolved
before build work begins.

---

## 1. Non-negotiable constraints

- Preserve every existing file and directory.
- Do not create or overwrite root `index.html`.
- Do not modify existing navigation, footer, CSS, JavaScript, assets, or configuration.
- Do not change GitHub Pages or custom domain settings.
- Do not deploy without explicit approval.
- Do not commit or push without explicit approval.
- Static-first: HTML5, CSS3, vanilla JavaScript, GitHub Pages compatible.

See `PRESERVATION_RULES.md` for the binding checklist.

---

## 2. Phase overview

| Phase | Goal | Output | Gate |
| --- | --- | --- | --- |
| 0 | Audit and safe planning | Five documentation files | Complete |
| 1 | Foundation and design system | New `/next/` shell, tokens, components, homepage, nav/footer reuse | Owner approves namespace and index strategy |
| 2 | Core tools MVP | Invoice, Profit, Freelance Rate, Proposal, UTM Builder | Each tool passes accuracy and accessibility checks |
| 3 | Directory and SEO | Tools directory, categories, metadata, sitemap, internal linking | Canonicals and structured data verified |
| 4 | Revenue foundation | Pricing, templates marketplace, hosted checkout, affiliate disclosures | Checkout and legal pages approved |
| 5 | Subscription and ads | Membership funnel, consent management, ad slots | Traffic and policy thresholds met |
| 6 | Migration | Promote new platform to root, redirects, old content plan | Explicit owner approval and rollback plan |

Do not skip gates. Do not start Phase 1 until the blockers in Section 8 are resolved.

---

## 3. Phase 1 - Foundation and design system

Objectives:

- Establish the new visual system without touching legacy CSS.
- Validate that the existing navbar and footer can be reused unchanged.
- Ship a staging homepage and a single reference tool page.

Tasks:

1. Create `/next/` namespace.
2. Create `tokens.css` with colors, spacing, typography, radii, shadows, and breakpoints.
3. Create `site.css` and `components.css`, scoped under `.tt-next`.
4. Create `home.html` with:
   - Existing navbar/footer placeholders.
   - Business positioning for freelancers, small businesses, creators, marketers, and
     entrepreneurs.
   - Tool highlights, trust signals, and a primary CTA.
5. Build one reference tool page (recommended: Invoice Generator) to prove the pattern.
6. Add accessibility basics: skip link, focus states, labels, status regions, reduced-motion
   support.
7. Add page metadata: title, description, canonical, OG, Twitter, JSON-LD.
8. Verify navbar/footer injection, mobile menu, sticky behavior, and preloader.
9. Record `git status` before and after; confirm no existing file changed.

Acceptance criteria:

- New pages render correctly at mobile, tablet, and desktop widths.
- Navbar and footer match the existing design and behavior.
- No horizontal overflow, no content hidden under the fixed header.
- No new dependency required for the shell.
- `git status` shows only new files under `/next/` and the docs.

---

## 4. Phase 2 - Core tools MVP

Order by business value and implementation risk:

1. Invoice Generator (business, high intent).
2. Profit Calculator (business, simple math, strong SEO).
3. Freelance Rate Calculator (freelancer, strong audience fit).
4. UTM Builder (marketing, simple, shareable).
5. Proposal Generator (freelancer, template-based, more UX work).

For each tool:

- Write `logic.js` as pure functions with explicit inputs and outputs.
- Write `app.js` for DOM binding and formatting.
- Validate edge cases: empty input, zero, negative values, very large values, decimals,
  currency formatting, locale.
- Add "How it works", "Formula", "Example", and "FAQ" content for SEO.
- Add a privacy note stating that processing is local.
- Add copy/download/print actions using `TasklyToolkit`.
- Add related-tool links.
- Add tests or a manual test checklist. Prefer a small browser-based test harness if no test
  runner is approved.

Acceptance criteria:

- Calculations are correct and documented.
- No data leaves the browser for core features.
- Keyboard-only use works.
- Outputs are copyable and downloadable.
- Each page has unique metadata and structured data.

---

## 5. Phase 3 - Directory and SEO

Tasks:

1. Build `/next/tools/` directory with search/filter by category.
2. Build category pages: business, freelancer, marketing, utility.
3. Add breadcrumbs and internal linking between related tools.
4. Add a new sitemap for new pages.
5. Audit titles, descriptions, canonicals, and structured data.
6. Add Organization and WebSite schema to the new homepage.
7. Add SoftwareApplication or WebApplication schema to tool pages.
8. Add FAQPage schema only where the FAQ is genuinely on the page.
9. Ensure no duplicate titles or descriptions.
10. Plan redirects for any future URL changes.

Acceptance criteria:

- Every new page is reachable from the homepage in three clicks or fewer.
- Every new page has a canonical and social metadata.
- The new sitemap validates.
- No broken internal links in the new namespace.

---

## 6. Phase 4 - Revenue foundation

### 6.1 Free browser-based tools

- Core tools remain free and client-side.
- No login required.
- No upload to a server.
- Monetization is indirect: traffic, trust, email list, affiliate clicks, and upgrades.

### 6.2 Premium downloadable products

- Sell templates, spreadsheets, document packs, and toolkits.
- Deliver files through the checkout provider or a verified backend that issues short-lived access.
- Hosted checkout is strongly preferred: Gumroad, Lemon Squeezy, Paddle, or Payhip.
- Avoid building a custom payment backend.
- If files are hosted in the repository, they are publicly accessible. Do not rely on
  obscurity for paid files. Use the provider's file delivery or a private storage bucket.

### 6.3 Hosted checkout

- Checkout links are static URLs in `products.json`.
- No card data touches the site.
- Provider handles tax, receipts, refunds, and fraud where possible.
- Required pages: success, cancel, refund policy, terms, privacy.

### 6.4 Future subscription features

- Requires an external billing provider and, for gated content, authentication.
- Static-only options: provider-hosted member area, magic-link gating, or a separate
  authenticated app.
- Do not build custom auth or billing unless there is a clear requirement and budget.
- Distinguish clearly between "static site" and "hosted membership platform".

### 6.5 Affiliate recommendations

- Static recommendation blocks with tracked links.
- Add `rel="sponsored nofollow"` where appropriate.
- Add a visible affiliate disclosure on every page with affiliate links.
- Track clicks with the affiliate network or a lightweight analytics event.
- Do not make unsupported income or performance claims.

### 6.6 Display advertisements

- AdSense, Ezoic, or Mediavine after traffic thresholds are met.
- Requires consent management in applicable regions.
- Ads add third-party scripts, performance cost, and policy risk.
- Use reserved ad slots to avoid layout shift.
- Do not place ads on checkout, legal, or low-content pages.

### 6.7 Feature classification

| Feature | Browser-only | External service | Backend required |
| --- | --- | --- | --- |
| Invoice Generator | Yes | No | No |
| Profit Calculator | Yes | No | No |
| Freelance Rate Calculator | Yes | No | No |
| Proposal Generator (template) | Yes | No | No |
| UTM Builder | Yes | No | No |
| Premium file delivery | No | Yes (checkout provider) | No |
| Hosted checkout | No | Yes | No |
| Subscription billing | No | Yes | Usually yes for gating |
| Member-only content | No | Yes | Usually yes |
| Affiliate links | Yes | Yes (network) | No |
| Display ads | No | Yes (ad network) | No |
| Email capture | No | Yes (email provider) | No |
| Contact form | No | Yes (form provider) | No |
| Analytics | No | Yes | No |
| AI proposal generation | No | Yes (paid API) | Usually yes |

---

## 7. Phase 5 - Subscription and ads

Only after Phase 4 is stable and traffic justifies the cost.

Tasks:

1. Choose a billing provider that supports subscriptions and tax handling.
2. Define free vs. premium boundaries.
3. Implement gated downloads through the provider where possible.
4. Add consent management before enabling ads or non-essential analytics.
5. Add ad slots with fixed dimensions.
6. Monitor Core Web Vitals and revenue per session.
7. Add cancellation, refund, and support flows.

Acceptance criteria:

- No card data is stored or processed by the site.
- Consent is collected where required.
- Ads do not break layout or accessibility.
- Subscription cancellation is clear and accessible.

---

## 8. Blockers and required decisions

| ID | Blocker | Why it matters | Recommended resolution |
| --- | --- | --- | --- |
| B1 | Root `index.html` is absent from the working tree but protected in `HEAD` | The new homepage cannot be served at `/` without creating or overwriting a protected file | Build under `/next/home.html`; request explicit approval for a root migration with backup and rollback |
| B2 | Pre-existing dirty tree (103 modified, 1 deleted, 15 untracked) | Risk of mixing owner changes with new work | Owner backs up or commits the baseline on a separate branch before Phase 1 |
| B3 | Broken existing nav links (`/security-tools`, `/fix-website`) | New pages may inherit broken navigation | Do not fix originals; use additive nav for new pages or get approval to edit `navbar.html` |
| B4 | New nav items cannot be added without editing or forking the navbar | New platform needs Tools, Templates, Pricing, About | Create an additive navbar partial under `/next/` with owner approval |
| B5 | Checkout, email, analytics, and consent providers undecided | Revenue and compliance depend on them | Decide before Phase 4 |
| B6 | No defined staging vs. production canonical strategy | SEO duplication risk | Use staging `noindex` and switch canonicals at launch |
| B7 | Existing content includes unrelated topics | Brand and SEO dilution | Keep legacy pages live; do not delete; plan a separate content review |
| B8 | No test tooling approved | Tool correctness risk | Use pure `logic.js` functions plus a minimal browser test page, or approve a lightweight runner |

---

## 9. Technical risk register

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Accidental modification of an existing file | Medium | High | New namespace, `git status` checks, no repo-wide commands |
| Root homepage remains broken | High | High | Resolve B1 before launch |
| Duplicate navbar fetch causes intermittent behavior | Medium | Medium | Reuse as-is in Phase 1; avoid depending on event listeners attached before the second injection |
| Global CSS from the theme leaks into new pages | High | Medium | Scope new styles under `.tt-next`; test legacy pages after adding CSS |
| New CSS overrides legacy pages | Medium | High | Never edit global CSS; scope selectors; review `git diff` |
| Broken nav links inherited | High | Medium | Additive nav or owner-approved fix |
| Preloader hides content on slow connections | Medium | Medium | Ensure the 3-second fallback; test throttled |
| Third-party fonts/ads hurt Core Web Vitals | High | Medium | Self-host or limit fonts; lazy-load ads; measure |
| Jekyll processing breaks new pages | Low | Medium | Plain HTML, no Liquid, test on GitHub Pages preview |
| GitHub Pages caching serves stale CSS/JS | Medium | Low | Version query strings |
| Paid files publicly downloadable from repo | Medium | High | Use provider delivery, not repo-hosted paid files |
| Affiliate/ads compliance gaps | Medium | High | Disclosures, consent, policy review |
| SEO duplication between old and new pages | High | Medium | Canonicals, `noindex` during staging, redirect plan |
| Currency/locale errors in calculators | Medium | Medium | Explicit formatting rules and tests |
| Accessibility regressions | Medium | Medium | Labels, focus, contrast, keyboard tests |

---

## 10. Recommended development sequence

1. Resolve blockers B1 and B2 with the owner.
2. Approve the `/next/` namespace and the nav strategy (B4).
3. Record a clean baseline of `git status`.
4. Build the Phase 1 shell and reference tool.
5. Validate navbar/footer reuse on a nested page.
6. Build tools in the order listed in Phase 2.
7. Add the directory and SEO layer.
8. Add pricing, marketplace, and hosted checkout.
9. Add affiliate disclosures and, later, ads and subscriptions.
10. Plan the root migration with redirects, backup, and rollback.
11. Deploy only after explicit approval.

---

## 11. Definition of done for any phase

- All new files are in new paths.
- `git status` shows no unexpected modifications or deletions.
- No existing file was renamed, moved, or overwritten.
- Navigation and footer behave consistently with the existing site.
- New pages are responsive, accessible, and SEO-complete.
- No unnecessary dependencies were added.
- No secrets or paid API keys are in the repository.
- The owner has reviewed and approved the phase output.
- No commit, push, or deploy happened without explicit approval.

---

## 12. Questions for the owner

1. Can the new platform be built under `/next/` first?
2. Is creating `index.html` inside a brand-new directory acceptable, or should all new pages
   use explicit `.html` filenames?
3. Who will approve the eventual root `index.html` migration, and what is the rollback plan?
4. Should the existing dirty working tree be committed or backed up before Phase 1?
5. Should new navigation be additive (new partial) or should the existing `navbar.html` be
   edited with approval?
6. Which checkout provider and email provider are preferred?
7. Is there an existing brand guide, logo variant, or color palette for the new platform?
8. Should legacy security-service content remain prominent, be de-emphasized, or be moved?
9. What is the launch priority: tools first, templates first, or homepage first?
10. Are there legal entity, tax, refund, or privacy requirements that must shape checkout and
    policy pages?
