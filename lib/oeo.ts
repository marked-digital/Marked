// Ontario Education Online: growth case study content.
// Rendered by components/case-study.tsx at /work/ontario-education-online.
//
// REAL, client-provided. Do not reword without sign-off:
//   · the 46 cards of the brief (brief.objectives): number, group, title and
//     body, word for word. The page shows the first nine and a "Show all"
//     toggle reveals the rest; all 46 are in the server HTML.
//   · the four year-over-year results (results.items): revenue +1,183%,
//     orders +618%, sessions +1,400%, qualified leads +713%
//
// Revenue (+1,183%) compares Jan to Sep 2026 with the same months in 2025,
// from the client's sales report. Orders, sessions and qualified leads still
// compare Jan to Jul; each result's `sub` names its window. Revenue is the
// single headline number and must read the same in the hero, the results grid,
// the revenue chart and the homepage work slider (lib/md.ts → WORK[0].metric).
// The client's dollar figures stay out of this file: the repo is public.
//
// PLACEHOLDER. Everything else numeric on the page lives in this file and is
// marked below: the revenue series, the market/channel splits, the platform
// list, the page-build count and names, the testimonial, and the hero meta.
// Swap the values here and the page needs no other edit.

import type { CaseStudy } from "@/lib/case-study";

export const OEO: CaseStudy = {
  client: "Ontario Education Online",
  slug: "ontario-education-online",
  kicker: "Case study · Growth",
  industry: "Education · Online learning",
  // PLACEHOLDER: confirm the services line with the account team.
  services: "Digital marketing · Web builds · AI optimization",
  // Engagement began January 2026; this date drives the chart marker too.
  timeline: "Since Jan 2026",

  h1: { before: "From first search, to ", underlined: "enrolment", after: "." },
  sub: "Ontario Education Online had never run a digital marketing program. In nine months, Marked built the whole system: search ads for every course, AI discovery that gets the school cited by ChatGPT and other assistants, a website rebuilt to convert, and tracking that shows which channels produce enrolments.",

  // REAL: the headline number, repeated as the first cell of results.items.
  headlineStat: { value: 1183, prefix: "+", suffix: "%", label: ["REVENUE", "YEAR OVER YEAR"] },
  scrollCue: "Scroll to the brief",

  brief: {
    kicker: "/ 01 · The brief",
    heading: "What we built.",
    lede: "We focused on building from the ground up.",
    // REAL: the scope of work, card for card (see the note at the top).
    objectives: [
      {
        n: "01",
        group: "Foundation",
        title: "Launch Digital Marketing",
        body: "No campaigns, no tracking, no creative library. All three had to be built from scratch.",
      },
      {
        n: "02",
        group: "AI Search",
        title: "AI Discovery and AEO",
        body: "Answer engine optimization that helps ChatGPT and other assistants find, understand and cite OEO. AI referrals now bring in traffic and enrolments.",
      },
      {
        n: "03",
        group: "AI Search",
        title: "Schema Markup",
        body: "HighSchool, FAQPage and VideoObject schema generated from the same content visitors read. The markup never drifts from what's on the page.",
      },
      {
        n: "04",
        group: "AI Search",
        title: "AI Referral Tracking",
        body: "AI assistant referrals reported as their own channel beside organic search, measured on sessions and orders like any other source.",
      },
      {
        n: "05",
        group: "Conversion",
        title: "Enhanced Course Pages",
        body: "Every course page rebuilt around the decision to enrol: sticky enrol card, payment plans, university logos, how-it-works video, student stories, FAQs and a mobile enrol bar.",
      },
      {
        n: "06",
        group: "Conversion",
        title: "Multi-Course Offer",
        body: "A cart message shows how much a student saves by adding another course, in both the cart drawer and the cart page.",
      },
      {
        n: "07",
        group: "Conversion",
        title: "Live Enrolment Counter",
        body: "A running enrolment count on course pages, updated automatically through Shopify Flow, adds social proof without manual upkeep.",
      },
      {
        n: "08",
        group: "Conversion",
        title: "Parent Checkout Field",
        body: "Parents often enrol on a student's behalf. A student name field on each cart item records who the course is for and heads off a common support question.",
      },
      {
        n: "09",
        group: "Conversion",
        title: "Co-op Course Selector",
        body: "Co-op students choose location and credit load as separate options with live pricing, replacing a combined dropdown that was hard to read.",
      },
      {
        n: "10",
        group: "Conversion",
        title: "Price-Synced FAQs",
        body: "Course page FAQs pull prices from the product record. An answer can no longer contradict the price at checkout.",
      },
      {
        n: "11",
        group: "Web Development",
        title: "Full-Time Enrolment Journey",
        body: "A full-time landing page and Grade 9 to 12 program pages, with a guidance call offered right beside checkout for families who want to talk first.",
      },
      {
        n: "12",
        group: "Web Development",
        title: "Virtual Classroom Page",
        body: "A tour of the real course experience through video, screenshots and student stories, built to answer the first question families ask: is this a real school?",
      },
      {
        n: "13",
        group: "Web Development",
        title: "PLAR Landing Page",
        body: "Prior learning assessment gets its own page explaining how outside credits count toward the OSSD, with a purchase path and a free guidance option.",
      },
      {
        n: "14",
        group: "Web Development",
        title: "International Students Page",
        body: "Students outside Canada get a dedicated page covering credentials, university pathways and how to reach an advisor.",
      },
      {
        n: "15",
        group: "Web Development",
        title: "FAQ Page Rebuild",
        body: "The FAQ page now has topic navigation, a fixed sidebar, a direct link to each answer and structured data behind every question.",
      },
      {
        n: "16",
        group: "Web Development",
        title: "Homepage Rebuild",
        body: "New homepage messaging and value propositions, a hero carousel built for mobile and a custom icon set to match.",
      },
      {
        n: "17",
        group: "Web Development",
        title: "Footer and Privacy Policy",
        body: "A rebuilt footer that leads with the Ministry BSID badge and links to a newly published privacy policy.",
      },
      {
        n: "18",
        group: "Web Development",
        title: "Shared Design System",
        body: "One token file for colour, type and spacing, with the course page as the reference. New sections match without one-off styling.",
      },
      {
        n: "19",
        group: "Web Development",
        title: "Theme Workflow and QA",
        body: "A version-controlled theme with staging and live branches. Changes pass automated theme checks and desktop and mobile screenshot reviews before they ship.",
      },
      {
        n: "20",
        group: "Paid Media",
        title: "Search Campaign Architecture",
        body: "Separate Google Ads campaigns for school-level searches, course codes, full-time enrolment, students across Canada and competitor terms, each with its own budget and message.",
      },
      {
        n: "21",
        group: "Paid Media",
        title: "Course-Level Ad Groups",
        body: "An ad group and keyword set for each course in the catalogue, built from Search Console data, including the ways students mistype course codes.",
      },
      {
        n: "22",
        group: "Paid Media",
        title: "Ad Copy and Assets",
        body: "Course-specific search ads with sitelinks, callouts and image assets, each written to match the page it lands on.",
      },
      {
        n: "23",
        group: "Paid Media",
        title: "Negative Keyword System",
        body: "Layered shared lists block junk searches account-wide, stop campaigns competing with each other and send each query to the campaign built for it.",
      },
      {
        n: "24",
        group: "Paid Media",
        title: "Search Term Sweeps",
        body: "Every search term in every campaign is reviewed twice a week. Waste gets blocked, and new demand gets keywords of its own.",
      },
      {
        n: "25",
        group: "Paid Media",
        title: "Keyword Pruning",
        body: "Trimmed an oversized keyword list and concentrated spend on the terms that produce orders.",
      },
      {
        n: "26",
        group: "Paid Media",
        title: "Bid Strategy Testing",
        body: "The course-code campaign moved to automated conversion bidding under a written test plan, with a baseline, freeze window and revert rule fixed before the switch.",
      },
      {
        n: "27",
        group: "Paid Media",
        title: "Budget Management",
        body: "Budgets follow each campaign's own trailing return and whether it is losing reach to budget or to ad rank. One change at a time, so every result stays readable.",
      },
      {
        n: "28",
        group: "Paid Media",
        title: "Dayparting",
        body: "Hour-of-day bid cuts tested against real order timestamps. Kept where they saved money without costing sales, skipped where late hours performed best.",
      },
      {
        n: "29",
        group: "Paid Media",
        title: "Full-Time Enrolment Campaign",
        body: "Full-time enrolment runs as its own campaign, with grade-level and adult learner ad groups, judged on guidance bookings as well as purchases.",
      },
      {
        n: "30",
        group: "Paid Media",
        title: "Launch-Ready Ad Groups",
        body: "Ad groups for new courses and services are built in advance and switched on the day each product launches.",
      },
      {
        n: "31",
        group: "Paid Media",
        title: "Channel Testing",
        body: "Meta, TikTok and an international search push were each judged against a set bar on bookings and orders, then kept, reshaped or paused on the evidence.",
      },
      {
        n: "32",
        group: "Measurement",
        title: "Tracking Audit",
        body: "Conversion actions reviewed, broken UTM templates on paid social fixed and one tagging standard set for every paid link.",
      },
      {
        n: "33",
        group: "Measurement",
        title: "Click ID Capture",
        body: "First-party cookies store Google, Meta and TikTok click IDs with UTMs and pass them into the booking form, tying each guidance call back to its source.",
      },
      {
        n: "34",
        group: "Measurement",
        title: "Offline Conversion Imports",
        body: "Guidance bookings flow back into Google Ads as offline conversions, crediting campaigns for the calls they generate and not only for checkout purchases.",
      },
      {
        n: "35",
        group: "Measurement",
        title: "Revenue Reconciliation",
        body: "Ad platform claims are checked against Shopify orders by campaign before any budget decision. Shopify is the record of truth.",
      },
      {
        n: "36",
        group: "Measurement",
        title: "Lead-to-Enrolment Analysis",
        body: "Booking records matched against Shopify orders to show how often a guidance call becomes an enrolment, and how quickly.",
      },
      {
        n: "37",
        group: "Measurement",
        title: "Seasonal Demand Planning",
        body: "The school-year demand curve mapped from order history, with budget rules set before the quiet months arrive instead of after.",
      },
      {
        n: "38",
        group: "Email and Creative",
        title: "Guidance Follow-Up Sequence",
        body: "A three-part Klaviyo sequence for families who book a guidance call, written to CASL consent rules with tracked links throughout.",
      },
      {
        n: "39",
        group: "Email and Creative",
        title: "Deadline Campaigns",
        body: "Deadline-driven email campaigns around term start and the exam rule change, plus a feature email for the full-time program.",
      },
      {
        n: "40",
        group: "Email and Creative",
        title: "Creative Briefs",
        body: "Design handoffs for new pages and briefs for homepage banners, with copy, colour and layout settled before design starts.",
      },
      {
        n: "41",
        group: "Strategy and Reporting",
        title: "Competitive Positioning",
        body: "An audit of the major Ontario online schools, then value propositions rebuilt around the differences that hold up: attendance flexibility and AI study tools in every course.",
      },
      {
        n: "42",
        group: "Strategy and Reporting",
        title: "Exam Rule Change Rollout",
        body: "When Ontario made final exams mandatory, every claim across the site, ads, emails and product listings was audited and rewritten before the deadline.",
      },
      {
        n: "43",
        group: "Strategy and Reporting",
        title: "Monthly Reporting",
        body: "The same report structure every month, covering sales, channels, campaign returns, bookings and AI and organic trends from Shopify and GA4.",
      },
      {
        n: "44",
        group: "Strategy and Reporting",
        title: "Growth Planning",
        body: "A fiscal-year plan ranking initiatives across search, remarketing, new channels, AI search and on-site conversion by likely impact.",
      },
      {
        n: "45",
        group: "Strategy and Reporting",
        title: "Documentation and Handover",
        body: "Update guides that let OEO's team manage course pages on their own, plus written records that keep every decision on file.",
      },
      {
        n: "46",
        group: "Outcome",
        title: "Increase Revenue",
        body: "Turn traffic into enrolments, then reinvest the return so each quarter builds on the last.",
      },
    ],
  },

  results: {
    kicker: "/ 02 · The results",
    heading: "Nine months in.",
    // REAL: all four figures are client-reported, year over year.
    items: [
      { label: "REVENUE", value: 1183, prefix: "+", suffix: "%", sub: "Jan to Sep 2026 vs. 2025, all markets", lead: true },
      { label: "ORDERS", value: 618, prefix: "+", suffix: "%", sub: "Course enrolments, Jan to Jul 2026 vs. 2025" },
      // Same figure as +1,400%, abbreviated: the full form overflowed its cell.
      { label: "SESSIONS", value: 1.4, prefix: "+", suffix: "K%", decimals: 1, sub: "Sitewide traffic, Jan to Jul 2026 vs. 2025" },
      { label: "QUALIFIED LEADS", value: 713, prefix: "+", suffix: "%", sub: "Marketing-qualified, Jan to Jul 2026 vs. 2025" },
    ],
  },

  revenue: {
    kicker: "/ 03 · Revenue",
    // REAL: +1,183%, Jan to Sep 2026 vs. the same months in 2025 (12.8 times
    // the revenue). Same number as the headline stat and results.items[0]; the
    // chart must not tell a different story from the grid above it.
    heading: "Revenue up 1,183% year over year.",
    body: "The first campaigns went live in January, the course pages were rebuilt through the spring, and AI optimization went on top of both. January to September brought in 12.8 times the revenue of the same months in 2025.",
    chartHead: "Online revenue, indexed. Engagement start = 100",
    rangeLabel: "JUL 2025 TO SEP 2026",
    ariaLabel:
      "Monthly online revenue indexed to 100 at the January 2026 engagement start, July 2025 to September 2026, rising to +1,183% by September 2026.",
    // Indexed, not absolute: 100 is the monthly run rate at engagement start
    // (Jan 2026, index 6). Everything before it is the flat baseline. The final
    // point is 1283, i.e. +1,183%, and it must stay consistent with `endLabel`.
    // PLACEHOLDER: the months in between are illustrative. To publish real
    // figures, keep them indexed: divide each month by the Jan 2026 month and
    // multiply by 100.
    baseLabel: "INDEX 100",
    engagementIndex: 6,
    markerLabel: "ENGAGEMENT BEGINS",
    endLabel: "+1,183%",
    gridlines: [400, 800, 1200],
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
      { label: "AUG '26", value: 905 },
      { label: "SEP '26", value: 1283 },
    ],
  },

  split: {
    kicker: "/ 04 · Traffic",
    heading: "Sessions up 1,400% YoY.",
    body: "Paid search and social opened the new markets. Organic and email keep compounding them. International traffic went from 4% of sessions to the majority inside seven months.",
    // PLACEHOLDER: market split and the at-start footnote.
    primary: {
      label: "Sessions by market",
      bars: [
        { label: "INTERNATIONAL", pct: 57 },
        { label: "CANADA", pct: 43 },
      ],
      footnote: "INTERNATIONAL SHARE AT ENGAGEMENT START: 4%",
    },
    // PLACEHOLDER: channel shares and YoY deltas.
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
    // PLACEHOLDER: confirm the actual engagement stack. Each entry must match
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
    // PLACEHOLDER: build count and card names.
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
    // PLACEHOLDER: swap for real captures of the legacy and rebuilt page.
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

  // PLACEHOLDER: replace with a real, approved quote and named attribution
  // before launch.
  quote: {
    body: "Marked doesn't run campaigns for us, they run a system. Every quarter has built on the last, and international enrolment is now our biggest driver.",
    attribution: "[CLIENT NAME] · DIRECTOR, ONTARIO EDUCATION ONLINE",
  },
};
