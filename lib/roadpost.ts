// Roadpost — e-commerce growth case study content.
// Rendered by components/case-study.tsx at /work/roadpost.
//
// Provenance: this is work Marked's own team led on the Roadpost and ZOLEO
// business, and the page presents it as a Marked engagement. Every figure below
// is a real reported result from that work — none of it is illustrative except
// where marked PLACEHOLDER. There is no client-side testimonial and no
// client-approved copy on this page, unlike lib/oeo.ts, so nothing here needs
// external sign-off; it does need to stay accurate.
//
// REAL. Do not change these without checking them against the source reporting:
//   · $20.9M FY24 e-commerce revenue, web + marketplace, an all-time company
//     high, +118% year over year
//   · Amazon USA $8M in FY24 (+169% YoY); Amazon Canada past $1M for the first
//     time (+127% YoY)
//   · web revenue growth: Roadpost.ca +29.7%, Roadpost.com +36.3%,
//     BlueCosmo.com +29.6%
//   · ZOLEO activations: FY22 at 117% of quota (Canada) and 113% (USA); FY24
//     North America at 116% of quota, 5,000+ subscribers above target
//   · the 100,000 ZOLEO subscriber milestone, reached ahead of plan
//   · ZOLEO global replatform across 9 regions, on time and on budget
//   · ZOLEO Europe launch, April 2022
//   · ZOLEO Renewed: $65K of new revenue in 4 months
//   · Web Ops efficiency +25%
//
// $20.9M is the headline figure and must read the same in the hero, the results
// grid and the homepage work slider (lib/md.ts → WORK[1].metric).
//
// PLACEHOLDER, marked inline below and safe to swap without touching the
// template: the quarterly revenue series, the channel mix percentages (derived
// from the real channel totals, not reported directly), the industry and
// services lines, the platform list, and the testimonial.

import type { CaseStudy } from "@/lib/case-study";

export const ROADPOST: CaseStudy = {
  client: "Roadpost",
  slug: "roadpost",
  kicker: "Case study · Growth",
  // PLACEHOLDER — confirm the sector and services lines with the account team.
  // Keep `industry` short: the hero meta cell is narrow, and a second clause
  // here breaks "E-commerce" across two lines.
  industry: "Satellite communications",
  services: "E-commerce growth · Marketplace · Global replatform",
  timeline: "FY22 to FY24",

  h1: { before: "A record year, in ", underlined: "every channel", after: "." },
  sub: "Roadpost sells satellite communication devices and the airtime that keeps them connected. In FY24 its web and marketplace channels turned over $20.9M, the highest in the company's history, and ZOLEO passed 100,000 subscribers ahead of plan.",

  // REAL — the headline number, repeated as the first cell of results.items.
  headlineStat: { value: 20.9, prefix: "$", suffix: "M", decimals: 1, label: ["E-COMMERCE REVENUE", "FY24 · ALL-TIME HIGH"] },
  scrollCue: "Scroll to the brief",

  brief: {
    kicker: "/ 01 · The brief",
    heading: "What Roadpost needed.",
    lede: "Three web storefronts, two Amazon marketplaces and a subscription brand going global, each with its own targets. Four objectives set the work.",
    // PLACEHOLDER — these four are written from the engagement scope, not
    // client-approved wording like the OEO set. Confirm before launch.
    objectives: [
      {
        n: "01",
        title: "Grow E-commerce Revenue",
        body: "Run web and marketplace as one channel mix instead of three storefronts and a pair of marketplace accounts.",
      },
      {
        n: "02",
        title: "Scale the Marketplaces",
        body: "Treat Amazon USA and Canada as real growth channels, then find out what comes after them.",
      },
      {
        n: "03",
        title: "Hit ZOLEO Activation Targets",
        body: "Subscriber quotas in both Canada and the USA every quarter, with the 100,000 milestone in sight.",
      },
      {
        n: "04",
        title: "Take ZOLEO Global",
        body: "One platform serving nine regions in the right language and currency, without a launch date slipping.",
      },
    ],
  },

  results: {
    kicker: "/ 02 · The results",
    heading: "Three fiscal years in.",
    // REAL — all four figures are client-reported.
    items: [
      { label: "REVENUE", value: 20.9, prefix: "$", suffix: "M", decimals: 1, sub: "FY24 e-commerce, web and marketplace, an all-time company high", lead: true },
      { label: "YOY GROWTH", value: 118, prefix: "+", suffix: "%", sub: "Total e-commerce revenue, FY24 vs. FY23" },
      { label: "AMAZON USA", value: 8, prefix: "$", suffix: "M", sub: "FY24 sales, up 169% year over year" },
      // 100,000, abbreviated: the full form overflows the cell at this type size.
      { label: "SUBSCRIBERS", value: 100, suffix: "K", sub: "ZOLEO milestone, reached ahead of plan" },
    ],
  },

  revenue: {
    kicker: "/ 03 · Revenue",
    // REAL — +118% FY24 vs. FY23, and the $20.9M total. Same figures as the
    // headline stat and results.items; the chart must not tell a different
    // story from the grid above it.
    heading: "Revenue up 118% year over year.",
    body: "Marketplace grew fastest, but not at the web channel's expense. FY24 closed at $20.9M across web and marketplace, up 118% on FY23 and the highest total the company has recorded.",
    chartHead: "E-commerce revenue, indexed. FY23 Q1 = 100",
    rangeLabel: "FY23 Q1 TO FY24 Q4",
    ariaLabel:
      "Quarterly e-commerce revenue indexed to 100 at the start of FY23, running through FY24, which closed 118% above FY23 at $20.9M.",
    // PLACEHOLDER — the quarterly split is illustrative; only the annual
    // figures are reported. Two things have to stay true of whatever series
    // replaces it, because the chart labels both: the FY24 points must sum to
    // 2.18× the FY23 points (+118% for the year), and the final point must sit
    // at 2.18× the first, so the "+118%" pinned to it is honest at that point
    // too. Here every quarter is exactly 2.18× its FY23 counterpart, which
    // satisfies both and keeps the seasonal shape.
    engagementIndex: 3,
    markerLabel: "FY24",
    endLabel: "+118%",
    gridlines: [100, 200, 300],
    series: [
      { label: "FY23 Q1", value: 100 },
      { label: "FY23 Q2", value: 116 },
      { label: "FY23 Q3", value: 88 },
      { label: "FY23 Q4", value: 100 },
      { label: "FY24 Q1", value: 218 },
      { label: "FY24 Q2", value: 253 },
      { label: "FY24 Q3", value: 192 },
      { label: "FY24 Q4", value: 218 },
    ],
  },

  split: {
    kicker: "/ 04 · Channels",
    heading: "Amazon at $8M. Web up across the board.",
    body: "In the same year Amazon USA grew 169%, all three web storefronts grew double digits and Amazon Canada cleared $1M for the first time, up 127%. Nothing was traded off to get the marketplace number.",
    // Shares derived from the reported channel totals against $20.9M: Amazon
    // USA $8M, Amazon Canada just over $1M, the three web storefronts the rest.
    primary: {
      label: "FY24 revenue by channel",
      bars: [
        { label: "WEB STOREFRONTS", pct: 57 },
        { label: "AMAZON USA", pct: 38 },
        { label: "AMAZON CANADA", pct: 5 },
      ],
      footnote: "SHARE OF $20.9M FY24 E-COMMERCE REVENUE",
    },
    // REAL — reported per-property revenue growth. Bar width is the growth
    // rate itself here, which only works while every value stays under 100.
    secondary: {
      label: "Web revenue growth, year over year",
      bars: [
        { label: "ROADPOST.COM", pct: 36.3 },
        { label: "ROADPOST.CA", pct: 29.7 },
        { label: "BLUECOSMO.COM", pct: 29.6 },
      ],
      footnote: "ALL THREE PROPERTIES, FY24 VS. FY23",
    },
  },

  stack: {
    kicker: "/ 05 · The stack",
    // Keep this count equal to `platforms.length`.
    heading: "11 platforms. One system.",
    body: "The channels that drove subscriber growth and the tooling that kept nine regions shipping, all reporting into one view.",
    // PLACEHOLDER — confirm the engagement stack. Each entry must match a
    // `name` in STACK_TOOLS (lib/md.ts); the logo, brand colour and role come
    // from there, so these tiles stay identical to the /stack page.
    platforms: [
      "Google Ads",
      "Meta Ads",
      "Amazon Ads",
      "Reddit Ads",
      "LinkedIn Ads",
      "Amazon Marketplace",
      "Walmart Marketplace",
      "Google Analytics",
      "Google Tag Manager",
      "Figma",
      "Claude",
    ],
  },

  shipped: {
    kicker: "/ 06 · Shipped",
    heading: "Seven programs. Nine regions.",
    body: "A global replatform, a European launch, two brands consolidated behind one storefront, and a refurbished-device line that paid for itself inside four months.",
    scrollHint: "Scroll →",
    pages: [
      { name: "ZOLEO global replatform", type: "9 REGIONS", thumb: "hero" },
      { name: "ZOLEO Europe launch", type: "MARKET LAUNCH", thumb: "dark" },
      { name: "Roadpost + BlueCosmo", type: "CONSOLIDATION", thumb: "split" },
      { name: "ZOLEO Renewed store", type: "NEW REVENUE", thumb: "grid" },
      { name: "Amazon UK relaunch", type: "MARKETPLACE", thumb: "list" },
      { name: "Walmart pilot", type: "MARKETPLACE", thumb: "profile" },
      { name: "GA4 + KPI dashboards", type: "ANALYTICS", thumb: "form" },
    ],
    // PLACEHOLDER — swap for real captures of the two brand sites before the
    // consolidation and the storefront that replaced them.
    compare: {
      label: "BEFORE / AFTER · BRAND CONSOLIDATION",
      caption: "DRAG TO COMPARE: TWO SEPARATE BRAND SITES VS. THE CONSOLIDATED STOREFRONT",
      beforeImage: undefined,
      afterImage: undefined,
      beforeAlt: "The Roadpost and BlueCosmo sites before consolidation",
      afterAlt: "The consolidated storefront that replaced them",
    },
  },

  approach: {
    kicker: "/ 07 · How it ran",
    heading: "Diagnose. Engineer. Compound.",
    body: "Three fiscal years, one direction of travel. Measurement went in first, the platform second, and the growth compounded on both.",
    phases: [
      {
        n: "01",
        title: "Diagnose",
        period: "FY22",
        body: "GA4 went onto every property and new KPI dashboards replaced scattered reporting, so every channel could finally be judged on the same numbers. ZOLEO activations cleared quota in both countries that year, at 117% in Canada and 113% in the USA.",
        bullets: ["GA4 ON ALL PROPERTIES", "NEW KPI DASHBOARDS", "ACTIVATIONS OVER QUOTA, CA + US"],
      },
      {
        n: "02",
        title: "Engineer",
        period: "FY22 to FY23",
        body: "ZOLEO moved onto one platform built for nine regions, multi-language and multi-currency, delivered on time and on budget. Europe launched on it in April 2022, and the Roadpost and BlueCosmo sites were consolidated behind it without losing customers in the migration. Activations set back-to-back monthly records that August and September.",
        bullets: ["9-REGION REPLATFORM, ON TIME", "ZOLEO EUROPE LIVE APR 2022", "TWO BRANDS CONSOLIDATED", "RECORD ACTIVATIONS, AUG + SEPT 2022"],
      },
      {
        n: "03",
        title: "Compound",
        period: "FY24 →",
        body: "Paid and organic ran together across Google, Meta, Amazon, Reddit and LinkedIn, with competitive bidding and AI-driven creative testing lifting return on spend. North American activations closed the year at 116% of quota, better than 5,000 subscribers above target, and new marketplaces and a refurbished-device line added revenue on top of the core business.",
        bullets: ["OMNICHANNEL PAID + ORGANIC", "AI-DRIVEN CREATIVE TESTING", "116% OF NA ACTIVATION QUOTA", "AMAZON UK + WALMART PILOTED", "WEB OPS 25% MORE EFFICIENT"],
      },
    ],
  },

  // Marked's own voice, not a client's. There is no approved testimonial from
  // anyone at Roadpost, so this section states the outcome and attributes it to
  // us. If a named quote is ever obtained, it replaces this wholesale — a
  // client's name goes here only once that person has actually said it and
  // signed off.
  quote: {
    body: "Three record channels, a subscription brand past 100,000 subscribers, and nine regions running on one platform. That is what growth looks like when media, storefront and measurement are run as one system instead of five separate reports.",
    attribution: "MARKED · HOW WE RUN GROWTH",
  },
};
