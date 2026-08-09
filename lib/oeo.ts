// Ontario Education Online — growth case study content.
//
// REAL, client-provided. Do not reword without sign-off:
//   · the four objective titles (OBJECTIVES[].title)
//   · the four year-over-year results (RESULTS): revenue +738%, orders +880%,
//     sessions +1,400%, qualified leads +713%
//
// PLACEHOLDER. Everything else numeric on the page lives in this file and is
// marked below — the revenue series, the market/channel splits, the platform
// list, the page-build count and names, the testimonial, and the hero meta.
// Swap the values here and the page needs no other edit.

export type Objective = { n: string; title: string; body: string };

export type Result = {
  label: string;
  /** Numeric target for the count-up. Rendered as `${prefix}${value}${suffix}`. */
  value: number;
  prefix?: string;
  suffix?: string;
  sub: string;
  /** Accent-tinted headline cell — the revenue number leads the grid. */
  lead?: boolean;
};

/** One month of online revenue, in $K. 24 points, oldest first. */
export type RevenuePoint = { month: string; value: number };

export type Bar = { label: string; pct: number; note?: string };

export type Platform = { name: string; cat: string };

/** A shipped page build. Drop a screenshot path into `image` and it replaces
 *  the schematic thumbnail — production needs ~500×380 @2x for the 250×190 slot. */
export type PageBuild = {
  name: string;
  type: string;
  thumb: "hero" | "split" | "form" | "grid" | "dark" | "profile" | "list";
  image?: string;
};

export const OEO = {
  client: "Ontario Education Online",
  slug: "ontario-education-online",
  kicker: "Case study — growth",
  industry: "Education · Online learning",
  // PLACEHOLDER — confirm the services line with the account team.
  services: "Digital marketing · Web builds · AI optimization",
  // PLACEHOLDER — engagement start date drives the chart marker too.
  timeline: "Jan 2025 — ongoing",

  h1: { before: "From provincial, to ", underlined: "international", after: "." },
  sub: "Ontario Education Online launched its first digital marketing program with Marked — and went from provincial course provider to international brand in eighteen months.",

  // REAL — the headline number, repeated as the first cell of RESULTS.
  headlineStat: { value: 738, prefix: "+", suffix: "%", label: ["REVENUE", "YEAR OVER YEAR"] },

  objectives: [
    {
      n: "01",
      // REAL — client-approved title.
      title: "Launch Digital Marketing",
      body: "Stand up the brand's first paid media program — tracking, creative and campaigns from a standing start.",
    },
    {
      n: "02",
      // REAL — client-approved title.
      title: "Scale from Provincial to International",
      body: "Take an Ontario institution to students worldwide — new markets, same standard of trust.",
    },
    {
      n: "03",
      // REAL — client-approved title.
      title: "AI Optimization",
      body: "Put AI to work across bidding, budgets and reporting — so efficiency improves as spend scales.",
    },
    {
      n: "04",
      // REAL — client-approved title.
      title: "Increase Revenue",
      body: "Turn traffic into enrolments and enrolments into compounding revenue, quarter over quarter.",
    },
  ] satisfies Objective[],

  // REAL — all four figures are client-reported, year over year.
  results: [
    { label: "REVENUE", value: 738, prefix: "+", suffix: "%", sub: "Year over year, all markets", lead: true },
    { label: "ORDERS", value: 880, prefix: "+", suffix: "%", sub: "Course enrolments, year over year" },
    { label: "SESSIONS", value: 1400, prefix: "+", suffix: "%", sub: "Sitewide traffic, year over year" },
    { label: "QUALIFIED LEADS", value: 713, prefix: "+", suffix: "%", sub: "Marketing-qualified, year over year" },
  ] satisfies Result[],

  revenue: {
    title: "From $10K to $128K a month.",
    body: "January 2025: first paid campaigns live, course pages rebuilt, AI-run optimization switched on. Monthly run rate grew 12.8× in eighteen months.",
    rangeLabel: "JUL 2024 — JUN 2026",
    // PLACEHOLDER — 24 months of online revenue in $K. Index 6 (Jan '25) is
    // where the engagement starts; everything before it is the flat baseline.
    engagementIndex: 6,
    gridlines: [30, 60, 90, 120],
    series: [
      { month: "JUL '24", value: 10 },
      { month: "AUG '24", value: 11 },
      { month: "SEP '24", value: 10 },
      { month: "OCT '24", value: 11 },
      { month: "NOV '24", value: 11 },
      { month: "DEC '24", value: 12 },
      { month: "JAN '25", value: 13 },
      { month: "FEB '25", value: 15 },
      { month: "MAR '25", value: 19 },
      { month: "APR '25", value: 24 },
      { month: "MAY '25", value: 30 },
      { month: "JUN '25", value: 38 },
      { month: "JUL '25", value: 47 },
      { month: "AUG '25", value: 55 },
      { month: "SEP '25", value: 64 },
      { month: "OCT '25", value: 72 },
      { month: "NOV '25", value: 81 },
      { month: "DEC '25", value: 88 },
      { month: "JAN '26", value: 95 },
      { month: "FEB '26", value: 103 },
      { month: "MAR '26", value: 110 },
      { month: "APR '26", value: 116 },
      { month: "MAY '26", value: 122 },
      { month: "JUN '26", value: 128 },
    ] satisfies RevenuePoint[],
  },

  traffic: {
    title: "Sessions up 1,400% YoY.",
    body: "Paid search and social opened new markets; organic and email compound them. International sessions went from 4% of traffic to the majority in five quarters.",
    // PLACEHOLDER — market split and the at-start footnote.
    markets: [
      { label: "INTERNATIONAL", pct: 57 },
      { label: "CANADA", pct: 43 },
    ] satisfies Bar[],
    marketsFootnote: "INTERNATIONAL SHARE AT ENGAGEMENT START: 4%",
    // PLACEHOLDER — channel shares and YoY deltas.
    channels: [
      { label: "PAID SEARCH", pct: 38, note: "NEW CHANNEL" },
      { label: "PAID SOCIAL", pct: 24, note: "NEW CHANNEL" },
      { label: "ORGANIC", pct: 21, note: "+310% YOY" },
      { label: "EMAIL & SMS", pct: 10, note: "+540% YOY" },
      { label: "DIRECT", pct: 7, note: "+96% YOY" },
    ] satisfies Bar[],
  },

  stack: {
    title: "12 platforms. One system.",
    body: "Wired end-to-end so a dollar of media, a page build and an email all report into the same picture of growth.",
    // PLACEHOLDER — confirm the actual engagement stack.
    platforms: [
      { name: "Shopify", cat: "COMMERCE" },
      { name: "Google Ads", cat: "PAID SEARCH" },
      { name: "Meta Ads", cat: "PAID SOCIAL" },
      { name: "Klaviyo", cat: "EMAIL & SMS" },
      { name: "GA4", cat: "ANALYTICS" },
      { name: "Tag Manager", cat: "TRACKING" },
      { name: "HubSpot", cat: "CRM & LEADS" },
      { name: "Claude", cat: "AI SYSTEMS" },
      { name: "Semrush", cat: "SEO" },
      { name: "Hotjar", cat: "CRO & HEATMAPS" },
      { name: "Figma", cat: "DESIGN" },
      { name: "Zendesk", cat: "SUPPORT" },
    ] satisfies Platform[],
  },

  shipped: {
    // PLACEHOLDER — build count and card names.
    title: "26 page builds in 18 months.",
    body: "Every course launch, market and campaign got a purpose-built page — designed, shipped and instrumented as one motion.",
    more: 19,
    pages: [
      { name: "Homepage 2.0", type: "CORE SITE", thumb: "hero" },
      { name: "Course page — enrol-first", type: "TEMPLATE", thumb: "split" },
      { name: "Program finder", type: "TOOL", thumb: "form" },
      { name: "Course catalogue", type: "TEMPLATE", thumb: "grid" },
      { name: "Summer school LP", type: "CAMPAIGN", thumb: "dark" },
      { name: "International students hub", type: "MARKET", thumb: "profile" },
      { name: "Student stories hub", type: "CONTENT", thumb: "list" },
    ] satisfies PageBuild[],
    // PLACEHOLDER — swap for real captures of the legacy and rebuilt page.
    compare: {
      label: "BEFORE / AFTER — COURSE PAGE REBUILD",
      caption: "DRAG TO COMPARE — LEGACY COURSE PAGE VS. REBUILT ENROL-FIRST TEMPLATE",
      beforeImage: undefined as string | undefined,
      afterImage: undefined as string | undefined,
    },
  },

  approach: {
    title: "Diagnose. Engineer. Compound.",
    body: "A system that compounds — not a campaign that ends. Three phases, run as one motion.",
    phases: [
      {
        n: "01",
        title: "Diagnose",
        period: "Q1 2025",
        body: "Full-funnel audit: analytics, tracking, market and keyword sizing. Found where demand was — and what the site couldn't yet convert.",
        bullets: ["TRACKING & ANALYTICS REBUILT", "MARKET + KEYWORD SIZING", "CONVERSION AUDIT"],
      },
      {
        n: "02",
        title: "Engineer",
        period: "Q2–Q3 2025",
        body: "The brand's first paid media program went live, course pages were rebuilt to enrol, and AI was wired into bidding, budgets and reporting.",
        bullets: ["FIRST PAID CAMPAIGNS LIVE", "COURSE PAGES REBUILT TO ENROL", "AI BIDDING + REPORTING WIRED"],
      },
      {
        n: "03",
        title: "Compound",
        period: "Q4 2025 →",
        body: "Weekly test cadence across pages, media and email. New markets added quarter over quarter — every win reinvested.",
        bullets: ["WEEKLY TEST CADENCE", "NEW MARKETS QUARTERLY", "WINS REINVESTED INTO MEDIA"],
      },
    ],
  },

  // PLACEHOLDER — replace with a real, approved quote and named attribution
  // before launch.
  quote: {
    body: "Marked doesn't run campaigns for us — they run a system. Every quarter has compounded on the last, and international enrolment is now our biggest driver.",
    attribution: "[CLIENT NAME] — DIRECTOR, ONTARIO EDUCATION ONLINE",
  },
};
