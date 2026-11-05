/* TasklyTools product catalog and monetization settings.
   This file is a static data source. Keep it free of DOM access and secrets. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TasklyProducts = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var products = [
    {
      id: "freelancer-business-toolkit",
      slug: "freelancer-business-toolkit",
      name: "Freelancer Business Toolkit",
      shortName: "Freelancer Toolkit",
      category: "freelancer",
      categoryLabel: "Freelancer operations",
      badge: "Best for solo freelancers",
      tagline:
        "Run client work with clearer records, cleaner handoffs, and fewer payment surprises.",
      description:
        "A practical set of templates for freelancers who want their client work to feel organized from first enquiry to final payment. Track projects, send professional invoices, onboard clients consistently, and keep income and expenses in one place.",
      priceCents: 2900,
      currency: "USD",
      formats: "DOCX, XLSX, PDF",
      checkoutUrl: "",
      lemonSqueezy: {
        productId: "",
        variantId: ""
      },
      cover: "/products/assets/freelancer-business-toolkit-cover.png",
      coverAlt: "Freelancer Business Toolkit product cover with invoice, tracker, and checklist previews",
      preview: "/products/assets/freelancer-business-toolkit-preview.png",
      previewAlt: "Preview of invoice and project tracking pages from the Freelancer Business Toolkit",
      highlights: [
        "Know which projects, invoices, and follow-ups need attention",
        "Send consistent, professional client documents",
        "Keep a simple record of income and expenses"
      ],
      includes: [
        "Professional invoice template (DOCX)",
        "Project quotation template (DOCX)",
        "Client onboarding checklist (DOCX)",
        "Project tracking spreadsheet (XLSX)",
        "Income and expense tracker (XLSX)",
        "Payment follow-up email scripts (DOCX)",
        "Client information form (DOCX)",
        "Step-by-step usage guide (PDF)"
      ],
      whoFor: [
        "Solo freelancers and independent consultants",
        "Designers, developers, writers, marketers, and other service providers",
        "Freelancers who handle their own admin and client communication"
      ],
      outcomes: [
        "A repeatable client onboarding process",
        "A clear project and payment tracking system",
        "Professional documents you can adapt in Word or Excel"
      ],
      delivery: "Lemon Squeezy secure digital delivery"
    },
    {
      id: "small-business-finance-toolkit",
      slug: "small-business-finance-toolkit",
      name: "Small Business Profit & Finance Toolkit",
      shortName: "Finance Toolkit",
      category: "finance",
      categoryLabel: "Business finance",
      badge: "Best for owner-operators",
      tagline:
        "See what your business earns, spends, and keeps without building a finance system from scratch.",
      description:
        "A practical finance toolkit for small business owners and solo operators. Track revenue and expenses, review profit and loss, test pricing assumptions, and understand your break-even point using clear, editable spreadsheets.",
      priceCents: 3900,
      currency: "USD",
      formats: "XLSX, DOCX, PDF",
      checkoutUrl: "",
      lemonSqueezy: {
        productId: "",
        variantId: ""
      },
      cover: "/products/assets/small-business-finance-toolkit-cover.png",
      coverAlt: "Small Business Profit and Finance Toolkit product cover with finance dashboard previews",
      preview: "/products/assets/small-business-finance-toolkit-preview.png",
      previewAlt: "Preview of profit and loss and break-even templates from the finance toolkit",
      highlights: [
        "Bring revenue, expenses, and profit into one monthly view",
        "Test pricing and break-even assumptions before you commit",
        "Build a repeatable monthly finance review habit"
      ],
      includes: [
        "Revenue tracker (XLSX)",
        "Expense tracker (XLSX)",
        "Profit and loss statement (XLSX)",
        "Pricing calculator (XLSX)",
        "Break-even calculator (XLSX)",
        "Monthly financial review checklist (DOCX)",
        "Step-by-step usage guide (PDF)"
      ],
      whoFor: [
        "Small business owners who manage their own numbers",
        "Solo operators and early-stage service businesses",
        "Freelancers who want a clearer financial routine as they grow"
      ],
      outcomes: [
        "A monthly view of revenue, costs, and profit",
        "A pricing and break-even model you can update",
        "A short review checklist for staying on top of the numbers"
      ],
      delivery: "Lemon Squeezy secure digital delivery"
    },
    {
      id: "proposal-client-acquisition-toolkit",
      slug: "proposal-client-acquisition-toolkit",
      name: "Freelance Proposal & Client Acquisition Toolkit",
      shortName: "Proposal Toolkit",
      category: "client-acquisition",
      categoryLabel: "Client acquisition",
      badge: "Best for service businesses",
      tagline:
        "Turn enquiries into clear proposals, scoped projects, and calm follow-ups.",
      description:
        "A complete client acquisition pack for freelancers and small service businesses. Build proposals faster, define scope before work starts, price services consistently, ask better discovery questions, and follow up without guessing what to say.",
      priceCents: 2900,
      currency: "USD",
      formats: "DOCX, XLSX, PDF",
      checkoutUrl: "",
      lemonSqueezy: {
        productId: "",
        variantId: ""
      },
      cover: "/products/assets/proposal-client-acquisition-toolkit-cover.png",
      coverAlt: "Proposal and Client Acquisition Toolkit cover with proposal and outreach previews",
      preview: "/products/assets/proposal-client-acquisition-toolkit-preview.png",
      previewAlt: "Preview of proposal, scope, and outreach pages from the client acquisition toolkit",
      highlights: [
        "Write proposals with a clear scope, timeline, and price",
        "Use discovery questions that surface the real project",
        "Follow up with helpful, non-pushy email templates"
      ],
      includes: [
        "Proposal templates (DOCX)",
        "Project scope template (DOCX)",
        "Service pricing template (XLSX)",
        "Client discovery questionnaire (DOCX)",
        "Outreach email templates (DOCX)",
        "Follow-up email templates (DOCX)",
        "Project closing checklist (DOCX)",
        "Step-by-step usage guide (PDF)"
      ],
      whoFor: [
        "Freelancers who regularly send proposals",
        "Small service businesses that need a repeatable sales process",
        "Consultants, designers, developers, and creative studios"
      ],
      outcomes: [
        "A proposal structure you can adapt in minutes",
        "Clear scope and pricing before work begins",
        "A simple outreach and follow-up sequence"
      ],
      delivery: "Lemon Squeezy secure digital delivery"
    }
  ];

  var settings = {
    checkoutProvider: "lemonsqueezy",
    checkoutSuccessUrl: "/products/checkout/success/",
    checkoutCancelledUrl: "/products/checkout/cancelled/",
    lemonSqueezy: {
      storeSlug: "",
      mode: "test"
    },
    newsletterEndpoint: "",
    newsletterProvider: "",
    defaultCurrency: "USD"
  };

  function getProduct(id) {
    for (var i = 0; i < products.length; i += 1) {
      if (products[i].id === id || products[i].slug === id) return products[i];
    }
    return null;
  }

  function formatPrice(product) {
    if (!product || typeof product.priceCents !== "number") return "";
    var amount = product.priceCents / 100;
    var display = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
    var symbol = product.currency === "USD" ? "$" : "";
    return symbol + display + " " + (product.currency || settings.defaultCurrency);
  }

  function normalizeStoreSlug(value) {
    if (typeof value !== "string") return "";
    var slug = value.trim().toLowerCase();
    return /^[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?$/.test(slug) ? slug : "";
  }

  function normalizeVariantId(value) {
    var text = typeof value === "number" ? String(value) : value;
    if (typeof text !== "string") return "";
    text = text.trim();
    return /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(text) ? text : "";
  }

  function isOfficialLemonSqueezyCheckoutUrl(url) {
    if (typeof url !== "string") return false;
    var value = url.trim();
    if (!value) return false;
    var match = value.match(
      /^https:\/\/([a-z0-9-]+)\.lemonsqueezy\.com\/checkout\/buy\/([A-Za-z0-9][A-Za-z0-9_-]{0,127})\/?(?:[?#][^\s]*)?$/i
    );
    return Boolean(match && normalizeStoreSlug(match[1]));
  }

  function getCheckoutState(product) {
    var mode = settings.lemonSqueezy && settings.lemonSqueezy.mode === "live" ? "live" : "test";
    var state = { ready: false, reason: "", url: "", mode: mode };

    if (!product) {
      state.reason = "product-missing";
      return state;
    }

    if (settings.checkoutProvider !== "lemonsqueezy") {
      state.reason = "provider-missing";
      return state;
    }

    var explicitUrl = isOfficialLemonSqueezyCheckoutUrl(product.checkoutUrl)
      ? product.checkoutUrl.trim()
      : "";
    if (explicitUrl) {
      state.ready = true;
      state.url = explicitUrl;
      return state;
    }

    var storeSlug = normalizeStoreSlug(settings.lemonSqueezy && settings.lemonSqueezy.storeSlug);
    if (!storeSlug) {
      state.reason = "store-missing";
      return state;
    }

    var variantId = normalizeVariantId(
      product.lemonSqueezy && product.lemonSqueezy.variantId
    );
    if (!variantId) {
      state.reason = "variant-missing";
      return state;
    }

    state.ready = true;
    state.url = "https://" + storeSlug + ".lemonsqueezy.com/checkout/buy/" + variantId;
    return state;
  }

  function getCheckoutUrl(product) {
    return getCheckoutState(product).url;
  }

  function isSafeCheckoutUrl(url) {
    return isOfficialLemonSqueezyCheckoutUrl(url);
  }

  function isSafeHttpsOrRootPath(url) {
    if (typeof url !== "string") return false;
    var value = url.trim();
    if (!value || /\s/.test(value) || value.indexOf("\\") !== -1) return false;
    if (value.indexOf("https://") === 0) return true;
    return value.indexOf("/") === 0 && value.indexOf("//") !== 0;
  }

  function isSafeNewsletterEndpoint(url) {
    return isSafeHttpsOrRootPath(url);
  }

  return {
    products: products,
    settings: settings,
    getProduct: getProduct,
    formatPrice: formatPrice,
    getCheckoutState: getCheckoutState,
    getCheckoutUrl: getCheckoutUrl,
    isOfficialLemonSqueezyCheckoutUrl: isOfficialLemonSqueezyCheckoutUrl,
    isSafeCheckoutUrl: isSafeCheckoutUrl,
    isSafeNewsletterEndpoint: isSafeNewsletterEndpoint
  };
});
