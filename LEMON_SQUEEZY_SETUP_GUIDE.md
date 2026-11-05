# Lemon Squeezy Setup Guide

Last updated: 2026-11-04

## Purpose

This guide is the manual setup checklist for selling the three TasklyTools digital toolkits through Lemon Squeezy as a merchant in Bangladesh.

The website is ready to consume Lemon Squeezy store and variant identifiers, but checkout is not connected. No account credentials, IDs, or transactions are included in the repository.

## Confirmed Bangladesh Position

Lemon Squeezy's official supported-countries documentation lists **Bangladesh** for bank payouts. Lemon Squeezy supports merchants who can receive a bank or PayPal payout in a supported country.

Payout facts from the official documentation:

| Item | Confirmed detail |
| --- | --- |
| Bank payout currency | USD, converted to the chosen local currency at the mid-market rate when paid |
| PayPal payout currency | USD; a verified PayPal account is required |
| Payout creation | Twice monthly, on the 1st and 15th |
| Hold period | Net sales held for 13 days before becoming available for payout |
| Expected payout dates | The 14th and 28th of the month |
| Bank arrival | Typically 1-5 days after payout |
| Minimum threshold | $50; smaller balances remain pending and roll over |
| Bank payout fee | Free for US bank accounts; 1% per payout for bank accounts outside the US |
| PayPal payout fee | $0.50 per payout in the US; 3% capped at $30 outside the US |

For a Bangladesh bank account, expect the non-US bank payout fee of 1% unless the dashboard shows a different current term. Lemon Squeezy also states that payout processing and conversion fees can vary by method, region, and settlement currency.

## Fee Position

Lemon Squeezy's official fee documentation currently shows a base platform fee of **$0.50 + 5% of the total order value** in its worked example, with additional processing surcharges:

| Fee | Current official figure | Applies to TasklyTools? |
| --- | --- | --- |
| Base platform fee | $0.50 + 5% of total order value | Yes, confirm current plan in the dashboard |
| International transaction | +1.5% | Likely for cross-border card payments |
| PayPal transaction | +1.5% | Only when the customer pays with PayPal |
| Subscription payment | +0.5% | No, these are one-time products |
| Abandoned-cart recovery | +5% | Only if that marketing feature is used |
| Affiliate referral | +3% | Only if an affiliate program is used |
| Non-US bank payout | 1% per payout | Expected for a Bangladesh bank account |
| PayPal payout outside the US | 3% capped at $30 | Only if PayPal payout is selected |

Check the current plan and fee breakdown in **Lemon Squeezy Dashboard » Settings » Plan** before setting final prices. The dashboard is authoritative if the published figures change.

Do not use these figures to promise a specific net amount to a customer. Taxes, discounts, currency conversion, refunds, and chargebacks can change the final settlement.

## Preflight

Before opening the dashboard:

- Use accurate personal and business information.
- Have a government-issued ID ready for identity verification.
- Have the bank account details ready for a payout method in Bangladesh.
- Confirm the business can legally sell digital templates and documents.
- Have the final privacy policy, terms, refund policy, and support contact ready.
- Keep the three complete ZIP packs in the private deliverables folder outside the public website.
- Do not upload paid files to GitHub or any public folder.

Private staging location used for this project:

```text
/mnt/d/Github/tasklytools-private-deliverables/downloads/
```

## Step 1: Create and Activate the Store

1. Register a Lemon Squeezy account and create the TasklyTools store.
2. Complete the business questionnaire honestly and fully.
3. Open **General Settings** and complete identity verification with a government-issued ID.
4. Open **Settings » Payout** and connect the Bangladesh bank account.
5. Submit the store for activation and wait for approval. Lemon Squeezy states this typically takes 2-3 business days, but timing can vary.
6. Enable two-factor authentication before adding live products.
7. Keep test mode enabled until the store is approved and the full test flow passes.

The store starts in test mode. Activation checks identity and business eligibility (KYC/KYB), so the name, address, and payout details must match the supporting documents.

## Step 2: Create the Three Products

Create each product as a **single payment** in USD.

| Product | Price | Private ZIP pack |
| --- | --- | --- |
| Freelancer Business Toolkit | $29 USD | `Freelancer-Business-Toolkit.zip` |
| Small Business Profit & Finance Toolkit | $39 USD | `Small-Business-Finance-Toolkit.zip` |
| Freelance Proposal & Client Acquisition Toolkit | $29 USD | `Proposal-Client-Acquisition-Toolkit.zip` |

For each product:

1. Use the exact product name and price.
2. Select the correct digital-product tax category.
3. Keep one default variant at the listed price.
4. Upload the complete ZIP pack under the product's files.
5. Add the cover and preview images from `/products/assets/`.
6. Add a clear description and licence summary.
7. Configure the confirmation modal and receipt email.
8. Copy the **product ID** and **variant ID** for the website configuration.
9. Publish the live product only after activation and final review.

Lemon Squeezy supports unlimited files up to 5GB total per product. Files are made available to customers after purchase. Updating a product's files changes what existing customers can download, so upload a new version deliberately and keep a private master copy.

## Step 3: Configure Confirmation and Receipt Links

The website return pages are:

- Success: `https://tasklytools.org/products/checkout/success/`
- Cancelled: `https://tasklytools.org/products/checkout/cancelled/`

In each Lemon Squeezy product:

1. Open the **Confirmation modal** settings.
2. Set a clear success title and message.
3. Set the button text and link to the success page, or to the customer's Lemon Squeezy download destination.
4. Open the **Receipt email** settings.
5. Set the button text and destination link.
6. Add an optional support or thank-you note.

The static hosted checkout share link does not have a documented automatic success redirect. The confirmation modal and receipt button are the reliable ways to send customers to the success page. The cancelled page is informational and is not automatically used by a static share link.

The success page must never be treated as proof of purchase and must never unlock files.

## Step 4: Test in Test Mode

1. Publish a test-mode copy of the product.
2. Open its Share or Preview link.
3. Use dummy customer details.
4. Use an official test card, such as Visa `4242 4242 4242 4242`, with any future expiry date and any three-digit CVC.
5. Complete the checkout.
6. Confirm the order appears in the dashboard.
7. Confirm the receipt email arrives. Test receipts go to store team members, not the entered customer address.
8. Confirm the confirmation and receipt links point to the intended pages.
9. Visit the success and cancelled pages directly and confirm no file is unlocked.
10. Confirm test-mode file downloads remain disabled, as documented by Lemon Squeezy.

Never use real card details in test mode. Never use test cards in live mode.

## Step 5: Configure the Website

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

- Use only the store subdomain as `storeSlug`.
- Add the matching product and variant IDs for all three products.
- Leave `checkoutUrl` empty unless using a complete official Lemon Squeezy `/checkout/buy/...` URL override.
- Keep `mode` as `"test"` while testing. The site shows a test-checkout notice and does not mark products as in stock.
- Set `mode` to `"live"` only after live IDs are installed and the launch gate passes.
- Never add API keys, webhook secrets, or customer data to this file.

## Step 6: Copy to Live and Run a Live Check

1. Use **Copy to Live Mode** for each approved test product. Test products do not automatically become live.
2. Replace test IDs with the live product and variant IDs.
3. Set `settings.lemonSqueezy.mode` to `"live"`.
4. Make one low-value live purchase with a real payment method.
5. Confirm the receipt, download access, and order record.
6. Refund the test order through Lemon Squeezy.
7. Confirm the refund appears in the dashboard and that the customer communication is clear.
8. Remove or disable the test product if it is no longer needed.

Do not skip the live check. Test mode does not enable file downloads, so delivery must be verified in live mode.

## Step 7: Launch Gate

Launch only when all of these are true:

- Identity verification and store activation are complete.
- Bank payout details are correct.
- All three live products show the correct USD price.
- Each product has the current ZIP pack attached.
- Live product and variant IDs are installed in `products-config.js`.
- The site shows live checkout, not test checkout.
- A live order was paid, downloaded, and refunded successfully.
- The success and cancelled pages still do not unlock files.
- No paid file remains in the public deployment.
- Privacy, terms, refund, and support information is current.
- Remaining pre-launch homepage copy that says checkout is not connected is updated.
- Product JSON-LD availability is changed from `PreOrder` to `InStock` only after live delivery is verified.
- The owner approves the launch.

## Reconciliation

For each payout:

1. Download the payout reverse invoice from Lemon Squeezy.
2. Match it to the bank or PayPal deposit.
3. Record gross sales, refunds, platform fees, payout fees, and net settlement.
4. Add the TasklyTools business name, address, and tax number to the payout invoice information if required.
5. Keep customer data and payment records out of the public repository.

## Maintenance

- Review platform and payout fees periodically.
- Keep product ZIP versions private and dated.
- Re-test checkout after changing a product, price, or variant.
- Re-check the official docs after any Lemon Squeezy policy change.
- Update structured data manually when a product is no longer available.
- Use the `PAYMENT_SECURITY_CHECKLIST.md` before every launch or major change.

## Official Sources

Checked 2026-11-04:

- Supported countries: <https://docs.lemonsqueezy.com/help/getting-started/supported-countries>
- Getting paid: <https://docs.lemonsqueezy.com/help/getting-started/getting-paid>
- Fees: <https://docs.lemonsqueezy.com/help/getting-started/fees>
- Activate store: <https://docs.lemonsqueezy.com/help/getting-started/activate-your-store>
- Verify identity: <https://docs.lemonsqueezy.com/help/getting-started/verify-your-identity>
- Test mode: <https://docs.lemonsqueezy.com/help/getting-started/test-mode>
- Adding products: <https://docs.lemonsqueezy.com/help/products/adding-products>
- Sharing products: <https://docs.lemonsqueezy.com/help/products/sharing-products>
- Confirmation modal: <https://docs.lemonsqueezy.com/help/checkout/customizing-confirmation-modal>
- Receipt emails: <https://docs.lemonsqueezy.com/help/checkout/customizing-receipt-emails>
