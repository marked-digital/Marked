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
  "Cloud & Infrastructure",
  "Development",
  "Analytics & Tags",
  "Advertising",
  "Email & CRM",
  "SEO & Content",
  "Support",
];

export const STACK_TOOLS = [
  { name: "Claude", cat: "AI & Automation", mono: "C", color: "#D97757", role: "LLM copilots", why: "Drafts ad creative, briefs, and on-site copy at scale." },
  { name: "Ada", cat: "AI & Automation", mono: "A", color: "#6B5BFF", role: "AI support", why: "Resolves customer questions automatically, around the clock." },
  { name: "OpenAI", cat: "AI & Automation", mono: "O", color: "#10A37F", role: "LLM models", why: "Embeddings and generation wired into our pipelines." },
  { name: "Zapier", cat: "AI & Automation", mono: "Z", color: "#FF4F00", role: "Workflow automation", why: "Connects the stack end-to-end without custom code." },
  { name: "Make", cat: "AI & Automation", mono: "Mk", color: "#B16EFF", role: "Visual automation", why: "Complex multi-step workflows, built and shipped visually." },
  { name: "Shopify", cat: "Commerce", mono: "S", color: "#95BF47", role: "DTC commerce", why: "Fast, conversion-built storefronts for growing brands." },
  { name: "BigCommerce", cat: "Commerce", mono: "B", color: "#9BA7B4", role: "Enterprise commerce", why: "Headless, multi-market catalogs built to scale." },
  { name: "WooCommerce", cat: "Commerce", mono: "W", color: "#96588A", role: "WordPress commerce", why: "Flexible storefronts on the open web." },
  { name: "Adobe Commerce", cat: "Commerce", mono: "AC", color: "#F26322", role: "B2B & B2C commerce", why: "Complex catalogs and multi-store setups at scale." },
  { name: "Amazon Marketplace", cat: "Commerce", mono: "A", color: "#FF9900", role: "Marketplace", why: "Beachhead launches on the local marketplace in new markets." },
  { name: "AWS", cat: "Cloud & Infrastructure", mono: "AWS", color: "#FF9900", role: "Cloud infra", why: "Scalable hosting, storage, and data pipelines." },
  { name: "Google Cloud", cat: "Cloud & Infrastructure", mono: "GC", color: "#4285F4", role: "Cloud & data", why: "BigQuery analytics and ML workloads." },
  { name: "Microsoft Azure", cat: "Cloud & Infrastructure", mono: "Az", color: "#3AB6F0", role: "Enterprise cloud", why: "Secure cloud for enterprise integrations." },
  { name: "Vercel", cat: "Cloud & Infrastructure", mono: "▲", color: "#F3F5F2", role: "Edge hosting", why: "Instant global delivery for headless frontends." },
  { name: "GitHub", cat: "Development", mono: "GH", color: "#F3F5F2", role: "Version control", why: "Source of truth and CI/CD for every build." },
  { name: "Bitbucket", cat: "Development", mono: "B", color: "#2684FF", role: "Repos & pipelines", why: "Git workflows and automated deployments." },
  { name: "Google Analytics", cat: "Analytics & Tags", mono: "GA", color: "#E8710A", role: "Behavioral analytics", why: "GA4 event tracking across the funnel." },
  { name: "Google Tag Manager", cat: "Analytics & Tags", mono: "GTM", color: "#8AB4F8", role: "Tag management", why: "Deploy tracking without touching code." },
  { name: "Google Ads", cat: "Advertising", mono: "Ads", color: "#FBBC04", role: "Search & PMax", why: "Intent capture across Search and Shopping." },
  { name: "Meta Ads", cat: "Advertising", mono: "M", color: "#0866FF", role: "Paid social", why: "Full-funnel prospecting and retargeting." },
  { name: "TikTok Ads", cat: "Advertising", mono: "TT", color: "#25F4EE", role: "Short-form video", why: "Creator-style creative that stops the scroll and converts." },
  { name: "Amazon Ads", cat: "Advertising", mono: "AMZ", color: "#FF9900", role: "Retail media", why: "Sponsored placements where buyers are already shopping." },
  { name: "Microsoft Ads", cat: "Advertising", mono: "MS", color: "#00A4EF", role: "Search ads", why: "Bing intent capture at lower CPCs." },
  { name: "Pinterest Ads", cat: "Advertising", mono: "P", color: "#E60023", role: "Discovery ads", why: "High-intent visual discovery for DTC brands." },
  { name: "Klaviyo", cat: "Email & CRM", mono: "K", color: "#23856D", role: "Email & SMS", why: "Lifecycle flows that turn buyers into repeat customers." },
  { name: "HubSpot", cat: "Email & CRM", mono: "H", color: "#FF7A59", role: "CRM & automation", why: "Pipeline, nurture, and attribution in one place." },
  { name: "Mailchimp", cat: "Email & CRM", mono: "MC", color: "#FFE01B", role: "Email marketing", why: "Fast campaigns and audience management for growing lists." },
  { name: "Salesforce", cat: "Email & CRM", mono: "SF", color: "#00A1E0", role: "Enterprise CRM", why: "A single customer record across every market." },
  { name: "Ahrefs", cat: "SEO & Content", mono: "Ah", color: "#054ADA", role: "SEO research", why: "Backlink and keyword intelligence in every language." },
  { name: "Semrush", cat: "SEO & Content", mono: "SEM", color: "#FF642D", role: "Search intelligence", why: "Competitor and keyword research across markets." },
  { name: "Screaming Frog", cat: "SEO & Content", mono: "ScF", color: "#8DC63F", role: "Technical SEO", why: "Site crawls that catch issues before Google does." },
  { name: "WordPress", cat: "SEO & Content", mono: "WP", color: "#72AEE6", role: "Content CMS", why: "Editorial publishing for programmatic content engines." },
  { name: "Zendesk", cat: "Support", mono: "Z", color: "#49C5B1", role: "Support desk", why: "Unified customer support and ticketing." },
];
