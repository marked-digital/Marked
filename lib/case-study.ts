// The shape of a case study page. One data object per engagement (lib/oeo.ts,
// lib/roadpost.ts) drives components/case-study.tsx end to end: every heading,
// kicker, label and figure on the page comes from here, so a new case study is
// a data file plus a route and nothing else.
//
// The template was built for Ontario Education Online first and generalised for
// Roadpost, which is why the stylesheet block in app/marked.css still carries
// the `.oeo-` prefix. Same classes, both pages.

export type Objective = { n: string; title: string; body: string };

export type Result = {
  label: string;
  /** Numeric target for the count-up. Rendered as `${prefix}${value}${suffix}`. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to hold while counting — e.g. 1 for "$20.9M". */
  decimals?: number;
  sub: string;
  /** Accent-tinted headline cell — the lead figure opens the grid. */
  lead?: boolean;
};

/**
 * One point on the revenue chart, indexed rather than absolute. Publishing a
 * client's real monthly dollars is rarely allowed; the index carries the same
 * shape and growth rate without disclosing them. `label` is the axis tick
 * (a month, a quarter, a fiscal period — whatever the series is cut by).
 */
export type SeriesPoint = { label: string; value: number };

export type Bar = { label: string; pct: number; note?: string };

/** A titled set of bars. `pct` sets the bar width, so every value has to be
 *  0–100: shares of a total work, growth rates only if they stay under 100. */
export type BarGroup = { label: string; bars: Bar[]; footnote?: string };

/** Name of an entry in STACK_TOOLS (lib/md.ts) — the case study renders the
 *  platform's real logo, colour and role from the same source as /stack. An
 *  unmatched name renders nothing, so spelling has to match exactly. */
export type Platform = string;

/** A shipped page or project. Drop a screenshot path into `image` and it
 *  replaces the schematic thumbnail — production needs ~500×380 @2x for the
 *  250×190 slot. */
export type PageBuild = {
  name: string;
  type: string;
  thumb: "hero" | "split" | "form" | "grid" | "dark" | "profile" | "list";
  image?: string;
};

export type Phase = {
  n: string;
  title: string;
  period: string;
  body: string;
  bullets: string[];
};

export type CaseStudy = {
  client: string;
  slug: string;
  /** Hero eyebrow, e.g. "Case study · Growth". */
  kicker: string;
  industry: string;
  services: string;
  timeline: string;
  /** The H1, split so the middle phrase can carry the drawn underline. */
  h1: { before: string; underlined: string; after: string };
  sub: string;
  /** The one big number under the hero copy. `label` is its two-line caption. */
  headlineStat: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    label: [string, string];
  };
  /** Text beside the animated scroll cue at the bottom of the hero. */
  scrollCue: string;

  brief: {
    kicker: string;
    heading: string;
    lede: string;
    objectives: Objective[];
  };

  results: {
    kicker: string;
    heading: string;
    items: Result[];
  };

  revenue: {
    kicker: string;
    heading: string;
    body: string;
    /** Top-left line inside the chart card, stating what the index means. */
    chartHead: string;
    /** Top-right line inside the chart card — the period covered. */
    rangeLabel: string;
    /** Full sentence describing the chart for screen readers. */
    ariaLabel: string;
    /** Optional tick pinned to the marker point, e.g. "INDEX 100". Omit it when
     *  the marker doesn't sit on the base value. */
    baseLabel?: string;
    /** Index into `series` where the engagement (or the period of interest)
     *  starts. Everything before it draws in muted grey as the baseline; the
     *  accent line and its gradient area start here. */
    engagementIndex: number;
    markerLabel: string;
    /** Label pinned to the final point, e.g. "+548%" or "$20.9M". */
    endLabel: string;
    /** Horizontal reference lines, in index units. The largest one sets the
     *  vertical scale; points above it use the chart's headroom. */
    gridlines: number[];
    series: SeriesPoint[];
  };

  /** The two-column bar section: a split of the whole on the left, a
   *  per-channel or per-property breakdown on the right. */
  split: {
    kicker: string;
    heading: string;
    body: string;
    primary: BarGroup;
    secondary: BarGroup;
  };

  stack: {
    kicker: string;
    /** The platform count in the heading is written by hand — keep it equal to
     *  `platforms.length`. */
    heading: string;
    body: string;
    platforms: Platform[];
  };

  shipped: {
    kicker: string;
    heading: string;
    body: string;
    /** Hint above the horizontal scroller, e.g. "Scroll →". */
    scrollHint: string;
    pages: PageBuild[];
    /** Trailing "+N more" card. Omit it and the card isn't rendered. */
    more?: { count: number; label: string };
    /** Before/after slider. Omit it and the section ends with the scroller. */
    compare?: {
      label: string;
      caption: string;
      beforeImage?: string;
      afterImage?: string;
      /** Alt text for the two captures, used only when the images are set. */
      beforeAlt: string;
      afterAlt: string;
    };
  };

  approach: {
    kicker: string;
    heading: string;
    body: string;
    phases: Phase[];
  };

  /** Closing pull-quote. Omit it and the page ends on the approach section.
   *  A named client attribution belongs here only when that person actually
   *  said it and has approved it; otherwise attribute it to Marked and write
   *  it in our own voice. */
  quote?: {
    body: string;
    attribution: string;
  };
};
