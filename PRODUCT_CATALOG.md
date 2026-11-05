# TasklyTools Product Catalog

Last updated: 2026-11-04

## Status Summary

The three Phase 3 digital toolkits are built. Checkout uses Lemon Squeezy, but the store slug and product/variant IDs are not configured yet, so no payment can be completed.

Paid deliverables have been moved outside the public website:

```text
/mnt/d/Github/tasklytools-private-deliverables/downloads/
```

No paid file is linked from the deployed site. Public covers and previews remain under `products/assets/`.

| Product | Price | Category | Page |
| --- | --- | --- | --- |
| Freelancer Business Toolkit | $29 USD | Freelancer operations | `/products/freelancer-business-toolkit/` |
| Small Business Profit & Finance Toolkit | $39 USD | Business finance | `/products/small-business-finance-toolkit/` |
| Freelance Proposal & Client Acquisition Toolkit | $29 USD | Client acquisition | `/products/proposal-client-acquisition-toolkit/` |

All prices are one-time prices in USD. No subscription or membership is included.

## 1. Freelancer Business Toolkit

**Best for:** solo freelancers and independent consultants who handle their own admin.

**Outcome:** a repeatable client workflow from enquiry to payment.

**Included files:**

- Freelancer Business Toolkit Guide (PDF)
- Invoice Template (DOCX)
- Project Quotation Template (DOCX)
- Client Onboarding Checklist (DOCX)
- Payment Follow-Up Emails (DOCX)
- Client Information Form (DOCX)
- Project Tracking Spreadsheet (XLSX)
- Income and Expense Tracker (XLSX)
- Complete ZIP pack

**Private pack:** `/mnt/d/Github/tasklytools-private-deliverables/downloads/freelancer-business-toolkit/Freelancer-Business-Toolkit.zip`

**Lemon Squeezy product ID:** not configured

**Lemon Squeezy variant ID:** not configured

**Cover:** `/products/assets/freelancer-business-toolkit-cover.png`

**Preview:** `/products/assets/freelancer-business-toolkit-preview.png`

## 2. Small Business Profit & Finance Toolkit

**Best for:** owner-operators and small service businesses that manage their own numbers.

**Outcome:** a clearer monthly view of revenue, expenses, profit, pricing, and break-even.

**Included files:**

- Small Business Finance Toolkit Guide (PDF)
- Revenue Tracker (XLSX)
- Expense Tracker (XLSX)
- Profit and Loss Statement (XLSX)
- Pricing Calculator (XLSX)
- Break-Even Calculator (XLSX)
- Monthly Financial Review Checklist (DOCX)
- Complete ZIP pack

**Private pack:** `/mnt/d/Github/tasklytools-private-deliverables/downloads/small-business-finance-toolkit/Small-Business-Finance-Toolkit.zip`

**Lemon Squeezy product ID:** not configured

**Lemon Squeezy variant ID:** not configured

**Cover:** `/products/assets/small-business-finance-toolkit-cover.png`

**Preview:** `/products/assets/small-business-finance-toolkit-preview.png`

**Caution:** the files are practical planning tools, not accounting software. Spreadsheet formulas should be reviewed after import into Excel, Google Sheets, or another app. They are not tax, accounting, or financial advice.

## 3. Freelance Proposal & Client Acquisition Toolkit

**Best for:** freelancers, consultants, and small service businesses that send proposals and manage outreach.

**Outcome:** a clearer proposal, scope, pricing, discovery, and follow-up process.

**Included files:**

- Proposal and Client Acquisition Guide (PDF)
- Proposal Template (DOCX)
- Project Scope Template (DOCX)
- Service Pricing Template (XLSX)
- Client Discovery Questionnaire (DOCX)
- Outreach Email Templates (DOCX)
- Follow-Up Email Templates (DOCX)
- Project Closing Checklist (DOCX)
- Complete ZIP pack

**Private pack:** `/mnt/d/Github/tasklytools-private-deliverables/downloads/proposal-client-acquisition-toolkit/Proposal-Client-Acquisition-Toolkit.zip`

**Lemon Squeezy product ID:** not configured

**Lemon Squeezy variant ID:** not configured

**Cover:** `/products/assets/proposal-client-acquisition-toolkit-cover.png`

**Preview:** `/products/assets/proposal-client-acquisition-toolkit-preview.png`

## Catalogue Source

`tasklytools-new-assets/js/products-config.js` is the source of truth for:

- IDs, slugs, names, categories, and badges.
- Prices and currency.
- Descriptions, highlights, audiences, and outcomes.
- Included items and formats.
- Public cover and preview images.
- Lemon Squeezy store, product, and variant IDs.
- Checkout mode and return routes.
- Delivery description.

Product page copy, FAQs, and preview cards are committed directly in each product HTML page. The one-off Phase 3 generator is not part of the deployed site or a runtime dependency. Update the page HTML directly when the copy changes.

## Delivery

Lemon Squeezy is the payment provider and merchant of record. Paid ZIP packs are delivered through Lemon Squeezy's native product files after purchase. The provider handles receipts and authorized download access.

The site never links a paid file directly. The success page does not unlock files. Test-mode purchases do not enable file downloads, so delivery must be verified with a live order.

See `LEMON_SQUEEZY_SETUP_GUIDE.md` for the upload and launch process.

## File Formats

- **DOCX:** editable in Microsoft Word, Google Docs, and compatible word processors.
- **XLSX:** editable in Microsoft Excel, Google Sheets, and compatible spreadsheet apps.
- **PDF:** reading and printing; use the editable source files for changes.
- **ZIP:** complete pack for one secure delivery.

Formatting and formulas can vary slightly across apps. Review the file after import, especially spreadsheet calculations and page breaks.

## Licence Position

Customers may use and adapt the files in their own business and client work. They may not resell or redistribute the templates as templates. The product pages repeat this plain-language licence note.

## Public Access Rule

No paid deliverable may be stored in or linked from the public repository. `.gitignore` excludes `/products/downloads/` as a safeguard, but the directory must remain absent from the deployment. Only covers and previews belong under `products/assets/`.

## Maintenance Checklist

When changing a product:

1. Update `products-config.js`.
2. Update the product HTML page directly if page copy changes.
3. Re-check catalog and page values against each other.
4. Confirm the private ZIP contains the current files.
5. Upload the new ZIP version through Lemon Squeezy.
6. Re-check price, currency, and JSON-LD.
7. Confirm no paid file has been added to the public site.
8. Re-test checkout, receipts, delivery, and refunds in the provider dashboard.
9. Re-run `PAYMENT_SECURITY_CHECKLIST.md`.
