# Phase 6 Sitemap Candidates

- Prepared: 2026-11-05
- Purpose: identify the pages the site owner should add to `sitemap.xml`
- Status: **proposal only**; `sitemap.xml` and `robots.txt` were not modified

## Rules

- Add only canonical, indexable HTML pages.
- Use the exact canonical URL shown in each page's `<link rel="canonical">`.
- Do not add the checkout return pages.
- Do not add legacy or duplicate pages that are not part of the current TasklyTools experience.
- Submit the updated sitemap in Google Search Console after the owner publishes it.

## New Phase 6 pages

| URL | Page type | Recommended |
| --- | --- | --- |
| `https://tasklytools.org/guides/` | Guide hub | Yes |
| `https://tasklytools.org/guides/how-to-create-a-professional-freelancer-invoice/` | Guide | Yes |
| `https://tasklytools.org/guides/how-to-calculate-small-business-profit/` | Guide | Yes |
| `https://tasklytools.org/guides/how-to-calculate-your-freelance-hourly-rate/` | Guide | Yes |
| `https://tasklytools.org/guides/how-to-write-a-professional-freelance-proposal/` | Guide | Yes |
| `https://tasklytools.org/guides/how-to-build-utm-links-for-marketing-campaigns/` | Guide | Yes |
| `https://tasklytools.org/guides/invoice-vs-receipt/` | Guide | Yes |
| `https://tasklytools.org/guides/how-to-price-freelance-projects-without-undercharging/` | Guide | Yes |
| `https://tasklytools.org/guides/small-business-financial-tracking/` | Guide | Yes |
| `https://tasklytools.org/resources/freelancer-project-planning-checklist/` | Free resource landing page | Yes |

The downloadable PDF at
`https://tasklytools.org/resources/freelancer-project-planning-checklist/freelancer-project-planning-checklist.pdf`
is linked from the resource page. It does not need a separate sitemap entry unless the owner
wants the PDF itself indexed.

## Existing current-site pages

| URL | Page type | Recommended |
| --- | --- | --- |
| `https://tasklytools.org/` | Home | Yes, if not already present |
| `https://tasklytools.org/tools/all/` | Tool directory | Yes |
| `https://tasklytools.org/tools/invoice-generator/` | Tool | Yes |
| `https://tasklytools.org/tools/profit-calculator/` | Tool | Yes |
| `https://tasklytools.org/tools/freelance-rate-calculator/` | Tool | Yes |
| `https://tasklytools.org/tools/proposal-generator/` | Tool | Yes |
| `https://tasklytools.org/tools/utm-builder/` | Tool | Yes |
| `https://tasklytools.org/products/` | Digital toolkit marketplace | Yes |
| `https://tasklytools.org/products/freelancer-business-toolkit/` | Product | Yes |
| `https://tasklytools.org/products/small-business-finance-toolkit/` | Product | Yes |
| `https://tasklytools.org/products/proposal-client-acquisition-toolkit/` | Product | Yes |
| `https://tasklytools.org/privacy-policy/` | Legal | Yes |
| `https://tasklytools.org/terms-and-conditions/` | Legal | Yes |
| `https://tasklytools.org/disclaimer/` | Legal | Yes |

## Exclude from the sitemap

| URL | Reason |
| --- | --- |
| `https://tasklytools.org/products/checkout/success/` | Checkout return page; `noindex, follow` |
| `https://tasklytools.org/products/checkout/cancelled/` | Checkout return page; `noindex, follow` |
| Any `/wp-content/`, `/wp-includes/`, `/wp-json/`, author, feed, or category archive | Not part of the current content plan |
| `https://tasklytools.org/index-old.html` | Legacy duplicate |
| `https://tasklytools.org/tools/index.html` | Legacy tools directory |

## Internal-link priorities

- Homepage: link to `/guides/` and the free checklist.
- Guide hub: link to all eight guides and the resource page.
- Each guide: link to its matching tool, at most one relevant product page, and two or three related guides.
- Each tool page: link to the matching guide.
- Each product page: link to two or three relevant guides.
- Resource page: link to the proposal, pricing, and invoice guides.
- Use descriptive anchor text rather than "click here".

## Owner actions

1. Review the list against the published site.
2. Add the approved URLs to `sitemap.xml` using the site's existing sitemap format.
3. Keep the checkout return pages excluded.
4. Re-submit the sitemap in Search Console.
5. Check the Page Indexing report after Google recrawls the site.
