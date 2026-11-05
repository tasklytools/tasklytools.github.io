# TasklyTools Analytics Plan

- Prepared: 2026-11-05
- Scope: Phase 6 guide, tool, resource, and product measurement
- Status: planning document only; no analytics code, tags, key events, or reports were changed

## 1. Current state

- The site includes Google tag `GT-MJWCNQXM` and Google Tag Manager container `GTM-P879KSTN`.
- No TasklyTools custom events are currently implemented.
- No GA4 property configuration, consent configuration, conversion/key-event setup, or real-time
  event verification was performed for this phase.
- Checkout is disconnected. Payment cannot complete, and no purchase or revenue event should be
  sent.
- Newsletter delivery is not connected. Do not measure newsletter signup success as if it works.
- The free PDF checklist downloads directly. A click event can measure download intent, not proof
  that the file finished saving.

Do not claim that analytics is complete until the owner verifies it in GTM Preview and GA4
DebugView in a real browser.

## 2. Measurement principles

- Measure useful actions, not vanity.
- Send the minimum data needed.
- Never send names, email addresses, company names, invoice contents, financial amounts, project
  descriptions, or other personal data.
- Never send form field values to analytics.
- UTM values are allowed, but must not contain personal information.
- Respect consent requirements. If consent is required, do not fire non-essential analytics until
  the visitor consents.
- Do not send a purchase, revenue, or subscription event while checkout is disconnected.
- Do not create fake or backfilled events.
- Treat guide views as content engagement, not proof of expertise.
- Treat tool completion as task completion, not proof that the output is correct for the user's
  situation.

## 3. Event plan

| Event | Trigger | Parameters | Purpose |
| --- | --- | --- | --- |
| `guide_view` | Guide page loads once | `guide_slug`, `guide_cluster`, `content_type` | Measure guide reach by topic |
| `tool_start` | First meaningful input or action in a tool | `tool_id`, `task_type` | Measure intent to use a tool |
| `tool_complete` | A valid result is generated or refreshed | `tool_id`, `task_type`, `result_type` | Measure successful task completion |
| `tool_copy` | User copies a generated result | `tool_id`, `result_type`, `placement` | Measure reuse of output |
| `tool_print` | User prints a generated result | `tool_id`, `result_type` | Measure document workflow |
| `tool_export` | User downloads a generated file, if supported | `tool_id`, `result_type`, `file_type` | Measure file-based workflow |
| `product_view` | Product page loads once | `product_id`, `product_name`, `checkout_state` | Measure product interest |
| `product_cta_click` | User clicks a product or checkout CTA | `product_id`, `placement`, `checkout_state` | Measure path to product detail or checkout |
| `resource_download` | User clicks the checklist PDF link | `resource_id`, `placement`, `file_type` | Measure free-resource demand |

### Parameter definitions

| Parameter | Allowed values / format | Notes |
| --- | --- | --- |
| `guide_slug` | `how-to-create-a-professional-freelancer-invoice` | Stable slug only |
| `guide_cluster` | `freelancing`, `finance`, `marketing` | Controlled vocabulary |
| `content_type` | `guide`, `hub`, `resource` | Controlled vocabulary |
| `tool_id` | `invoice-generator`, `profit-calculator`, `freelance-rate-calculator`, `proposal-generator`, `utm-builder` | Stable ID |
| `task_type` | `invoice`, `profit`, `rate`, `proposal`, `utm` | Controlled vocabulary |
| `result_type` | `invoice`, `profit`, `rate`, `proposal`, `utm` | Do not send the actual result |
| `placement` | `hero`, `guide_body`, `related`, `tool_note`, `resource_page` | Where the action occurred |
| `product_id` | `freelancer-business-toolkit`, `small-business-finance-toolkit`, `proposal-client-acquisition-toolkit` | Stable ID |
| `product_name` | Display name | Optional |
| `checkout_state` | `disconnected`, `configured`, `live` | Do not send purchase data |
| `resource_id` | `freelancer-project-planning-checklist` | Stable ID |
| `file_type` | `pdf`, `csv`, `txt`, `xlsx`, `docx` | Lowercase |
| `content_type` | Page type | Do not confuse with HTTP content type |

### Events not to send

- `purchase`
- `begin_checkout` while checkout is disconnected
- `sign_up` while newsletter delivery is disconnected
- Any event carrying invoice numbers, client names, amounts, rates, profit figures, or form values
- Any event that implies a user completed a payment or received a paid file

## 4. Event implementation notes

These are implementation requirements for a later change. They are not active yet.

### Guide views

- Fire `guide_view` once when a guide page is ready.
- Do not fire it on the hub or resource page; use their page views and the hub/resource-specific
  events where needed.
- Derive `guide_slug` and `guide_cluster` from a controlled page attribute or a small lookup, not
  from free-text page titles.
- Avoid duplicate firing from `load` and a single-page-app style history listener; this site is
  not an SPA.

### Tool starts

- Fire `tool_start` on the first meaningful input, select change, or explicit calculate action.
- Do not fire on page load.
- Do not fire on every keystroke.
- Use a per-page flag so one session on one tool page produces one `tool_start`.
- Do not send the field value.

### Tool completion

- Fire `tool_complete` only after the tool renders a valid result.
- Fire on a result refresh only if the user makes a meaningful change and recalculates; debounce
  rapid repeated actions.
- Do not fire for validation errors or incomplete forms.
- Include `tool_id`, `task_type`, and `result_type`; do not include the calculated amounts.

### Copy, print, and export

- Fire from the existing action handlers after the action succeeds or is invoked.
- For copy, prefer the successful clipboard promise where available.
- For print, fire when the print action is invoked; do not claim the print completed.
- For download, fire when the download is initiated; do not claim the file was saved.
- Include `placement` only when there is a meaningful location difference.

### Product views and CTAs

- Fire `product_view` once per product page load.
- Fire `product_cta_click` when a product detail button or checkout button is clicked.
- While checkout is disconnected, use `checkout_state: "disconnected"` and do not send
  `begin_checkout`, `add_payment_info`, or `purchase`.
- When checkout is configured but not live-tested, use `checkout_state: "configured"` and still
  do not send a purchase event.
- Only after a real, verified checkout flow should a separate purchase measurement be designed.
- Product JSON-LD `PreOrder` status must not be treated as a completed sale.

### Resource downloads

- Fire `resource_download` when the PDF link is clicked.
- Include `resource_id`, `placement`, and `file_type: "pdf"`.
- If the browser blocks the download or the user cancels, the click still counts as download
  intent, not a completed download.
- The resource page must remain available without an email address.

## 5. Data attributes for implementation

When the events are implemented, use stable attributes rather than brittle text matching.

Suggested attributes:

```html
<!-- Guide page wrapper -->
<main data-guide-slug="how-to-create-a-professional-freelancer-invoice"
      data-guide-cluster="freelancing">

<!-- Tool page wrapper -->
<main data-tool-id="invoice-generator" data-task-type="invoice">

<!-- Product CTA -->
<a data-product-cta="freelancer-business-toolkit"
   data-placement="product_card"
   data-checkout-state="disconnected">

<!-- Resource download -->
<a data-resource-download="freelancer-project-planning-checklist"
   data-placement="resource_hero">
```

Do not add attributes that contain client data or calculated values.

## 6. Google Tag Manager plan

### Triggers

| Trigger name | Type | Condition |
| --- | --- | --- |
| `CE - guide_view` | Custom Event | `event` equals `guide_view` |
| `CE - tool_start` | Custom Event | `event` equals `tool_start` |
| `CE - tool_complete` | Custom Event | `event` equals `tool_complete` |
| `CE - tool_copy` | Custom Event | `event` equals `tool_copy` |
| `CE - tool_print` | Custom Event | `event` equals `tool_print` |
| `CE - tool_export` | Custom Event | `event` equals `tool_export` |
| `CE - product_view` | Custom Event | `event` equals `product_view` |
| `CE - product_cta_click` | Custom Event | `event` equals `product_cta_click` |
| `CE - resource_download` | Custom Event | `event` equals `resource_download` |
| `Click - PDF resource` | Click | Click URL contains `/resources/freelancer-project-planning-checklist/` and ends with `.pdf` |

Prefer Data Layer Variables over DOM scraping for parameters. Use click triggers only as a
fallback for a native link that cannot emit a data-layer event.

### Tags

- One GA4 Event tag per event name.
- Map each parameter to a GA4 event parameter with the exact same name.
- Do not add user-scoped or personally identifying parameters.
- Do not enable enhanced measurement form tracking that captures field values.
- Keep advertising tags separate from analytics; do not build remarketing audiences from
  financial-tool usage.

### Variables

Create Data Layer Variables for:

- `guide_slug`
- `guide_cluster`
- `content_type`
- `tool_id`
- `task_type`
- `result_type`
- `placement`
- `product_id`
- `product_name`
- `checkout_state`
- `resource_id`
- `file_type`

## 7. GA4 configuration plan

### Custom definitions

Register these as event-scoped custom dimensions:

- `guide_slug`
- `guide_cluster`
- `content_type`
- `tool_id`
- `task_type`
- `result_type`
- `placement`
- `product_id`
- `product_name`
- `checkout_state`
- `resource_id`
- `file_type`

Do not register parameters that can contain free text or personal data.

### Key events

Suggested key events after verification:

- `tool_complete`
- `product_cta_click`
- `resource_download`

Do not mark `guide_view` as a key event unless the owner explicitly wants content reach treated
as a conversion. Do not mark `tool_start` as a key event; it measures intent, not completion.

### Audiences

- Guide readers by cluster
- Tool starters who did not complete
- Tool completers
- Resource downloaders
- Product page visitors
- Product CTA clickers

Do not build audiences from sensitive financial inputs or client data.

## 8. Consent and privacy

- Confirm whether the site needs a consent banner or consent mode update for the owner's
  jurisdiction and audience.
- Do not fire non-essential analytics before the required consent state.
- Do not send form contents, invoice contents, client names, email addresses, or financial
  amounts.
- Do not use session replay or heatmaps in this phase.
- Do not enable Google Signals or personalized ads without an explicit owner decision and the
  required disclosures.
- Update the privacy policy if the analytics configuration changes materially.
- Keep analytics access limited to the owner and authorized collaborators.
- Set a reasonable data-retention period in GA4; do not keep data indefinitely by default.

## 9. QA checklist

Run this in a real browser with GTM Preview and GA4 DebugView.

### Page and event basics

- [ ] Guide pages fire `guide_view` once with the correct slug and cluster.
- [ ] Guide hub does not fire `guide_view` unless intentionally configured.
- [ ] Resource page does not fire `guide_view`.
- [ ] Tool pages do not fire `tool_start` on load.
- [ ] `tool_start` fires once after the first meaningful input.
- [ ] `tool_complete` fires only after a valid result.
- [ ] Copy, print, and export events fire only when the action is invoked.
- [ ] Product pages fire `product_view` once.
- [ ] Product CTA clicks include the correct product and placement.
- [ ] Resource PDF clicks fire `resource_download`.
- [ ] No event fires on the checkout success or cancelled page that implies payment.
- [ ] No `purchase` event is sent while checkout is disconnected.

### Data quality

- [ ] No client names, email addresses, invoice numbers, amounts, or free-text fields appear in
  the data layer.
- [ ] No form values are collected by enhanced measurement.
- [ ] UTM values are lowercase and contain no personal data.
- [ ] `checkout_state` is accurate.
- [ ] Event parameters match the GA4 custom dimension names exactly.
- [ ] No duplicate events from both GTM and hard-coded gtag.
- [ ] Consent state is correct before and after a consent choice.
- [ ] Ad blockers and browser privacy settings are documented as a known gap.

### Reporting

- [ ] Guide views group correctly by cluster.
- [ ] Tool starts and completions group correctly by tool.
- [ ] Product CTA clicks group correctly by product and placement.
- [ ] Resource downloads group correctly by resource and placement.
- [ ] Internal traffic is filtered if the owner wants a clean report.
- [ ] Test traffic is excluded from decisions or clearly labeled.

## 10. Reporting plan

### Weekly

- Guide views and top guide pages
- Tool starts vs. completions
- Copy, print, and export counts
- Resource download clicks
- Product page views
- Product CTA clicks by product and placement
- Referrals by source, medium, and campaign

### Monthly

- Guide cluster comparison
- Tool completion rate: `tool_complete / tool_start`
- Product CTA click rate: `product_cta_click / product_view`
- Resource download rate: `resource_download / resource page views`
- Guide-to-tool click paths where available
- Content that attracts qualified product-page visits
- Content with high views but low useful next actions

Do not claim revenue attribution while checkout is disconnected. Do not compare against invented
benchmarks. Record data-quality caveats beside the report.

## 11. Known limitations

- No custom events are live yet.
- The presence of gtag and GTM does not prove a GA4 property is configured correctly.
- No consent platform was verified.
- No real-browser verification was possible in the Phase 6 environment.
- PDF download clicks measure intent, not completed saves.
- Ad blockers, privacy browsers, and script failures can undercount.
- Checkout is disconnected, so there is no purchase or revenue data.
- Newsletter delivery is not connected, so there is no verified signup success event.
- Tool completion does not prove the user's business decision is correct.

## 12. Owner actions

1. Confirm the GA4 property and data stream tied to `GT-MJWCNQXM`.
2. Confirm GTM access and publish permissions.
3. Decide the consent approach for the site's audience and jurisdiction.
4. Register the custom dimensions before relying on reports.
5. Implement the data attributes and data-layer events in a separate, reviewed change.
6. Test in GTM Preview and GA4 DebugView in a real browser.
7. Mark key events only after verification.
8. Create a monthly report with the metrics above.
9. Revisit purchase measurement only after checkout is live and verified.
10. Update this plan when the site's tools, products, or legal requirements change.
