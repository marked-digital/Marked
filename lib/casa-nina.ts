// Casa Nina Flamingo: direct-booking villa site case study.
// Rendered by components/case-study.tsx at /work/casa-nina-flamingo.
//
// Every fact here comes from the Casa Nina case study source pack, which lives
// outside this repo. Nothing on this page is illustrative and nothing is a
// placeholder. In the first weeks after launch the publishable results are
// what shipped plus the first Lighthouse run, so the results carry those and
// the revenue chart and channel split are omitted. Add performance numbers
// only once they are measured, each with its date range and source.
//
// This repo is public, so these comments follow the same rules as the page:
//   · never name the owners, staff, concierge or guests; never quote guests
//   · no prices, rates, fees, hours, invoice figures or subscription costs
//   · no account or listing IDs, server details or repository URLs (the
//     platforms used, hosting included, are named on the stack, nothing more)
//   · nothing in progress written as done: payments are "to follow", and
//     indexing, rankings and paid campaigns stay off the page until real
//
// 45 days (12 Aug to 26 Sep 2026) is the headline number: from breaking
// ground, the day hosting access came through, to launch. The 30 Jul proposal
// is not the start. It must read the same in the hero, results.items[0], the
// approach body, the homepage work card (lib/md.ts → WORK[2].metric), the page
// description and public/llms.txt.
//
// Lighthouse: the scorecard is one run on the homepage, 2 Oct 2026. Replace
// it whole with a newer run rather than mixing runs, and keep `meta` dated.
//
// Measured results to add later, each into results.items with its window:
//   · Lighthouse on the booking page, plus the second form factor
//   · Search Console pages indexed, impressions and clicks
//   · direct enquiries per month and enquiry conversion rate (GA4)
//   · direct versus Airbnb booking split, once payments are live
//
// No quote yet. The only quote this page may carry is the owners' approved
// testimonial, verbatim, attributed "OWNER, CASA NINA FLAMINGO" with no
// personal name.
//
// Screenshots: each shipped page card shows a 500×380 capture of that page's
// first screen at 1280×973, taken from the built site on 2 Oct 2026, in
// public/work/casa-nina-flamingo/. When the site changes, recapture the set
// whole rather than mixing old and new captures.

import type { CaseStudy } from "@/lib/case-study";

export const CASA_NINA: CaseStudy = {
  client: "Casa Nina Flamingo",
  slug: "casa-nina-flamingo",
  kicker: "Case study · Web build",
  industry: "Vacation rental",
  services: "Web build · SEO, AEO and GEO · Booking platform",
  timeline: "Since Aug 2026",
  site: { label: "casaninaflamingo.com", href: "https://casaninaflamingo.com" },

  h1: { before: "From another Listing, to Discovered and ", underlined: "Recommended", after: "." },
  sub: "Casa Nina Flamingo sleeps 14 in Playa Flamingo, Costa Rica, and almost no villa nearby can match it. Yet every booking went through Airbnb, so it was another listing. We brought it to life on its own premium site, built to be discovered and recommended, and to encourage direct bookings.",

  // The headline number, repeated as the first cell of results.items.
  headlineStat: { value: 45, suffix: " days", label: ["BREAKING GROUND TO LAUNCH", "12 AUG TO 26 SEP 2026"] },
  scrollCue: "Scroll to the brief",

  brief: {
    kicker: "/ 01 · The brief",
    heading: "What Casa Nina needed.",
    lede: "A rebuild from scratch: one new website, built to turn visits into direct bookings and to be found in search, in answer engines and by the AI crawlers behind generative search. Advertising comes next; this phase was the foundation. Four objectives set the work.",
    objectives: [
      {
        n: "01",
        title: "Rebuild from scratch",
        body: "The previous build sat on a preview address Google doesn't index, with no analytics and no Search Console. The new site went up on the client's own domain and hosting, measured from day one.",
      },
      {
        n: "02",
        title: "Convert direct bookings",
        body: "Lead with what almost no villa nearby can match: room for 14 across two independent units. Then give guests a clear way to book direct, with a live availability calendar and an enquiry form.",
      },
      {
        n: "03",
        title: "Get found in search",
        body: "Structured data on every page, a generated sitemap and robots.txt, and 40 confirmed answers in FAQ schema, so Google and Bing can read exactly what the villa is.",
      },
      {
        n: "04",
        title: "Get quoted by AI",
        body: "Answer engines and generative search quote what they can parse. Every crawler is welcome, AI crawlers included, and an llms.txt states the villa's facts in plain language.",
      },
    ],
  },

  results: {
    kicker: "/ 02 · The results",
    heading: "Live, and measured from day one.",
    // One Google Lighthouse run on the homepage, as captured. Don't round,
    // average or mix in other runs.
    scorecard: {
      head: "GOOGLE LIGHTHOUSE · HOMEPAGE",
      meta: "2 OCT 2026",
      scores: [
        { label: "Performance", value: 98 },
        { label: "Accessibility", value: 93 },
        { label: "Best practices", value: 100 },
        { label: "SEO", value: 100 },
      ],
      ratio: { label: "Agentic browsing", passed: 3, total: 3 },
      note: "Agentic browsing is Lighthouse's experimental category for how well AI agents can read and use a page. It counts checks passed instead of scoring out of 100.",
    },
    items: [
      { label: "BREAKING GROUND TO LAUNCH", value: 45, suffix: " days", sub: "From 12 Aug 2026, when hosting access came through, to live on its own domain on 26 Sep 2026", lead: true },
      { label: "NEW WEBSITE", value: 1, sub: "Built from scratch for conversion, SEO, AEO and GEO" },
      { label: "PAGES LIVE", value: 7, sub: "Hand-built and live since 26 Sep 2026, with GA4 on every one" },
      { label: "FAQ ANSWERS", value: 40, sub: "Confirmed by the client before launch, all 40 in FAQPage schema" },
      { label: "PHOTOGRAPHS", value: 84, sub: "Placed and described across eight rooms, at launch" },
    ],
  },

  finding: {
    kicker: "/ 03 · The finding",
    heading: "The gateway checks the company, not the card.",
    body: "The villa's operating company is incorporated in Costa Rica. Merchant eligibility follows the country of incorporation, not where a guest's card was issued or where the money settles, and “supports Costa Rica” on a platform's site can mean the software only. So every gateway was checked one by one, before any booking software was chosen.",
    cardHead: "GATEWAY CHECK · COSTA RICAN COMPANY",
    cardMeta: "AUG 2026",
    checks: [
      { name: "Stripe", verdict: "Ruled out", note: "A Costa Rican company can't open an account." },
      { name: "Lodgify", verdict: "Ruled out", note: "Its payment gateways wouldn't onboard the company." },
      {
        name: "OwnerRez",
        verdict: "Selected",
        note: "Processor-agnostic, with gateways that accept Costa Rican merchants and two-way sync with the existing Airbnb listings.",
        selected: true,
      },
    ],
    routesLabel: "TWO PAYMENT ROUTES, BOTH COMPATIBLE WITH OWNERREZ",
    routes: [
      { name: "Tilopay", role: "Fast start", body: "About 48 hours to set up, with payment links, Apple Pay and SINPE." },
      { name: "Powertranz", role: "Longer-term route", body: "Native card checkout inside OwnerRez with 3-D Secure, with onboarding led by the client's bank." },
    ],
    status: "Today the site takes direct enquiries against a live calendar, with payments to follow through OwnerRez.",
  },

  stack: {
    kicker: "/ 04 · The plumbing",
    // Keep this count equal to `platforms.length`.
    heading: "6 platforms. One system.",
    body: "Versioned in GitHub, previewed on Vercel, live on the Spaceship hosting the client already had. One entity file feeds every page's schema, an llms.txt describes the villa for AI assistants, and Search Console and Bing Webmaster Tools show how both engines read it.",
    // Names resolve against STACK_TOOLS; the objects are platforms this
    // engagement used that aren't on /stack, or a listed tool whose role was
    // different here. Never add a tool to STACK_TOOLS for this page: that list
    // is the 87 on /stack.
    platforms: [
      "GitHub",
      // On /stack as edge hosting; here it served the build previews only.
      { name: "Vercel", role: "Preview deploys" },
      { name: "Spaceship", role: "Production hosting", color: "#394EFF", mono: "Sp", icon: "spaceship" },
      "Claude",
      { name: "Google Search Console", role: "Google search visibility", color: "#458CF5", mono: "GSC", icon: "googlesearchconsole" },
      // Microsoft's icons were removed from Simple Icons, so this one is the
      // monogram chip, like Microsoft Ads on /stack.
      { name: "Bing Webmaster Tools", role: "Bing search visibility", color: "#00A4EF", mono: "BW" },
    ],
  },

  shipped: {
    kicker: "/ 05 · Shipped",
    heading: "Seven pages, built by hand.",
    body: "HTML, CSS and vanilla JavaScript, no framework. Every claim on the site traces to an approved facts bank, and anything unconfirmed stayed off it.",
    scrollHint: "Scroll →",
    pages: [
      { name: "Home", type: "CORE SITE", thumb: "hero", image: "/work/casa-nina-flamingo/home.jpg", href: "https://casaninaflamingo.com/" },
      { name: "The casa", type: "FLOOR-BY-FLOOR TOUR", thumb: "split", image: "/work/casa-nina-flamingo/the-casa.jpg", href: "https://casaninaflamingo.com/the-casa.html" },
      { name: "Gallery", type: "84 PHOTOS, 8 ROOMS", thumb: "grid", image: "/work/casa-nina-flamingo/gallery.jpg", href: "https://casaninaflamingo.com/gallery.html" },
      { name: "Book", type: "LIVE CALENDAR + ENQUIRY", thumb: "form", image: "/work/casa-nina-flamingo/book.jpg", href: "https://casaninaflamingo.com/book.html" },
      { name: "FAQ", type: "40 ANSWERS IN SCHEMA", thumb: "list", image: "/work/casa-nina-flamingo/faq.jpg", href: "https://casaninaflamingo.com/faq.html" },
      { name: "Explore", type: "5-CHAPTER GUIDE", thumb: "dark", image: "/work/casa-nina-flamingo/explore.jpg", href: "https://casaninaflamingo.com/explore.html" },
      { name: "Concierge", type: "WHAT EVERY STAY INCLUDES", thumb: "profile", image: "/work/casa-nina-flamingo/concierge.jpg", href: "https://casaninaflamingo.com/concierge.html" },
    ],
  },

  approach: {
    kicker: "/ 06 · How it ran",
    heading: "Diagnose. Engineer. Compound.",
    body: "Forty-five days from breaking ground to launch, all of it foundation. Advertising is the next phase, and it builds on this one.",
    phases: [
      {
        n: "01",
        title: "Diagnose",
        period: "Aug 2026",
        body: "The audit found a site Google couldn't index, a booking button that opened an email, and no trust content or measurement. A neighbouring villa's site showed what wins here: a claimed category and a system underneath it.",
        bullets: ["LARGE-GROUP POSITION CLAIMED", "VOICE PROMPT + FACTS BANK", "PAYMENT GATEWAYS CHECKED"],
      },
      {
        n: "02",
        title: "Engineer",
        period: "Aug to Sep 2026",
        body: "A new site, built from scratch by hand and written to one voice prompt, down to a seasonal calendar checked against 26 sources. Its schema, sitemap, robots.txt and llms.txt were built for search engines and AI crawlers alike. The client's review round logged 43 changes, all applied before launch.",
        bullets: ["7 PAGES, NO FRAMEWORK", "SCHEMA FROM ONE ENTITY FILE", "OPEN TO EVERY AI CRAWLER", "43 REVIEW CHANGES APPLIED"],
      },
      {
        n: "03",
        title: "Compound",
        period: "26 Sep 2026 →",
        body: "Launched on the Spaceship hosting the client already paid for, so the domain, nameservers and mailbox never moved. GA4 and Search Console were live from day one, with Bing Webmaster Tools reporting alongside. Next: advertising, starting with paid search and remarketing, and payments to follow through OwnerRez.",
        bullets: ["LIVE ON CASANINAFLAMINGO.COM", "SITEMAP SUBMITTED ON LAUNCH DAY", "NEXT: PAID SEARCH + REMARKETING"],
      },
    ],
  },
};
