# Checkout Integration Guide

Last updated: 2026-11-04

## Current State

Lemon Squeezy is the selected payment provider, but checkout is deliberately not connected yet.

- `settings.checkoutProvider` is set to `lemonsqueezy`.
- `settings.lemonSqueezy.storeSlug` is empty.
- Every product has empty `lemonSqueezy.productId` and `lemonSqueezy.variantId` values.
- Buy buttons remain clickable so they can explain the current state.
- Clicking a buy button shows: "Checkout is not connected yet. No payment was taken."
- No payment is simulated, no order is stored, and no download is unlocked.
- No real or test Lemon Squeezy transaction has been completed by this repository.
- Paid deliverables are staged outside the public website. No paid files are linked from the site.

The integration boundary is a Lemon Squeezy hosted checkout URL. Payment secrets, API keys, and webhook secrets must not be added to this static repository.

## How It Works

1. `products-config.js` stores the store slug and one product ID plus variant ID per toolkit.
2. `checkout.js` asks the catalog for a validated checkout state.
3. Before configuration, the buy button shows a clear not-connected message and does not navigate.
4. After valid live configuration, the buy button opens the official Lemon Squeezy hosted checkout.
5. Lemon Squeezy handles payment, tax, the receipt, and authorized digital-file delivery.
6. TasklyTools never confirms payment and never unlocks files from a success URL.

## Products and Prices

| Product | Price | Required Lemon Squeezy identifiers |
| --- | --- | --- |
| Freelancer Business Toolkit | $29 USD | Product ID and variant ID |
| Small Business Profit & Finance Toolkit | $39 USD | Product ID and variant ID |
| Freelance Proposal & Client Acquisition Toolkit | $29 USD | Product ID and variant ID |

Use one-time payments. Do not create subscriptions for these toolkits.

## Official Checkout Links

Lemon Squeezy documents a unique checkout URL per product in the form:

```text
https://{store-slug}.lemonsqueezy.com/checkout/buy/{variant-id}
```

Copy the link from the product's **Share** panel or create one through the API. Do not use or share `/checkout/?cart=...` cart URLs; they are single-use and customer-specific.

The site can build the link from `settings.lemonSqueezy.storeSlug` plus each product's variant ID. It also accepts a complete official `/checkout/buy/...` URL in `checkoutUrl` as an override. Only HTTPS URLs on a `*.lemonsqueezy.com` host with a `/checkout/buy/` path pass validation.

## Return Pages and Redirect Limitations

The TasklyTools return routes are:

- Success: `https://tasklytools.org/products/checkout/success/`
- Cancelled: `https://tasklytools.org/products/checkout/cancelled/`

These values are configured in `settings.checkoutSuccessUrl` and `settings.checkoutCancelledUrl`.

Important limitations:

- The static hosted checkout share link does not have a documented automatic success or cancellation redirect.
- Customize the product's Lemon Squeezy **Confirmation modal** button link to the success page if that is the desired post-purchase destination.
- Customize the receipt email button link to the success page or to the Lemon Squeezy delivery destination.
- The cancelled page is informational. It is only used if a provider configuration or API-created checkout sends the customer there.
- A checkout created through the Lemon Squeezy API can use `product_options.redirect_url` for a successful purchase. This static site does not create checkouts through the API.

Neither return page proves payment. Both are `noindex, follow` and must never unlock a file.

## Step 1: Prepare the Store

1. Create the Lemon Squeezy store as a merchant in Bangladesh.
2. Complete the business questionnaire and identity verification with accurate information.
3. Connect a payout method under **Settings » Payout**.
4. Wait for store approval before enabling live checkout. Lemon Squeezy states that approval typically takes 2-3 business days, but timing can vary.
5. Keep test mode enabled until the store and products are ready.

Bangladesh is listed for bank payouts in Lemon Squeezy's supported-countries documentation. Bank payouts are made in USD and converted to the chosen local currency at the mid-market rate when paid. PayPal payouts are available only with a verified PayPal account and are paid in USD.

## Step 2: Create the Products

For each toolkit:

1. Create a new product with the exact name and one-time price above.
2. Select the appropriate digital-product tax category.
3. Create the default variant and keep its price in USD.
4. Upload the complete ZIP pack from the private deliverables folder. Lemon Squeezy securely provides purchased files to customers.
5. Add the public cover and preview images and a clear description.
6. Copy the product ID and variant ID from the dashboard or API.
7. Configure the confirmation modal and receipt email, including the success-page link if desired.
8. Publish only when the files, price, and tax settings are correct.

Lemon Squeezy allows unlimited files up to 5GB total per product. Updating a product's files affects existing customers, so keep a versioned master ZIP outside the public site. Prefer disabling an old file over deleting it.

## Step 3: Add Identifiers to the Site

Edit `tasklytools-new-assets/js/products-config.js`:

```js
settings.lemonSqueezy.storeSlug = "your-store-slug";
settings.lemonSqueezy.mode = "test";

{
  id: "freelancer-business-toolkit",
  checkoutUrl: "",
  lemonSqueezy: {
    productId: "123456",
    variantId: "789012"
  }
}
```

Rules:

- `storeSlug` is only the subdomain part, not a full URL.
- `variantId` is required to build the official checkout URL.
- `productId` is stored for administration and reconciliation. It is not required to build the URL.
- `checkoutUrl` is optional and must be an official Lemon Squeezy `/checkout/buy/...` URL.
- `mode` must remain `"test"` until live checkout has been approved and tested.
- Set `mode` to `"live"` only when live IDs are installed and the launch gate below passes.
- Never place an API key, webhook secret, card data, or customer data in this file.

## Step 4: Connect Secure Delivery

Use Lemon Squeezy's native product-file delivery:

1. Upload the ZIP pack for each product in the Lemon Squeezy dashboard.
2. Confirm the product's receipt button points to the download or success destination.
3. Test that the customer receives a receipt and can access the file after purchase.
4. Keep the source files in `/mnt/d/Github/tasklytools-private-deliverables/` or another private location.
5. Never copy paid files back into `products/downloads/`, `products/assets/`, or any other deployed folder.

Do not build a webhook-based delivery system on GitHub Pages. A custom backend would need signature verification, order validation, idempotency, refund handling, and secret storage that static hosting cannot provide safely.

## Step 5: Test in Test Mode

Use Lemon Squeezy test mode and dummy customer details. Official test card examples include Visa `4242 4242 4242 4242`, with any future expiry date and any three-digit CVC.

Verify:

- A test product is published in test mode.
- The buy button opens the correct test checkout.
- Price and currency match the catalog.
- The receipt email arrives. Test-mode receipts go to store team members, not the entered customer address.
- The order appears in the Lemon Squeezy dashboard.
- The confirmation and receipt links point where intended.
- The success and cancelled pages never unlock files.
- File downloads are disabled in test-mode purchases, as documented by Lemon Squeezy.
- Mobile and desktop layouts work.
- No payment is possible when the identifiers are blank.
- The browser console has no errors.
- Analytics receives no card data, customer data, or checkout URL parameters.

Test-mode products do not automatically become live products. Use **Copy to Live Mode** after activation, then replace test identifiers with live identifiers.

## Launch Gate

Do not launch until:

- Store activation and identity verification are complete.
- Live products, prices, tax categories, and files are approved.
- Live product and variant IDs are installed.
- `settings.lemonSqueezy.mode` is `"live"`.
- A real low-value live test order is completed and refunded through Lemon Squeezy.
- Receipt, delivery, refund, and support paths work.
- No paid file exists anywhere in the public deployment.
- Privacy, terms, refund, and contact information are current and consistent with Lemon Squeezy as merchant of record.
- Remaining pre-launch homepage copy that says checkout is not connected is updated.
- Product structured data has moved from `PreOrder` to `InStock` only after live checkout and delivery are verified.
- The owner approves the live configuration.

## Rollback

If checkout or delivery fails:

1. Set `settings.lemonSqueezy.storeSlug` to `""` or set `checkoutUrl` to `""` for the affected product.
2. Confirm the buy button shows the not-connected message.
3. Keep product pages and previews available if appropriate.
4. Do not delete orders, receipts, or customer records.
5. Resolve the issue in Lemon Squeezy and document the incident.
6. Notify affected customers through the provider or the published support channel.

## Security Rules

- No API keys, webhook secrets, or private tokens in HTML, CSS, JavaScript, or git history.
- Use only official Lemon Squeezy checkout URLs.
- Never accept `javascript:`, `http://`, protocol-relative, credential-bearing, or cart URLs.
- Never unlock files from a client-side success state.
- Verify payment, amount, currency, and product server-side before any custom delivery.
- Validate webhook signatures if a backend is ever added.
- Avoid logging customer or payment details.
- Keep provider SDKs out of the static site unless explicitly reviewed.

## Official References

Checked 2026-11-04:

- Supported countries: <https://docs.lemonsqueezy.com/help/getting-started/supported-countries>
- Getting paid: <https://docs.lemonsqueezy.com/help/getting-started/getting-paid>
- Fees: <https://docs.lemonsqueezy.com/help/getting-started/fees>
- Activate store: <https://docs.lemonsqueezy.com/help/getting-started/activate-your-store>
- Verify identity: <https://docs.lemonsqueezy.com/help/getting-started/verify-your-identity>
- Test mode: <https://docs.lemonsqueezy.com/help/getting-started/test-mode>
- Adding products: <https://docs.lemonsqueezy.com/help/products/adding-products>
- Sharing products: <https://docs.lemonsqueezy.com/help/products/sharing-products>
- Hosted checkout: <https://docs.lemonsqueezy.com/help/checkout/hosted-checkout>
- Confirmation modal: <https://docs.lemonsqueezy.com/help/checkout/customizing-confirmation-modal>
- Receipt emails: <https://docs.lemonsqueezy.com/help/checkout/customizing-receipt-emails>
