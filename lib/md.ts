// Content model for Marked Digital — ported from the Claude Design handoff (shared.jsx).

export const MD = {
  brand: "Marked",
  brandFull: "Marked Digital",
  nav: ["Services", "Work", "Approach", "About"],
  cta: "Book a strategy call",

  hero: {
    eyebrow: "Global growth, engineered",
    h1: ["Make your mark", "in any market."],
    sub: "Marked Digital is the growth partner for e-commerce brands going global — international expansion, AI-run advertising, and conversion-built sites, operated as one compounding system.",
  },

  metrics: [
    { prefix: "+", value: 312, suffix: "%", label: "avg. ROAS lift" },
    { value: 47, suffix: "", label: "markets launched" },
    { prefix: "$", value: 240, suffix: "M", label: "revenue influenced" },
    { value: 3.8, suffix: "×", decimals: 1, label: "pipeline growth" },
  ],

  logos: ["NORTHWIND", "Lumen", "VELA", "Halcyon", "MERIDIAN", "Kit&Co"],

  markets: ["Berlin", "Tokyo", "Dubai", "São Paulo", "London", "Singapore", "Seoul", "Sydney", "Mexico City", "Toronto"],

  marketData: [
    { city: "Berlin", country: "Germany", region: "EU", opp: 4.2, weeks: 6 },
    { city: "London", country: "United Kingdom", region: "EU", opp: 4.6, weeks: 5 },
    { city: "Tokyo", country: "Japan", region: "APAC", opp: 5.1, weeks: 9 },
    { city: "Singapore", country: "Singapore", region: "APAC", opp: 2.9, weeks: 6 },
    { city: "Seoul", country: "South Korea", region: "APAC", opp: 3.6, weeks: 8 },
    { city: "Sydney", country: "Australia", region: "APAC", opp: 3.1, weeks: 6 },
    { city: "Dubai", country: "UAE", region: "MENA", opp: 3.4, weeks: 7 },
    { city: "São Paulo", country: "Brazil", region: "LATAM", opp: 3.8, weeks: 8 },
    { city: "Mexico City", country: "Mexico", region: "LATAM", opp: 2.7, weeks: 7 },
  ],

  services: [
    {
      key: "intl",
      n: "01",
      title: "International Ecommerce Expansion",
      tag: "Sell everywhere your customers already are.",
      desc: "We take proven brands into new markets — the strategy, storefronts, payments and logistics — so launching in Berlin or Bogotá feels as native as your home market.",
      bullets: ["Market prioritization & sizing", "Localized storefronts & checkout", "Cross-border logistics & tax", "Local paid + organic launch"],
      stat: ["47", "markets launched"],
    },
    {
      key: "ads",
      n: "02",
      title: "Digital Advertising & Paid Media",
      tag: "Performance media that compounds.",
      desc: "Full-funnel paid across Meta, Google, TikTok, Amazon and retail media — engineered around incrementality, not vanity metrics, with creative tested at scale.",
      bullets: ["Full-funnel paid strategy", "Creative testing at scale", "Bidding & budget automation", "Incrementality measurement"],
      stat: ["+312%", "avg. ROAS lift"],
    },
    {
      key: "ai",
      n: "03",
      title: "AI Marketing Systems",
      tag: "Put AI to work across the funnel.",
      desc: "We build the AI layer for your marketing org — creative pipelines, predictive audiences, and agents that run the busywork so your team compounds output, not headcount.",
      bullets: ["AI creative pipelines", "Predictive audience models", "Workflow & agent automation", "LLM-powered personalization"],
      stat: ["9×", "creative throughput"],
    },
    {
      key: "web",
      n: "04",
      title: "Website Development",
      tag: "Sites built to convert and scale.",
      desc: "Headless, composable commerce builds that load instantly and convert — engineered with CRO baked in from the first wireframe to the last A/B test.",
      bullets: ["Headless / composable builds", "Core Web Vitals & speed", "Conversion-rate optimization", "Design systems & CMS"],
      stat: ["0.9s", "median load time"],
    },
    {
      key: "seo",
      n: "05",
      title: "SEO & Content",
      tag: "Own the demand before it searches.",
      desc: "Technical, international and programmatic SEO paired with a content engine that earns authority — so you capture intent in every language you sell in.",
      bullets: ["Technical & international SEO", "Programmatic content engines", "Editorial & thought leadership", "Digital PR & link building"],
      stat: ["6.4×", "organic traffic"],
    },
  ],

  approach: [
    { n: "01", title: "Diagnose", body: "We audit your funnel, markets and data to find where growth is leaking — and where it could compound." },
    { n: "02", title: "Engineer", body: "We build media, AI, site and content as one connected system, instrumented end-to-end." },
    { n: "03", title: "Compound", body: "We optimize relentlessly, reinvesting every win so performance accelerates quarter over quarter." },
  ],

  ctaBand: {
    kicker: "Let's talk",
    title: ["Ready to put a mark", "on your market?"],
    sub: "Book a 30-minute strategy call. We'll map the fastest path to your next market — no decks, no fluff.",
  },

  footer: {
    cols: [
      { h: "Services", items: ["International expansion", "Paid media", "AI systems", "Web development", "SEO & content"] },
      { h: "Company", items: ["Work", "Approach", "About", "Careers", "Contact"] },
      { h: "Connect", items: ["LinkedIn", "Instagram", "X / Twitter", "Newsletter"] },
    ],
    address: "Toronto · London · Singapore",
  },
};

// Nav destinations. "Approach" and "Stack" are real routes; the remaining
// nav items (Services, Work, About) are sections of the homepage, reached via
// hash anchors that match the section ids set in home-signal.tsx.
export function navHref(n: string): string {
  if (n === "Approach") return "/approach";
  if (n === "Stack") return "/stack";
  return "/#" + n.toLowerCase();
}

// Signal palette — baked-in final theme from the design handoff.
export const C = {
  bg: "#0A0B0A",
  panel: "#0F110F",
  panel2: "#141614",
  text: "#F3F5F2",
  muted: "#8E948C",
  faint: "#5C625B",
  line: "rgba(255,255,255,0.085)",
  accent: "#1FA85F",
  accentHover: "#27BE6E",
  accentInk: "#04140C",
};

// The Stack page data — ported from stack-page.jsx.
export const STACK_CATS = [
  "AI & Automation",
  "Commerce",
  "ERP & Operations",
  "Payment Gateways",
  "Cloud & Infrastructure",
  "Development",
  "Analytics & Tags",
  "Advertising",
  "Email & CRM",
  "Social Proof",
  "SEO & Content",
  "Support",
];

export type StackTool = {
  name: string;
  cat: string;
  mono: string;
  color: string;
  role: string;
  why: string;
  icon?: string; // simple-icons slug (built-in vector logo)
  // Custom logo file slug. If `public/logos/<localLogo>.svg` exists it wins
  // over the simple-icons glyph; otherwise we fall back to icon, then mono.
  localLogo?: string;
};

export const STACK_TOOLS: StackTool[] = [
  { name: "Claude", cat: "AI & Automation", mono: "C", color: "#D97757", role: "LLM copilots", why: "Drafts ad creative, briefs, and on-site copy at scale.", icon: "claude" },
  { name: "Ada", cat: "AI & Automation", mono: "A", color: "#6B5BFF", role: "AI support", why: "Resolves customer questions automatically, around the clock.", icon: "ada" },
  { name: "OpenAI", cat: "AI & Automation", mono: "O", color: "#10A37F", role: "LLM models", why: "Embeddings and generation wired into our pipelines.", localLogo: "openai" },
  { name: "Zapier", cat: "AI & Automation", mono: "Z", color: "#FF4F00", role: "Workflow automation", why: "Connects the stack end-to-end without custom code.", icon: "zapier" },
  { name: "Make", cat: "AI & Automation", mono: "Mk", color: "#B16EFF", role: "Visual automation", why: "Complex multi-step workflows, built and shipped visually.", icon: "make" },
  { name: "Shopify", cat: "Commerce", mono: "S", color: "#95BF47", role: "DTC commerce", why: "Fast, conversion-built storefronts for growing brands.", icon: "shopify" },
  { name: "BigCommerce", cat: "Commerce", mono: "B", color: "#9BA7B4", role: "Enterprise commerce", why: "Headless, multi-market catalogs built to scale.", icon: "bigcommerce" },
  { name: "WooCommerce", cat: "Commerce", mono: "W", color: "#96588A", role: "WordPress commerce", why: "Flexible storefronts on the open web.", icon: "woocommerce" },
  { name: "Adobe Commerce", cat: "Commerce", mono: "AC", color: "#F26322", role: "B2B & B2C commerce", why: "Complex catalogs and multi-store setups at scale.", localLogo: "adobe-commerce" },
  { name: "Amazon Marketplace", cat: "Commerce", mono: "A", color: "#FF9900", role: "Marketplace", why: "Beachhead launches on the local marketplace in new markets.", localLogo: "amazon" },
  { name: "SAP", cat: "ERP & Operations", mono: "SAP", color: "#0FAAFF", role: "Enterprise ERP", why: "Finance, supply chain, and operations on one enterprise backbone.", icon: "sap" },
  { name: "NetSuite", cat: "ERP & Operations", mono: "NS", color: "#1F74B7", role: "Cloud ERP", why: "Unified ERP, inventory, and financials for scaling merchants.", localLogo: "netsuite" },
  { name: "Microsoft Dynamics", cat: "ERP & Operations", mono: "MD", color: "#0B53CE", role: "ERP & CRM", why: "Connected operations and customer data across the business.", localLogo: "dynamics" },
  { name: "Sage", cat: "ERP & Operations", mono: "Sg", color: "#00D639", role: "Accounting & ERP", why: "Financial management and reporting as you expand.", icon: "sage" },
  { name: "Intuit", cat: "ERP & Operations", mono: "In", color: "#236CFF", role: "Accounting (QuickBooks)", why: "Bookkeeping and financials wired into the stack.", icon: "intuit" },
  { name: "Linnworks", cat: "ERP & Operations", mono: "Ln", color: "#F5821F", role: "Order management", why: "Centralizes multichannel orders and inventory in one place.", localLogo: "linnworks" },
  { name: "SellerCloud", cat: "ERP & Operations", mono: "SC", color: "#00AEEF", role: "Multichannel ops", why: "Listings, orders, and fulfillment synced across marketplaces.", localLogo: "sellercloud" },
  { name: "Stripe", cat: "Payment Gateways", mono: "St", color: "#635BFF", role: "Payments & billing", why: "Global card processing and subscriptions out of the box.", icon: "stripe" },
  { name: "Adyen", cat: "Payment Gateways", mono: "Ad", color: "#0ABF53", role: "Global payments", why: "Unified processing across regions and payment methods.", icon: "adyen" },
  { name: "PayPal", cat: "Payment Gateways", mono: "PP", color: "#0070E0", role: "Wallet & checkout", why: "Trusted express checkout that lifts conversion.", icon: "paypal" },
  { name: "Airwallex", cat: "Payment Gateways", mono: "Aw", color: "#FF4438", role: "Cross-border payments", why: "Multi-currency accounts and FX for global expansion.", localLogo: "airwallex" },
  { name: "AWS", cat: "Cloud & Infrastructure", mono: "AWS", color: "#FF9900", role: "Cloud infra", why: "Scalable hosting, storage, and data pipelines.", localLogo: "aws" },
  { name: "Google Cloud", cat: "Cloud & Infrastructure", mono: "GC", color: "#4285F4", role: "Cloud & data", why: "BigQuery analytics and ML workloads.", icon: "googlecloud" },
  { name: "Microsoft Azure", cat: "Cloud & Infrastructure", mono: "Az", color: "#3AB6F0", role: "Enterprise cloud", why: "Secure cloud for enterprise integrations.", localLogo: "azure" },
  { name: "Vercel", cat: "Cloud & Infrastructure", mono: "▲", color: "#F3F5F2", role: "Edge hosting", why: "Instant global delivery for headless frontends.", icon: "vercel" },
  { name: "GitHub", cat: "Development", mono: "GH", color: "#F3F5F2", role: "Version control", why: "Source of truth and CI/CD for every build.", icon: "github" },
  { name: "Bitbucket", cat: "Development", mono: "B", color: "#2684FF", role: "Repos & pipelines", why: "Git workflows and automated deployments.", icon: "bitbucket" },
  { name: "Google Analytics", cat: "Analytics & Tags", mono: "GA", color: "#E8710A", role: "Behavioral analytics", why: "GA4 event tracking across the funnel.", icon: "googleanalytics" },
  { name: "Google Tag Manager", cat: "Analytics & Tags", mono: "GTM", color: "#8AB4F8", role: "Tag management", why: "Deploy tracking without touching code.", icon: "googletagmanager" },
  { name: "Microsoft Clarity", cat: "Analytics & Tags", mono: "Cl", color: "#0078D4", role: "Session analytics", why: "Heatmaps and session replays that reveal UX friction.", localLogo: "clarity" },
  { name: "Google Ads", cat: "Advertising", mono: "Ads", color: "#FBBC04", role: "Search & PMax", why: "Intent capture across Search and Shopping.", icon: "googleads" },
  { name: "Meta Ads", cat: "Advertising", mono: "M", color: "#0866FF", role: "Paid social", why: "Full-funnel prospecting and retargeting.", icon: "meta" },
  { name: "TikTok Ads", cat: "Advertising", mono: "TT", color: "#25F4EE", role: "Short-form video", why: "Creator-style creative that stops the scroll and converts.", icon: "tiktok" },
  { name: "Amazon Ads", cat: "Advertising", mono: "AMZ", color: "#FF9900", role: "Retail media", why: "Sponsored placements where buyers are already shopping.", localLogo: "amazon-ads" },
  { name: "Microsoft Ads", cat: "Advertising", mono: "MS", color: "#00A4EF", role: "Search ads", why: "Bing intent capture at lower CPCs.", localLogo: "microsoft-ads" },
  { name: "Pinterest Ads", cat: "Advertising", mono: "P", color: "#E60023", role: "Discovery ads", why: "High-intent visual discovery for DTC brands.", icon: "pinterest" },
  { name: "Klaviyo", cat: "Email & CRM", mono: "K", color: "#23856D", role: "Email & SMS", why: "Lifecycle flows that turn buyers into repeat customers.", localLogo: "klaviyo" },
  { name: "HubSpot", cat: "Email & CRM", mono: "H", color: "#FF7A59", role: "CRM & automation", why: "Pipeline, nurture, and attribution in one place.", icon: "hubspot" },
  { name: "Mailchimp", cat: "Email & CRM", mono: "MC", color: "#FFE01B", role: "Email marketing", why: "Fast campaigns and audience management for growing lists.", icon: "mailchimp" },
  { name: "Salesforce", cat: "Email & CRM", mono: "SF", color: "#00A1E0", role: "Enterprise CRM", why: "A single customer record across every market.", localLogo: "salesforce" },
  { name: "Marketo", cat: "Email & CRM", mono: "Mo", color: "#5C4C9F", role: "Marketing automation", why: "Lead nurture and scoring for longer B2B cycles.", localLogo: "marketo" },
  { name: "Yotpo", cat: "Social Proof", mono: "Yo", color: "#2B7DE9", role: "Reviews & UGC", why: "Collects reviews and ratings that boost on-site conversion.", localLogo: "yotpo" },
  { name: "Judge.me", cat: "Social Proof", mono: "Jm", color: "#2BB673", role: "Product reviews", why: "Lightweight review collection and rich snippets for SEO.", localLogo: "judgeme" },
  { name: "Bazaarvoice", cat: "Social Proof", mono: "Bv", color: "#1C75BC", role: "Ratings & reviews", why: "Syndicated reviews across retail and marketplace channels.", localLogo: "bazaarvoice" },
  { name: "Ahrefs", cat: "SEO & Content", mono: "Ah", color: "#054ADA", role: "SEO research", why: "Backlink and keyword intelligence in every language.", localLogo: "ahrefs" },
  { name: "Semrush", cat: "SEO & Content", mono: "SEM", color: "#FF642D", role: "Search intelligence", why: "Competitor and keyword research across markets.", icon: "semrush" },
  { name: "Screaming Frog", cat: "SEO & Content", mono: "ScF", color: "#8DC63F", role: "Technical SEO", why: "Site crawls that catch issues before Google does.", localLogo: "screaming-frog" },
  { name: "WordPress", cat: "SEO & Content", mono: "WP", color: "#72AEE6", role: "Content CMS", why: "Editorial publishing for programmatic content engines.", icon: "wordpress" },
  { name: "Moz", cat: "SEO & Content", mono: "Mz", color: "#00A2C7", role: "SEO toolset", why: "Domain authority and rank tracking across markets.", localLogo: "moz" },
  { name: "Google Lighthouse", cat: "SEO & Content", mono: "LH", color: "#F44B21", role: "Performance audits", why: "Core Web Vitals and SEO scoring on every build.", icon: "lighthouse" },
  { name: "Zendesk", cat: "Support", mono: "Z", color: "#49C5B1", role: "Support desk", why: "Unified customer support and ticketing.", icon: "zendesk" },
];
