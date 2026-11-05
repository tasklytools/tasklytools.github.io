/* TasklyTools site configuration and catalog.
   This file is a static data source. Keep it free of DOM access. */
(function (root) {
  "use strict";

  var tools = [
    {
      slug: "invoice-generator",
      name: "Invoice Generator",
      category: "business",
      description:
        "Create a clean, professional invoice with automatic totals and print-ready output.",
      icon: "bi-receipt",
      status: "live",
      url: "/tools/invoice-generator/",
      tags: ["invoice", "billing", "payment", "client", "pdf"]
    },
    {
      slug: "profit-calculator",
      name: "Profit Calculator",
      category: "business",
      description:
        "Calculate gross profit, net profit, margins, estimated tax, and break-even from revenue and expenses.",
      icon: "bi-graph-up-arrow",
      status: "live",
      url: "/tools/profit-calculator/",
      tags: ["profit", "margin", "revenue", "cost", "expenses", "pricing", "break-even", "tax"]
    },
    {
      slug: "freelance-rate-calculator",
      name: "Freelance Rate Calculator",
      category: "freelancer",
      description:
        "Turn your income goal, working hours, and expenses into a sustainable hourly rate.",
      icon: "bi-calculator",
      status: "live",
      url: "/tools/freelance-rate-calculator/",
      tags: ["freelance", "rate", "hourly", "income", "pricing"]
    },
    {
      slug: "proposal-generator",
      name: "Proposal Generator",
      category: "freelancer",
      description:
        "Assemble a clear, reusable client proposal with scope, timeline, and pricing sections.",
      icon: "bi-file-earmark-text",
      status: "live",
      url: "/tools/proposal-generator/",
      tags: ["proposal", "client", "scope", "pitch", "freelance"]
    },
    {
      slug: "utm-builder",
      name: "UTM Builder",
      category: "marketing",
      description:
        "Build consistent, correctly encoded UTM campaign links for newsletters, ads, and social posts.",
      icon: "bi-link-45deg",
      status: "live",
      url: "/tools/utm-builder/",
      tags: ["utm", "campaign", "tracking", "url", "analytics", "marketing"]
    }
  ];

  var categories = [
    {
      id: "business",
      name: "Business Tools",
      icon: "bi-briefcase",
      description: "Invoices, pricing, and the day-to-day numbers behind a small business."
    },
    {
      id: "freelancer",
      name: "Freelancer Tools",
      icon: "bi-person-workspace",
      description: "Rates, proposals, and client workflows that protect your time."
    },
    {
      id: "marketing",
      name: "Marketing Tools",
      icon: "bi-megaphone",
      description: "Campaign links, tracking, and practical growth utilities."
    }
  ];

  var templates = [
    {
      slug: "freelance-client-kit",
      name: "Freelance Client Kit",
      description: "Proposal, contract checklist, and onboarding documents in one pack.",
      icon: "bi-briefcase",
      status: "coming-soon"
    },
    {
      slug: "profit-pricing-pack",
      name: "Profit & Pricing Pack",
      description: "Spreadsheet models for pricing, margins, and break-even planning.",
      icon: "bi-table",
      status: "coming-soon"
    },
    {
      slug: "campaign-planner",
      name: "Campaign Planner",
      description: "Plan channels, campaign links, and launch checklists in one place.",
      icon: "bi-calendar2-check",
      status: "coming-soon"
    }
  ];

  function getCategory(id) {
    for (var i = 0; i < categories.length; i += 1) {
      if (categories[i].id === id) return categories[i];
    }
    return null;
  }

  function getTool(slug) {
    for (var i = 0; i < tools.length; i += 1) {
      if (tools[i].slug === slug) return tools[i];
    }
    return null;
  }

  root.TasklyConfig = {
    site: {
      name: "TasklyTools",
      domain: "https://tasklytools.org",
      tagline: "Free Tools. Smarter Work. Better Results.",
      emailNote: "Newsletter delivery is not connected in this phase."
    },
    categories: categories,
    tools: tools,
    templates: templates,
    getCategory: getCategory,
    getTool: getTool
  };
})(typeof window !== "undefined" ? window : globalThis);
