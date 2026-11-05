# Membership Roadmap

Last updated: 2026-11-04

## Current Position

TasklyTools has no membership, login, subscription, or gated library. The free browser tools remain free and do not require an account.

The three Phase 3 toolkits are one-time products. They should not be presented as a membership or subscription until a real membership system exists.

## Principles

- Do not sell a membership before access, billing, cancellation, and support are ready.
- Do not gate free tools without an explicit product decision.
- Do not collect account data without a privacy and retention plan.
- Do not promise "lifetime" access without defining what that covers.
- Keep checkout, delivery, and membership entitlements separate concerns.
- Preserve the existing static tools and public pages.

## Why Membership Is Deferred

A credible membership needs capabilities that GitHub Pages cannot provide alone:

- User accounts and secure sessions.
- Subscription billing and cancellation.
- Entitlement checks on every protected request.
- A member library with versioned files.
- Receipts, invoices, refunds, and failed-payment handling.
- Password reset, support, and account deletion.
- Privacy, cookie, and consent management.
- Backup, monitoring, and incident response.

Adding a login form without these would create a false sense of security.

## Phased Options

### Phase A: One-Time Product Sales

This is the current direction.

- Sell each toolkit separately.
- Deliver through a payment provider.
- No account required.
- No recurring billing.
- Keep free tools free.

Success criteria:

- Checkout and delivery work reliably.
- Support volume is manageable.
- Customers understand what they are buying.
- Refund and tax processes are defined.

### Phase B: Customer Library

A lightweight account area for people who bought one or more toolkits.

Possible features:

- Email magic-link sign-in.
- List of purchased toolkits.
- Protected download links.
- File version and update history.
- Receipt history.

Requirements:

- Backend or provider-managed customer portal.
- Secure entitlement model.
- Account deletion and data export.
- Clear support process.

Do not build this on static-only hosting unless the provider supplies the portal.

### Phase C: Optional Membership

A recurring plan for access to a growing library and updates.

Possible features:

- All current toolkits.
- New toolkit releases while subscribed.
- Template updates and changelog.
- Optional member-only guides.
- Cancellation self-service.

Requirements:

- Subscription billing and dunning.
- Entitlement revocation on cancellation or failed payment.
- Clear renewal and cancellation terms.
- Refund policy.
- Higher support and compliance load.

### Phase D: Pro Tools

Only consider saved presets, bulk exports, or cloud history if there is demonstrated demand.

Requirements:

- Authentication.
- Data storage and retention policy.
- Export and deletion.
- Security review.
- Clear separation from free browser-only tools.

## Recommended Sequence

1. Launch one-time toolkit sales through a provider.
2. Measure demand, support requests, and refund patterns.
3. Add a provider-hosted customer portal if repeat buyers need one.
4. Validate willingness to pay for recurring access before building subscriptions.
5. Build a backend only when the product requires accounts or protected entitlements.
6. Revisit Pro tools last.

## Entitlement Model

If membership is added, use server-verified entitlements:

- Payment provider or backend records the purchase.
- Backend maps purchase to a customer and product.
- Protected download requests check entitlement and issue a short-lived link.
- Cancellation revokes recurring access according to the terms.
- One-time purchases retain access according to the stated policy.

Never trust a URL parameter, `localStorage`, or a client-side flag as proof of entitlement.

## Pricing and Messaging Rules

- Show the billing period, renewal behavior, and cancellation terms before purchase.
- Do not use fake urgency, fake discounts, or unverifiable social proof.
- Do not describe a planned feature as available.
- Keep one-time toolkit prices separate from recurring membership pricing.
- Explain what happens to files if a membership ends.

## Legal and Privacy Checklist

- Privacy policy covers account, payment, and email data.
- Terms cover licence, refunds, cancellation, and acceptable use.
- Cookie/consent handling is appropriate for analytics and marketing.
- Data retention and deletion are documented.
- Support contact is visible.
- Tax and invoice requirements are handled by the provider or merchant.

## Decision Gates

Do not start the next phase until:

- The prior phase has real usage data.
- Support capacity is sufficient.
- Unit economics are understood.
- The provider or backend can enforce access.
- The owner explicitly approves the scope and budget.

## Explicit Non-Commitments

This document does not commit TasklyTools to:

- A subscription launch date.
- A specific membership price.
- A specific provider.
- Lifetime access.
- A member community.
- Affiliate or advertising programs.
