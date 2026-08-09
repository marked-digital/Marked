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
  /** Decimal places to hold while counting — e.g. 1 for "1.4K%". */
  decimals?: number;
  sub: string;
  /** Accent-tinted headline cell — the revenue number leads the grid. */
  lead?: boolean;
};

/**
 * One month of online revenue, indexed to 100 at the engagement start. Absolute
 * dollar figures are deliberately not published — the index carries the shape
 * and the growth rate without disclosing the client's revenue.
 */
export type RevenuePoint = { month: string; value: number };

export type Bar = { label: string; pct: number; note?: string };

/** Name of an entry in STACK_TOOLS (lib/md.ts) — the case study renders the
 *  platform's real logo, colour and role from the same source as /stack. */
export type Platform = string;

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
  // Engagement began January 2026; this date drives the chart marker too.
  timeline: "Jan 2026 — ongoing",

  h1: { before: "From provincial, to ", underlined: "international", after: "." },
  sub: "Ontario Education Online launched its first digital marketing program with Marked — and went from provincial course provider to international brand in seven months.",

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
    // Same figure as +1,400%, abbreviated: the full form overflowed its cell.
    { label: "SESSIONS", value: 1.4, prefix: "+", suffix: "K%", decimals: 1, sub: "Sitewide traffic, year over year" },
    { label: "QUALIFIED LEADS", value: 713, prefix: "+", suffix: "%", sub: "Marketing-qualified, year over year" },
  ] satisfies Result[],

  revenue: {
    // REAL — +538% between Jan 2026 and Jul 2026, the engagement to date.
    growthPct: 538,
    title: "Revenue up 538% in seven months.",
    body: "January 2026: first paid campaigns live, course pages rebuilt, AI-run optimization switched on. Monthly revenue ran at 6.4× its pre-engagement baseline by July.",
    rangeLabel: "JUL 2025 — JUL 2026",
    // Indexed, not absolute — 100 is the monthly run rate at engagement start
    // (Jan 2026, index 6). Everything before it is the flat baseline. The final
    // point is 638, i.e. +538%. To publish real figures, keep them indexed:
    // divide each month by the Jan 2026 month and multiply by 100.
    indexBase: 100,
    engagementIndex: 6,
    gridlines: [200, 400, 600],
    series: [
      { month: "JUL '25", value: 96 },
      { month: "AUG '25", value: 100 },
      { month: "SEP '25", value: 97 },
      { month: "OCT '25", value: 99 },
      { month: "NOV '25", value: 101 },
      { month: "DEC '25", value: 98 },
      { month: "JAN '26", value: 100 },
      { month: "FEB '26", value: 128 },
      { month: "MAR '26", value: 172 },
      { month: "APR '26", value: 244 },
      { month: "MAY '26", value: 350 },
      { month: "JUN '26", value: 470 },
      { month: "JUL '26", value: 638 },
    ] satisfies RevenuePoint[],
  },

  traffic: {
    title: "Sessions up 1,400% YoY.",
    body: "Paid search and social opened new markets; organic and email compound them. International sessions went from 4% of traffic to the majority in seven months.",
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
    // PLACEHOLDER — confirm the actual engagement stack. Each entry must match
    // a `name` in STACK_TOOLS (lib/md.ts); the logo, brand colour and role all
    // come from there, so these tiles stay identical to the /stack page.
    platforms: [
      "Shopify",
      "Google Ads",
      "Meta Ads",
      "Klaviyo",
      "Google Analytics",
      "Google Tag Manager",
      "HubSpot",
      "Claude",
      "Semrush",
      "Hotjar",
      "Figma",
      "Zendesk",
    ] satisfies Platform[],
  },

  shipped: {
    // PLACEHOLDER — build count and card names.
    title: "26 page builds in seven months.",
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
        period: "Q1 2026",
        body: "Full-funnel audit: analytics, tracking, market and keyword sizing. Found where demand was — and what the site couldn't yet convert.",
        bullets: ["TRACKING & ANALYTICS REBUILT", "MARKET + KEYWORD SIZING", "CONVERSION AUDIT"],
      },
      {
        n: "02",
        title: "Engineer",
        period: "Q2 2026",
        body: "The brand's first paid media program went live, course pages were rebuilt to enrol, and AI was wired into bidding, budgets and reporting.",
        bullets: ["FIRST PAID CAMPAIGNS LIVE", "COURSE PAGES REBUILT TO ENROL", "AI BIDDING + REPORTING WIRED"],
      },
      {
        n: "03",
        title: "Compound",
        period: "Q3 2026 →",
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
