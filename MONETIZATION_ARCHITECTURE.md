# TasklyTools Monetization Architecture

Last updated: 2026-11-04

## Purpose

TasklyTools uses a static catalog, product landing pages, and Lemon Squeezy hosted checkout for three one-time digital toolkits. It does not include a backend, authentication, subscriptions, or custom payment processing.

The architecture prioritizes:

- Preservation of existing pages and assets.
- Honest purchase states when checkout is not connected.
- Provider-managed payment and digital delivery.
- No payment secrets in the repository.
- Static GitHub Pages compatibility.
- No public access to paid deliverables.

## Current State

| Area | Status |
| --- | --- |
| Product catalog | Three products configured in `tasklytools-new-assets/js/products-config.js` |
| Marketplace | `/products/index.html` |
| Product pages | `/products/freelancer-business-toolkit/`, `/products/small-business-finance-toolkit/`, `/products/proposal-client-acquisition-toolkit/` |
| Product images | Six PNG cover and preview images under `/products/assets/` |
| Paid deliverables | Stored outside the public site in `/mnt/d/Github/tasklytools-private-deliverables/downloads/` |
| Checkout | Lemon Squeezy selected; store slug and all product/variant IDs are blank |
| Delivery | Lemon Squeezy native product files; not yet uploaded or tested |
| Newsletter | Not connected; no endpoint configured |
| Membership | Not implemented |
| Root sitemap | Protected legacy file; product URLs are not yet added |

No live or test transaction has been completed by this repository.

## Components

### Catalog and settings

`tasklytools-new-assets/js/products-config.js` is a UMD static data module. It exposes:

- `products`
- `settings`
- `getProduct(id)`
- `formatPrice(product)`
- `getCheckoutState(product)`
- `getCheckoutUrl(product)`
- `isOfficialLemonSqueezyCheckoutUrl(url)`
- `isSafeCheckoutUrl(url)`
- `isSafeNewsletterEndpoint(url)`

The catalog stores public provider identifiers only:

```js
settings.lemonSqueezy.storeSlug
settings.lemonSqueezy.mode
product.lemonSqueezy.productId
product.lemonSqueezy.variantId
product.checkoutUrl
```

Sensitive provider credentials must never be placed in this file.

### Rendering and behavior

- `products.js` renders the marketplace grid, applies filters, syncs product-page prices, and changes product JSON-LD from `PreOrder` to `InStock` only when checkout is ready in live mode.
- `checkout.js` attaches to `[data-product-checkout]` buttons. It uses `getCheckoutState()` and opens only an official Lemon Squeezy checkout URL.
- If the store slug, variant ID, or provider is missing, no navigation or payment occurs.
- Test mode is surfaced honestly and never described as a real payment.
- `newsletter.js` handles `[data-newsletter-form]` forms, validates email and consent locally, and reports that delivery is not connected when no endpoint exists.
- `products.css` contains scoped product, marketplace, checkout-result, and newsletter styles.

### Pages

- `/products/` is the marketplace and product comparison page.
- Product pages use `data-product-id` so catalog data and pricing can be applied.
- `/products/checkout/success/` and `/products/checkout/cancelled/` are `noindex` return pages. Neither page confirms payment or grants access.
- Product pages include JSON-LD for the product, breadcrumbs, and FAQ content.
- Product pages list contents but do not link paid files.

## Data Flow

1. Product data is stored in `products-config.js`.
2. `products.js` renders marketplace cards and syncs product-page prices.
3. `checkout.js` asks `getCheckoutState(product)` for the validated state.
4. Missing configuration produces an informational message; no navigation or payment occurs.
5. A ready live state opens `https://{store}.lemonsqueezy.com/checkout/buy/{variantId}`.
6. Lemon Squeezy handles payment, receipts, tax, refunds, and authorized file delivery.
7. TasklyTools does not receive or store card data.

## Static-Site Limitation

GitHub Pages can serve public files but cannot securely enforce paid access. Paid deliverables have therefore been removed from the public deployment.

Rules:

- Do not restore paid files to `products/downloads/` or any deployed folder.
- Do not treat a success URL as proof of payment.
- Do not build file delivery on client-side state.
- Keep public previews separate from paid deliverables.
- Use provider-hosted files or a verified backend with signed, expiring access.

`.gitignore` excludes `/products/downloads/` as a safeguard against accidental re-adding.

## Provider Integration Boundary

Checkout integration stays at the URL boundary:

- The repository stores public provider identifiers, not secret keys.
- The provider handles card data, tax presentation, receipts, refunds, and delivery.
- The provider confirmation modal or receipt button can link to the success page.
- The static hosted checkout share link does not have a documented automatic success or cancellation redirect.
- The cancelled page is informational and is only used when a provider or API configuration sends the customer there.
- An API-created checkout could use `product_options.redirect_url` for a successful purchase, but this static site does not create checkouts through the API.
- Entitlement and download access must be verified by Lemon Squeezy or a backend.

## Return Pages

- `/products/checkout/success/` explains that returning from checkout is not proof of payment.
- `/products/checkout/cancelled/` explains that no payment was completed on that page.
- Both are `noindex, follow`.
- Neither page reads a success parameter to unlock files.
- Neither page replaces a Lemon Squeezy receipt.

## Newsletter Boundary

Newsletter forms post only when `settings.newsletterEndpoint` is configured with a safe URL. Until then:

- No data is sent.
- No success message is shown.
- The form validates locally and explains that delivery is not connected.
- Consent is required before submission.

If a third-party form endpoint is added, disclose the provider in the privacy policy and confirm its data-processing terms.

## SEO and Analytics

- Product pages include canonical URLs, descriptions, Open Graph metadata, and JSON-LD.
- Checkout result pages are `noindex, follow`.
- Existing gtag `GT-MJWCNQXM` and GTM `GTM-P879KSTN` are preserved.
- The root `sitemap.xml` and `robots.txt` are protected. Update them only with explicit owner approval and after verifying the final URL structure.
- Product structured data starts at `PreOrder`. It becomes `InStock` only when checkout is ready in live mode, and should be updated statically after launch as well.

## Security Rules

- Never commit payment keys, API secrets, webhook secrets, or private tokens.
- Never accept a checkout URL containing credentials, a `javascript:` scheme, HTTP, a protocol-relative host, or a cart path.
- Never unlock files from a client-side success state.
- Validate provider URLs and webhook signatures on the server, not in static JavaScript.
- Keep product files free of personal data, credentials, and tracking pixels.
- Keep the private deliverables directory outside the repository.

## Rollout Gate

Before enabling real sales:

1. Activate the Lemon Squeezy store, verify identity, and connect a Bangladesh payout method.
2. Confirm current fees, tax handling, refunds, and merchant requirements.
3. Create the three products and upload the ZIP packs through Lemon Squeezy.
4. Install live product and variant IDs.
5. Test payment, receipts, and delivery in live mode, including a refund.
6. Set `settings.lemonSqueezy.mode` to `"live"` only after testing.
7. Change product JSON-LD to `InStock` after live delivery is verified.
8. Confirm no paid file remains in the public deployment.
9. Update legal, privacy, refund, and support pages.
10. Get owner approval before deployment.

## Related Documents

- `LEMON_SQUEEZY_SETUP_GUIDE.md` — manual account, product, payout, and launch setup.
- `PAYMENT_SECURITY_CHECKLIST.md` — launch and incident checklist.
- `CHECKOUT_INTEGRATION_GUIDE.md` — website configuration and test flow.
- `PRODUCT_CATALOG.md` — product contents, prices, and private file staging.
