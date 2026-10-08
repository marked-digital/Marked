// The shape of a case study page. One data object per engagement (lib/oeo.ts,
// lib/roadpost.ts, lib/casa-nina.ts) drives components/case-study.tsx end to
// end: every heading, kicker, label and figure on the page comes from here, so
// a new case study is a data file plus a route and nothing else.
//
// Optional sections: the hero's live-site link (`site`), the results scorecard
// (`results.scorecard`), the revenue chart (`revenue`), the channel split
// (`split`), the research finding (`finding`), the shipped section's "+N more"
// card and before/after slider (`shipped.more`, `shipped.compare`) and the
// closing quote (`quote`). Leave one out and the section isn't rendered; the
// tinted sections that follow the results re-join themselves around the gap.
//
// The template was built for Ontario Education Online first and generalised for
// Roadpost and then Casa Nina Flamingo, which is why the stylesheet block in
// app/marked.css still carries the `.oeo-` prefix. Same classes, every page.

/** A card in the brief. `group` is optional: with one, the card's eyebrow
 *  reads "/ 02 · AI Search"; without, just "/ 02". */
export type Objective = { n: string; group?: string; title: string; body: string };

export type Result = {
  label: string;
  /** Numeric target for the count-up. Rendered as `${prefix}${value}${suffix}`. */
  value: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places to hold while counting, e.g. 1 for "$20.9M". */
  decimals?: number;
  sub: string;
  /** Accent-tinted headline cell: the lead figure opens the grid. */
  lead?: boolean;
};

/**
 * One point on the revenue chart, indexed rather than absolute. Publishing a
 * client's real monthly dollars is rarely allowed; the index carries the same
 * shape and growth rate without disclosing them. `label` is the axis tick
 * (a month, a quarter, a fiscal period: whatever the series is cut by).
 */
export type SeriesPoint = { label: string; value: number };

export type Bar = { label: string; pct: number; note?: string };

/** A titled set of bars. `pct` sets the bar width, so every value has to be
 *  0 to 100: shares of a total work, growth rates only if they stay under 100. */
export type BarGroup = { label: string; bars: Bar[]; footnote?: string };

/** A platform on the case study's stack. A name resolves against STACK_TOOLS
 *  (lib/md.ts), so the tile shows the platform's real logo, colour and role
 *  from the same source as /stack. An unmatched name renders nothing, so
 *  spelling has to match exactly.
 *
 *  An object is for a platform the engagement used that isn't on the /stack
 *  roster, or for a listed tool whose role was different on this engagement.
 *  Its fields lay over the STACK_TOOLS entry of the same name, if there is
 *  one; without one it needs `role`, `color` and `mono` to render. It never
 *  joins STACK_TOOLS, whose length is the platform count quoted across the
 *  brand. */
export type Platform =
  | string
  | { name: string; role?: string; color?: string; mono?: string; icon?: string; localLogo?: string };

/** A shipped page or project. Drop a screenshot path into `image` and it
 *  replaces the schematic thumbnail; production needs ~500×380 @2x for the
 *  250×190 slot. */
export type PageBuild = {
  name: string;
  type: string;
  thumb: "hero" | "split" | "form" | "grid" | "dark" | "profile" | "list";
  image?: string;
  /** Live URL of the page. When set, the whole card links to it in a new tab
   *  so visitors can try the real page. */
  href?: string;
};

/** One gauge on a scorecard, scored 0 to 100. */
export type Score = { label: string; value: number };

/** A category reported as checks passed rather than a score, e.g. "3/3". */
export type ScoreRatio = { label: string; passed: number; total: number };

/** One option checked against the client's constraint, e.g. a payment gateway.
 *  `selected` marks the one that passed; it carries the section's only accent. */
export type Check = { name: string; verdict: string; note: string; selected?: boolean };

/** A documented route or option, rendered as a card under the checks. */
export type Route = { name: string; role: string; body: string };

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
  /** Optional live-site link, rendered as a fifth hero meta cell. */
  site?: { label: string; href: string };
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
    /** Optional tool scorecard, e.g. Google Lighthouse, shown between the
     *  heading and the results grid. */
    scorecard?: {
      /** Left and right lines of the card head: tool and page, then date. */
      head: string;
      meta: string;
      scores: Score[];
      ratio?: ScoreRatio;
      /** One plain sentence under the gauges, e.g. what a new category means. */
      note?: string;
    };
    items: Result[];
  };

  /** Optional. Omit it for an engagement with no revenue curve to publish. */
  revenue?: {
    kicker: string;
    heading: string;
    body: string;
    /** Top-left line inside the chart card, stating what the index means. */
    chartHead: string;
    /** Top-right line inside the chart card: the period covered. */
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
    /** Label pinned to the final point, e.g. "+1,183%" or "$20.9M". */
    endLabel: string;
    /** Horizontal reference lines, in index units. The largest one sets the
     *  vertical scale; points above it use the chart's headroom. */
    gridlines: number[];
    series: SeriesPoint[];
  };

  /** The two-column bar section: a split of the whole on the left, a
   *  per-channel or per-property breakdown on the right. Optional, like
   *  `revenue`. */
  split?: {
    kicker: string;
    heading: string;
    body: string;
    primary: BarGroup;
    secondary: BarGroup;
  };

  /** A research finding rendered as a checked list plus option cards, for
   *  engagements whose story is a decision rather than a growth curve. */
  finding?: {
    kicker: string;
    heading: string;
    body: string;
    /** Top-left and top-right lines inside the card, like the chart head. */
    cardHead: string;
    cardMeta: string;
    checks: Check[];
    routesLabel?: string;
    routes?: Route[];
    /** What is live today versus still to follow. */
    status?: string;
  };

  stack: {
    kicker: string;
    /** A platform count in the heading is written by hand: when the heading
     *  carries one, keep it equal to `platforms.length`. */
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
