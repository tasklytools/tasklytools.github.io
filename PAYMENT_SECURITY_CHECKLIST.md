# Payment Security Checklist

Last updated: 2026-11-04

Use this checklist before enabling live checkout and after any change to products, files, return pages, or provider settings.

## 1. Repository and Secret Hygiene

- [ ] No Lemon Squeezy API key, webhook secret, private token, or password is present in HTML, CSS, JavaScript, or Markdown.
- [ ] No secret is present in git history.
- [ ] No `.env` file or credential export is committed.
- [ ] The static site contains only public identifiers: store slug, product ID, and variant ID.
- [ ] Dashboard access uses a strong unique password and two-factor authentication.
- [ ] Only authorized team members can access the Lemon Squeezy dashboard.
- [ ] The private deliverables folder is outside the repository and is not served by GitHub Pages.

## 2. Public File Isolation

- [ ] `products/downloads/` does not exist in the public deployment.
- [ ] No ZIP, DOCX, XLSX, PDF, or other paid deliverable is linked from any HTML page.
- [ ] The only public product media are the six cover and preview PNGs under `products/assets/`.
- [ ] Batch search confirms there are no `/products/downloads/` links in deployed files.
- [ ] `.gitignore` excludes `/products/downloads/` to prevent accidental re-adding.
- [ ] The private master ZIPs exist outside the public site and are backed up securely.
- [ ] Product pages describe the contents without exposing the deliverable files.

## 3. Checkout Configuration

- [ ] `settings.checkoutProvider` is `"lemonsqueezy"`.
- [ ] `settings.lemonSqueezy.storeSlug` contains only the store subdomain.
- [ ] Each product has the correct live product ID and variant ID.
- [ ] `settings.lemonSqueezy.mode` is `"live"` only after live approval and testing.
- [ ] Any `checkoutUrl` override is an official `https://*.lemonsqueezy.com/checkout/buy/...` URL.
- [ ] No cart URL (`/checkout/?cart=...`) is stored or shared.
- [ ] No product uses a generic URL that resolves to the wrong item.
- [ ] The configured URL passes the local validator.
- [ ] Product names, prices, currencies, and formats match the catalog.
- [ ] All three products are one-time payments in USD.

## 4. Payment and Delivery Flow

- [ ] Lemon Squeezy handles card data, tax, receipts, refunds, and authorized downloads.
- [ ] TasklyTools does not collect or store card details.
- [ ] The success page does not confirm payment.
- [ ] The success page does not unlock downloads or create entitlements.
- [ ] The cancelled page does not confirm or deny a payment that the provider has not verified.
- [ ] Directly visiting either return page cannot reveal a paid file.
- [ ] Entitlements are not stored only in `localStorage`, cookies, or URL parameters.
- [ ] A customer receives delivery through Lemon Squeezy, not through a public link.
- [ ] No custom webhook is used on static hosting.
- [ ] If a backend is added later, webhook signatures, order amount, currency, product, and idempotency are verified server-side.

## 5. Test Mode

- [ ] Test mode is enabled in the Lemon Squeezy dashboard.
- [ ] A published test product is used.
- [ ] Dummy customer details are used.
- [ ] Only official test card numbers are used.
- [ ] No real card details are entered in test mode.
- [ ] The test order appears in the dashboard.
- [ ] The receipt email arrives.
- [ ] Confirmation and receipt links point to the intended destinations.
- [ ] Test-mode download behavior is understood: file downloads are disabled in test mode.
- [ ] Test products have not been treated as live products.

## 6. Live Launch Check

- [ ] Store activation and identity verification are complete.
- [ ] Payout details are correct for the Bangladesh bank account.
- [ ] Live product and variant IDs are installed.
- [ ] The site shows live checkout, not test checkout.
- [ ] One low-value live order is paid with a real payment method.
- [ ] The live receipt and file access work.
- [ ] The live order is refunded through Lemon Squeezy.
- [ ] The refund is visible in the dashboard.
- [ ] Refund, support, privacy, and terms information is current.
- [ ] Remaining pre-launch homepage copy that says checkout is not connected is updated.
- [ ] No test card, test ID, or placeholder ID remains in live configuration.
- [ ] The owner has approved the launch.

## 7. Privacy and Analytics

- [ ] Privacy policy discloses Lemon Squeezy as the payment provider and merchant of record.
- [ ] Terms and refund policy are consistent with the provider flow.
- [ ] The support contact is monitored.
- [ ] Analytics does not receive card data, customer data, or full checkout URLs.
- [ ] GTM and gtag configuration does not capture form values or payment fields.
- [ ] Consent requirements are reviewed for the relevant jurisdictions.
- [ ] No customer file or purchase record is placed in the public repository.

## 8. Structured Data and Customer Claims

- [ ] Product structured data does not claim `InStock` before live checkout and delivery work.
- [ ] No fake reviews, ratings, sales counts, urgency, discounts, or guarantees are present.
- [ ] The displayed price is the price charged at checkout.
- [ ] The delivery description matches Lemon Squeezy's actual behavior.
- [ ] The licence wording is clear and does not promise legal, tax, or financial advice.

## 9. Incident Response

If a paid file becomes public:

1. Remove the file from the deployment immediately.
2. Rotate any exposed credential if one was involved.
3. Check access logs and repository history.
4. Replace or version the affected product file if necessary.
5. Document the incident and notify affected customers if required.
6. Re-run this checklist before restoring checkout.

If checkout fails:

1. Clear the affected store slug or checkout URL.
2. Confirm the site shows the not-connected message.
3. Keep existing orders, receipts, and customer records intact.
4. Fix the configuration in Lemon Squeezy.
5. Re-test in test mode before returning to live.
6. Document the resolution.

## 10. Final Sign-Off

- [ ] All sections above are checked.
- [ ] The owner has reviewed the final diff.
- [ ] No commit, push, or deployment was performed without explicit owner approval.
- [ ] The launch decision is documented with the date and approver.
