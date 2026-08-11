// Ontario Education Online — growth case study content.
// Rendered by components/case-study.tsx at /work/ontario-education-online.
//
// REAL, client-provided. Do not reword without sign-off:
//   · the four objective titles (brief.objectives[].title)
//   · the four year-over-year results (results.items): revenue +548%,
//     orders +618%, sessions +1,400%, qualified leads +713%
//
// The reporting window for every YoY figure is Jan to Jul 2026 vs. the same
// months in 2025. Revenue (+548%) is the single headline number and must read
// the same in the hero, the results grid, the revenue chart and the homepage
// work slider (lib/md.ts → WORK[0].metric).
//
// PLACEHOLDER. Everything else numeric on the page lives in this file and is
// marked below — the revenue series, the market/channel splits, the platform
// list, the page-build count and names, the testimonial, and the hero meta.
// Swap the values here and the page needs no other edit.

import type { CaseStudy } from "@/lib/case-study";

export const OEO: CaseStudy = {
  client: "Ontario Education Online",
  slug: "ontario-education-online",
  kicker: "Case study · Growth",
  industry: "Education · Online learning",
  // PLACEHOLDER — confirm the services line with the account team.
  services: "Digital marketing · Web builds · AI optimization",
  // Engagement began January 2026; this date drives the chart marker too.
  timeline: "Since Jan 2026",

  h1: { before: "From provincial, to ", underlined: "international", after: "." },
  sub: "Ontario Education Online had never run a digital marketing program. Seven months after launching its first one with Marked, a provincial course provider was selling to students worldwide.",

  // REAL — the headline number, repeated as the first cell of results.items.
  headlineStat: { value: 548, prefix: "+", suffix: "%", label: ["REVENUE", "YEAR OVER YEAR"] },
  scrollCue: "Scroll to the brief",

  brief: {
    kicker: "/ 01 · The brief",
    heading: "What OEO needed.",
    lede: "A trusted Ontario course provider with no digital marketing to speak of, selling a product anyone in the world could buy. We set four objectives.",
    objectives: [
      {
        n: "01",
        // REAL — client-approved title.
        title: "Launch Digital Marketing",
        body: "No campaigns, no tracking, no creative library. All three had to be built from scratch.",
      },
      {
        n: "02",
        // REAL — client-approved title.
        title: "Scale from Provincial to International",
        body: "Reach students well outside Ontario while keeping the credibility the institution trades on at home.",
      },
      {
        n: "03",
        // REAL — client-approved title.
        title: "AI Optimization",
        body: "Put AI into bidding, budget pacing and reporting so efficiency holds as spend grows.",
      },
      {
        n: "04",
        // REAL — client-approved title.
        title: "Increase Revenue",
        body: "Turn traffic into enrolments, then reinvest the return so each quarter builds on the last.",
      },
    ],
  },

  results: {
    kicker: "/ 02 · The results",
    heading: "Seven months in.",
    // REAL — all four figures are client-reported, year over year.
    items: [
      { label: "REVENUE", value: 548, prefix: "+", suffix: "%", sub: "Jan to Jul 2026 vs. 2025, all markets", lead: true },
      { label: "ORDERS", value: 618, prefix: "+", suffix: "%", sub: "Course enrolments, Jan to Jul 2026 vs. 2025" },
      // Same figure as +1,400%, abbreviated: the full form overflowed its cell.
      { label: "SESSIONS", value: 1.4, prefix: "+", suffix: "K%", decimals: 1, sub: "Sitewide traffic, year over year" },
      { label: "QUALIFIED LEADS", value: 713, prefix: "+", suffix: "%", sub: "Marketing-qualified, year over year" },
    ],
  },

  revenue: {
    kicker: "/ 03 · Revenue",
    // REAL — +548% between Jan 2026 and Jul 2026, the engagement to date. Same
    // number as the headline stat and results.items[0]; the chart must not tell
    // a different story from the grid above it.
    heading: "Revenue up 548% in seven months.",
    body: "The first campaigns went live in January, the course pages were rebuilt through the spring, and AI optimization went on top of both. By July, monthly revenue was running at 6.5 times its pre-engagement baseline.",
    chartHead: "Online revenue, indexed. Engagement start = 100",
    rangeLabel: "JUL 2025 TO JUL 2026",
    ariaLabel:
      "Monthly online revenue indexed to 100 at the January 2026 engagement start, July 2025 to July 2026, rising to +548% by July 2026.",
    // Indexed, not absolute — 100 is the monthly run rate at engagement start
    // (Jan 2026, index 6). Everything before it is the flat baseline. The final
    // point is 648, i.e. +548% — it must stay consistent with `endLabel`. To
    // publish real figures, keep them indexed: divide each month by the
    // Jan 2026 month and multiply by 100.
    baseLabel: "INDEX 100",
    engagementIndex: 6,
    markerLabel: "ENGAGEMENT BEGINS",
    endLabel: "+548%",
    gridlines: [200, 400, 600],
    series: [
      { label: "JUL '25", value: 96 },
      { label: "AUG '25", value: 100 },
      { label: "SEP '25", value: 97 },
      { label: "OCT '25", value: 99 },
      { label: "NOV '25", value: 101 },
      { label: "DEC '25", value: 98 },
      { label: "JAN '26", value: 100 },
      { label: "FEB '26", value: 128 },
      { label: "MAR '26", value: 172 },
      { label: "APR '26", value: 244 },
      { label: "MAY '26", value: 352 },
      { label: "JUN '26", value: 476 },
      { label: "JUL '26", value: 648 },
    ],
  },

  split: {
    kicker: "/ 04 · Traffic",
    heading: "Sessions up 1,400% YoY.",
    body: "Paid search and social opened the new markets. Organic and email keep compounding them. International traffic went from 4% of sessions to the majority inside seven months.",
    // PLACEHOLDER — market split and the at-start footnote.
    primary: {
      label: "Sessions by market",
      bars: [
        { label: "INTERNATIONAL", pct: 57 },
        { label: "CANADA", pct: 43 },
      ],
      footnote: "INTERNATIONAL SHARE AT ENGAGEMENT START: 4%",
    },
    // PLACEHOLDER — channel shares and YoY deltas.
    secondary: {
      label: "Sessions by channel, share of total",
      bars: [
        { label: "PAID SEARCH", pct: 38, note: "NEW CHANNEL" },
        { label: "PAID SOCIAL", pct: 24, note: "NEW CHANNEL" },
        { label: "ORGANIC", pct: 21, note: "+310% YOY" },
        { label: "EMAIL & SMS", pct: 10, note: "+540% YOY" },
        { label: "DIRECT", pct: 7, note: "+96% YOY" },
      ],
    },
  },

  stack: {
    kicker: "/ 05 · The stack",
    heading: "14 platforms. One system.",
    body: "All of it wired together, so a dollar of media, a page build and an email report into the same view of growth.",
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
      "Airtable",
      "n8n",
      "GitHub",
      "Visual Studio Code",
    ],
  },

  shipped: {
    kicker: "/ 06 · Shipped",
    // PLACEHOLDER — build count and card names.
    heading: "26 page builds in seven months.",
    body: "Every course launch, market and campaign got its own page, designed, shipped and instrumented by the same team.",
    scrollHint: "Scroll →",
    more: { count: 19, label: "More pages" },
    pages: [
      { name: "Homepage 2.0", type: "CORE SITE", thumb: "hero" },
      { name: "Enrol-first course page", type: "TEMPLATE", thumb: "split" },
      { name: "Program finder", type: "TOOL", thumb: "form" },
      { name: "Course catalogue", type: "TEMPLATE", thumb: "grid" },
      { name: "Summer school LP", type: "CAMPAIGN", thumb: "dark" },
      { name: "International students hub", type: "MARKET", thumb: "profile" },
      { name: "Student stories hub", type: "CONTENT", thumb: "list" },
    ],
    // PLACEHOLDER — swap for real captures of the legacy and rebuilt page.
    compare: {
      label: "BEFORE / AFTER · COURSE PAGE REBUILD",
      caption: "DRAG TO COMPARE: LEGACY COURSE PAGE VS. REBUILT ENROL-FIRST TEMPLATE",
      beforeImage: undefined,
      afterImage: undefined,
      beforeAlt: "The legacy course page, before the rebuild",
      afterAlt: "The rebuilt enrol-first course page",
    },
  },

  approach: {
    kicker: "/ 07 · How it ran",
    heading: "Diagnose. Engineer. Compound.",
    body: "A system that keeps compounding rather than a campaign that ends. Three phases, and the third one is still running.",
    phases: [
      {
        n: "01",
        title: "Diagnose",
        period: "Q1 2026",
        body: "A full-funnel audit across analytics, tracking, market sizing and keywords. It showed us where the demand already was, and what the site couldn't yet convert.",
        bullets: ["TRACKING & ANALYTICS REBUILT", "MARKET + KEYWORD SIZING", "CONVERSION AUDIT"],
      },
      {
        n: "02",
        title: "Engineer",
        period: "Q2 2026",
        body: "The brand's first paid media program went live, the course pages were rebuilt around enrolment, and AI went into bidding, budgets and reporting.",
        bullets: ["FIRST PAID CAMPAIGNS LIVE", "COURSE PAGES REBUILT TO ENROL", "AI BIDDING + REPORTING WIRED"],
      },
      {
        n: "03",
        title: "Compound",
        period: "Q3 2026 →",
        body: "We test weekly across pages, media and email, add markets each quarter, and put every win back into media.",
        bullets: ["WEEKLY TEST CADENCE", "NEW MARKETS QUARTERLY", "WINS REINVESTED INTO MEDIA"],
      },
    ],
  },

  // PLACEHOLDER — replace with a real, approved quote and named attribution
  // before launch.
  quote: {
    body: "Marked doesn't run campaigns for us, they run a system. Every quarter has built on the last, and international enrolment is now our biggest driver.",
    attribution: "[CLIENT NAME] · DIRECTOR, ONTARIO EDUCATION ONLINE",
  },
};
