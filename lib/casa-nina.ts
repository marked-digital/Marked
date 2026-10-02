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
//   · no account or listing IDs, hosting or server details, repository URLs
//   · nothing in progress written as done: payments are "to follow", and
//     indexing, rankings and paid campaigns stay off the page until real
//
// 58 days (30 Jul to 26 Sep 2026) is the headline number. It must read the
// same in the hero, results.items[0] and the homepage work card
// (lib/md.ts → WORK[2].metric).
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
  services: "Web build · SEO and AEO · Booking platform",
  timeline: "Since Jul 2026",
  site: { label: "casaninaflamingo.com", href: "https://casaninaflamingo.com" },

  h1: { before: "From an email link, to ", underlined: "direct", after: " booking." },
  sub: "Casa Nina Flamingo sleeps 14 in Playa Flamingo, Costa Rica, and almost no villa nearby can match it. Every booking still went through Airbnb, because “Book direct” opened an email. We gave it a clear position, a site built for booking direct, and a payment route its Costa Rican company can use.",

  // The headline number, repeated as the first cell of results.items.
  headlineStat: { value: 58, suffix: " days", label: ["PROPOSAL TO LAUNCH", "30 JUL TO 26 SEP 2026"] },
  scrollCue: "Scroll to the brief",

  brief: {
    kicker: "/ 01 · The brief",
    heading: "What Casa Nina needed.",
    lede: "A villa for 14 with two independent units, described in phrases any listing could use, and no credible way to book it direct. Four objectives set the work.",
    objectives: [
      {
        n: "01",
        title: "Say why this villa",
        body: "Fourteen guests, two independent units, two kitchens and an elevator are the product, not the amenity list. The site had to lead with that.",
      },
      {
        n: "02",
        title: "Make booking direct credible",
        body: "Swap the email link for a live availability calendar, a structured enquiry form and a stated reply time.",
      },
      {
        n: "03",
        title: "Get found, and get quoted",
        body: "The previous build sat on a preview address Google doesn't index, with no analytics and no Search Console. Build for search engines and AI assistants from the first line.",
      },
      {
        n: "04",
        title: "Find a way to take payments",
        body: "The operating company is incorporated in Costa Rica, and most booking engines' payment gateways won't open an account for one.",
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
      { label: "PROPOSAL TO LAUNCH", value: 58, suffix: " days", sub: "Proposal on 30 Jul 2026, live on its own domain on 26 Sep 2026", lead: true },
      { label: "PAGES LIVE", value: 8, sub: "Hand-built and live since 26 Sep 2026, with GA4 on every one" },
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
    heading: "Generated, not typed.",
    body: "One entity file feeds every page's schema: VacationRental for both units, FAQPage for all 40 answers, breadcrumbs and WebPage nodes. Scripts build the sitemap and robots.txt, and the deploy fails if any of it drifts. GA4 counts the live site only.",
    // Only platforms the source pack names that already exist in STACK_TOOLS.
    // Never add a tool to STACK_TOOLS for this page: that list is the 87 on
    // /stack. Vercel is left out because its STACK_TOOLS role reads as
    // production hosting, which it isn't here.
    platforms: ["GitHub", "Google Analytics"],
  },

  shipped: {
    kicker: "/ 05 · Shipped",
    heading: "Eight pages, built by hand.",
    body: "HTML, CSS and vanilla JavaScript, no framework. Every claim on the site traces to an approved facts bank, and anything unconfirmed stayed off it.",
    scrollHint: "Scroll →",
    pages: [
      { name: "Home", type: "CORE SITE", thumb: "hero", image: "/work/casa-nina-flamingo/home.jpg" },
      { name: "The casa", type: "FLOOR-BY-FLOOR TOUR", thumb: "split", image: "/work/casa-nina-flamingo/the-casa.jpg" },
      { name: "Gallery", type: "84 PHOTOS, 8 ROOMS", thumb: "grid", image: "/work/casa-nina-flamingo/gallery.jpg" },
      { name: "Book", type: "LIVE CALENDAR + ENQUIRY", thumb: "form", image: "/work/casa-nina-flamingo/book.jpg" },
      { name: "FAQ", type: "40 ANSWERS IN SCHEMA", thumb: "list", image: "/work/casa-nina-flamingo/faq.jpg" },
      { name: "Explore", type: "5-CHAPTER GUIDE", thumb: "dark", image: "/work/casa-nina-flamingo/explore.jpg" },
      { name: "Concierge", type: "WHAT EVERY STAY INCLUDES", thumb: "profile", image: "/work/casa-nina-flamingo/concierge.jpg" },
    ],
  },

  approach: {
    kicker: "/ 06 · How it ran",
    heading: "Diagnose. Engineer. Compound.",
    body: "Fifty-eight days from proposal to launch. The third phase is where the numbers start.",
    phases: [
      {
        n: "01",
        title: "Diagnose",
        period: "Jul to Aug 2026",
        body: "The audit found a site Google couldn't index, a booking button that opened an email, and no trust content or measurement. A neighbouring villa's site showed what wins here: a claimed category and a system underneath it.",
        bullets: ["LARGE-GROUP POSITION CLAIMED", "VOICE PROMPT + FACTS BANK", "PAYMENT GATEWAYS CHECKED"],
      },
      {
        n: "02",
        title: "Engineer",
        period: "Aug to Sep 2026",
        body: "Every page was written to one voice prompt and built by hand, down to a seasonal calendar checked against 26 sources. The client's review round logged 43 changes, all applied before launch.",
        bullets: ["8 PAGES, NO FRAMEWORK", "SCHEMA FROM ONE ENTITY FILE", "43 REVIEW CHANGES APPLIED"],
      },
      {
        n: "03",
        title: "Compound",
        period: "26 Sep 2026 →",
        body: "Launched as a deploy onto the hosting the client already paid for, so the domain, nameservers and mailbox never moved. GA4 and Search Console were live from day one. Next: paid search and remarketing, with payments to follow through OwnerRez.",
        bullets: ["LIVE ON CASANINAFLAMINGO.COM", "SITEMAP SUBMITTED ON LAUNCH DAY", "NEXT: PAID SEARCH + REMARKETING"],
      },
    ],
  },
};
