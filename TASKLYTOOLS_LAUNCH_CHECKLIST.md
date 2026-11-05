# TasklyTools Launch Checklist

- Prepared: 2026-11-05
- Phase: Phase 6 content, positioning, and pre-launch QA
- Current status: **Not ready for paid checkout launch**
- Free tools, guides, resource, and product preview pages: ready for final owner review
- Paid checkout and file delivery: intentionally not connected

---

## 1. Launch gate

Do not announce paid checkout, enable live checkout, or accept payment until every item in
this section is complete.

- [ ] Lemon Squeezy account is approved and able to receive payouts
- [ ] Store slug is final and entered in `tasklytools-new-assets/js/products-config.js`
- [ ] Each product has a real Lemon Squeezy product ID and variant ID
- [ ] Checkout mode is `"test"` for the first end-to-end test
- [ ] Test checkout completes with a Lemon Squeezy test order
- [ ] Test receipt arrives and contains the correct product name and price
- [ ] Test delivery grants access to the correct ZIP file and nothing else
- [ ] Success and cancelled return URLs are configured in Lemon Squeezy
- [ ] Checkout button changes from "not connected" to the correct test/live state
- [ ] Product structured data changes from `PreOrder` to `InStock` only in live mode
- [ ] Checkout mode is switched to `"live"` only after test checkout passes
- [ ] One real low-value purchase is completed and refunded or accounted for
- [ ] Product files are uploaded to Lemon Squeezy, not linked from the public site

**Current values:** `settings.lemonSqueezy.storeSlug` is blank, and every product
`lemonSqueezy.productId` and `lemonSqueezy.variantId` is blank. No payment can be taken.

---

## 2. Products and pricing

| Product | Price | Status | Public files |
| --- | --- | --- | --- |
| Freelancer Business Toolkit | $29 USD | Preview ready; checkout disconnected | Cover and preview PNG only |
| Small Business Profit & Finance Toolkit | $39 USD | Preview ready; checkout disconnected | Cover and preview PNG only |
| Freelance Proposal & Client Acquisition Toolkit | $29 USD | Preview ready; checkout disconnected | Cover and preview PNG only |

- [ ] Confirm all three prices are final
- [ ] Confirm all three product names are final
- [ ] Confirm each product page lists the same files as the private ZIP
- [ ] Confirm each ZIP is intact and contains no extra files
- [ ] Confirm the licence terms are correct for each product
- [ ] Confirm refund and support terms are stated clearly

Private deliverables currently live outside the public site:

`/mnt/d/Github/tasklytools-private-deliverables/downloads/`

Current inventory: 26 files across three product folders, including three ZIP packs.
All three ZIPs passed integrity checks during Phase 5.

---

## 3. Checkout and delivery honesty

- [ ] Buy buttons still say checkout is not connected while IDs are blank
- [ ] No page claims a payment was taken, completed, or verified
- [ ] No page unlocks files or creates access from a return URL
- [ ] Success return page remains `noindex, follow`
- [ ] Cancelled return page remains `noindex, follow`
- [ ] Checkout return pages never replace a Lemon Squeezy receipt
- [ ] No public `/products/downloads/` folder exists
- [ ] No paid ZIP, DOCX, XLSX, or PDF is linked from public HTML
- [ ] No private deliverable path is referenced in public HTML or JavaScript
- [ ] Lemon Squeezy native file delivery is used instead of public links
- [ ] Checkout URL validation accepts only official Lemon Squeezy checkout URLs
- [ ] Product structured data uses `PreOrder` until live checkout is verified
- [ ] Marketplace copy does not imply that checkout is already live

**Verified in Phase 5:** checkout is disconnected, all checkout attempts show a no-payment
message, return pages do not unlock files, and no public paid-file links were found.

---

## 4. Functional QA

- [ ] Invoice Generator: valid invoice prints correctly
- [ ] Invoice Generator: required fields and due-date ordering block printing
- [ ] Invoice Generator: invalid optional email addresses block printing
- [ ] Invoice Generator: item errors clear after the item is corrected
- [ ] Profit Calculator: gross profit, net profit, tax, and break-even are correct
- [ ] Profit Calculator: loss state and unavailable break-even state are correct
- [ ] Freelance Rate Calculator: income, tax, expenses, buffer, and utilization are correct
- [ ] Freelance Rate Calculator: tax is capped at 99% and utilization validation works
- [ ] Proposal Generator: generation, editing, copy, print, and reset work
- [ ] Proposal Generator: invalid optional email addresses block generation
- [ ] UTM Builder: valid links, existing UTM replacement, and required fields work
- [ ] UTM Builder: non-HTTP URLs are rejected
- [ ] Home search, directory search, category filters, and clear filters work
- [ ] Product marketplace renders three products and three checkout states
- [ ] Newsletter validates locally and never claims a stored signup
- [ ] No-JavaScript fallbacks list the tools and products

---

## 5. Browser and device QA

Automated DOM and logic checks pass, but no graphical browser was available in this phase.

- [ ] Test on current Chrome on desktop
- [ ] Test on current Firefox on desktop
- [ ] Test on current Safari on macOS or iOS
- [ ] Test on a mid-range Android phone
- [ ] Test on a small iPhone viewport
- [ ] Test keyboard-only navigation through each tool
- [ ] Test print output for invoice and proposal
- [ ] Test copy buttons on HTTP fallback and HTTPS
- [ ] Test with JavaScript disabled
- [ ] Test at 200% browser zoom
- [ ] Test with reduced motion enabled
- [ ] Test with a screen reader on the homepage and one tool page

---

## 6. Accessibility

- [ ] Every page has one `h1` and a logical heading order
- [ ] Every form field has a visible or accessible label
- [ ] Every error message is announced and tied to its field
- [ ] Status regions use `role="status"` or `role="alert"` correctly
- [ ] Skip link is visible on focus
- [ ] Focus styles are visible on every interactive control
- [ ] Keyboard focus is not trapped or lost after actions
- [ ] Icons that are decorative use `aria-hidden="true"`
- [ ] Images have appropriate alt text or are marked decorative
- [ ] Color contrast meets WCAG AA for text and controls
- [ ] Reduced-motion preferences are respected
- [ ] Tables and comparison layouts remain usable at narrow widths

---

## 7. SEO and structured data

- [ ] Every indexable page has a unique title and meta description
- [ ] Every indexable page has the correct canonical URL
- [ ] Checkout return pages remain excluded from indexing
- [ ] Open Graph and Twitter metadata are correct on every public page
- [ ] JSON-LD parses without errors on every public page
- [ ] Product offers remain `PreOrder` until live checkout is verified
- [ ] Product images and URLs point to real public assets
- [ ] FAQ structured data matches the visible FAQ text
- [ ] Breadcrumb structured data matches visible breadcrumbs
- [ ] No internal link points to a missing page
- [ ] No duplicate IDs exist on any public page
- [ ] New pages are submitted to Search Console after launch

URLs the owner should add to `sitemap.xml` after approval:

- `https://tasklytools.org/`
- `https://tasklytools.org/tools/all/`
- `https://tasklytools.org/tools/invoice-generator/`
- `https://tasklytools.org/tools/profit-calculator/`
- `https://tasklytools.org/tools/freelance-rate-calculator/`
- `https://tasklytools.org/tools/proposal-generator/`
- `https://tasklytools.org/tools/utm-builder/`
- `https://tasklytools.org/products/`
- `https://tasklytools.org/products/freelancer-business-toolkit/`
- `https://tasklytools.org/products/small-business-finance-toolkit/`
- `https://tasklytools.org/products/proposal-client-acquisition-toolkit/`
- `https://tasklytools.org/guides/`
- `https://tasklytools.org/guides/how-to-create-a-professional-freelancer-invoice/`
- `https://tasklytools.org/guides/how-to-calculate-small-business-profit/`
- `https://tasklytools.org/guides/how-to-calculate-your-freelance-hourly-rate/`
- `https://tasklytools.org/guides/how-to-write-a-professional-freelance-proposal/`
- `https://tasklytools.org/guides/how-to-build-utm-links-for-marketing-campaigns/`
- `https://tasklytools.org/guides/invoice-vs-receipt/`
- `https://tasklytools.org/guides/how-to-price-freelance-projects-without-undercharging/`
- `https://tasklytools.org/guides/small-business-financial-tracking/`
- `https://tasklytools.org/resources/freelancer-project-planning-checklist/`

See `PHASE6_SITEMAP_CANDIDATES.md` for the full list and exclusions. Do not add either checkout
return page to the sitemap.

---

## 8. Security and privacy

- [ ] No API keys, secrets, tokens, or private credentials are committed
- [ ] No payment secrets exist in client-side JavaScript
- [ ] No private deliverable files or paths are public
- [ ] All user-entered tool data stays in the browser
- [ ] No tool uploads invoice, proposal, rate, profit, or UTM data to a server
- [ ] Newsletter endpoint remains blank until a provider is connected
- [ ] Newsletter form does not claim success without a provider response
- [ ] Privacy Policy covers future checkout, receipts, and newsletter processing
- [ ] Terms and refund policy are reviewed before paid launch
- [ ] Support contact details are valid and monitored
- [ ] Analytics and marketing tags follow the required consent rules
- [ ] External links use safe attributes where needed

Phase 5 secret scan found no real secret patterns. The only matches were documentation
wording such as "secrets" and "payment secrets".

---

## 9. Performance

- [ ] Product cover and preview images remain compressed and correctly sized
- [ ] Images below the fold use lazy loading where appropriate
- [ ] The homepage does not load unnecessary tool scripts
- [ ] CSS and JavaScript return successful HTTP 200 responses after deployment
- [ ] No render-blocking third-party script is added without review
- [ ] Google Fonts and tag manager costs are accepted and documented
- [ ] Lighthouse performance is reviewed on mobile and desktop
- [ ] Lighthouse accessibility is reviewed on mobile and desktop
- [ ] Lighthouse SEO is reviewed on mobile and desktop
- [ ] Core Web Vitals are monitored after launch

---

## 10. Analytics and consent

- [ ] Confirm the existing gtag and GTM IDs are the correct production properties
- [ ] Confirm whether consent is required in the target markets
- [ ] Do not send form contents, emails, or invoice data to analytics
- [ ] Do not fire a purchase event until live checkout is verified
- [ ] Define safe events for tool opens, checkout clicks, and newsletter submits
- [ ] Review analytics after launch for accidental personal data collection
- [ ] Document who owns the analytics properties and who can change them

Phases 5 and 6 confirm the tags exist but no custom conversion events are implemented. The
proposed events and QA steps are documented in `TASKLYTOOLS_ANALYTICS_PLAN.md`. No purchase
event should be created while checkout is disconnected.

---

## 11. Deployment

- [ ] Confirm GitHub Pages is serving the intended branch and root
- [ ] Confirm the custom domain and HTTPS certificate are correct
- [ ] Confirm the root `index.html` is the intended new homepage
- [ ] Confirm `CNAME`, `_config.yml`, `.htaccess`, `robots.txt`, and `sitemap.xml` policy
- [ ] Confirm no protected legacy file was modified or deleted
- [ ] Confirm the deployment contains the six public product images
- [ ] Confirm the deployment does not contain private deliverables
- [ ] Confirm 404 behavior is acceptable
- [ ] Confirm cache behavior after CSS and JavaScript changes
- [ ] Have a rollback path before replacing the live homepage

The protected-file baseline check passed with 194 of 194 files matching at the end of Phase 6.

---

## 12. Post-launch checks

- [ ] Open the homepage, all five tools, the guide hub, the free resource, the marketplace, and all three product pages
- [ ] Submit the invoice and proposal print flows once in production
- [ ] Check Search Console for crawl and canonical issues
- [ ] Check Analytics and Tag Manager for duplicate or missing tags
- [ ] Check Lemon Squeezy test mode before enabling live mode
- [ ] Complete one controlled live purchase before public announcement
- [ ] Verify the receipt, delivery email, and ZIP access
- [ ] Verify refund and support handling
- [ ] Monitor checkout button status and return pages
- [ ] Monitor broken links and 404s for the first week
- [ ] Review user feedback for confusing copy or blocked actions

---

## 13. Known limitations at the end of Phase 6

- No graphical browser was available, so visual, responsive, print, and copy-button QA remains unverified.
- No external PDF renderer was available; the checklist PDF passed structural validation but not rendered visual inspection.
- No live Lemon Squeezy store, product IDs, or variant IDs were available.
- No real or test payment was completed.
- Newsletter delivery remains disconnected by design.
- New pages are not yet in `sitemap.xml`; the owner must add them after approval.
- Existing legacy navigation contains pre-existing broken links that were intentionally not fixed.
- No custom analytics conversion events are implemented; the plan is documented but not shipped.
- The empty `#pre-load-animation` placeholder remains; it is harmless without matching CSS.

---

## 14. Final launch decision

- [ ] **Free-tool launch:** approved after owner browser, accessibility, and deployment review
- [ ] **Content launch:** guide hub, eight guides, and free resource approved after owner browser and link review
- [ ] **Product preview launch:** approved after owner content and legal review
- [ ] **Paid checkout launch:** blocked until the entire launch gate in section 1 is complete

Current recommendation: launch the free tools, guide hub, eight guides, free checklist, and
product preview pages only after the remaining owner QA items pass. Keep paid checkout
disconnected until Lemon Squeezy test checkout, delivery, receipts, returns, and one controlled
live transaction all pass.
