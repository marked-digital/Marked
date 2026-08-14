"use client";

// The case study template. One <CaseStudy data={…} /> per engagement:
//
//   /work/ontario-education-online → lib/oeo.ts
//   /work/roadpost                 → lib/roadpost.ts
//
// Built from the design handoff in `design_handoff_oeo_case_study`. Structure,
// section order and behaviour follow the reference; none of its styling does —
// every colour, type step and surface comes from the Signal tokens in lib/md.ts
// and the `.oeo` block in app/marked.css, which documents the mapping. That
// block keeps its original prefix now that the template is shared: same
// classes, every case study.
//
// Nav and footer are out of scope: they're the same compact rebuild the other
// inner pages use (see book-page.tsx / approach-page.tsx), unchanged.
//
// Motion is progressive enhancement, the way the reference does it: the markup
// carries the final values, and the effect below sets the initial states on
// mount and animates them in on intersect. With JS off — or reduced motion on —
// the page renders complete and static. Nothing here is load-bearing for
// legibility. The effect mutates inline styles directly, which is safe because
// this tree never re-renders: the only stateful pieces are the isolated
// <CountStat> spans and the uncontrolled comparison slider.

import React from "react";
import Link from "next/link";
import { MD, C, STACK_TOOLS, navHref } from "@/lib/md";
import { MarkLogo, ToolLogo, useScrollSync } from "@/components/shared";
import { MobileMenu, NavCta } from "@/components/site-nav";
import type { BarGroup, CaseStudy as CaseStudyData, PageBuild } from "@/lib/case-study";

const EASE = "cubic-bezier(0.2, 0.7, 0.3, 1)"; // the site's easing, used everywhere

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ----------------------------------------------------------------- motion */

// One observer for the whole page. Mirrors the reference runtime: reveals,
// bar widths, SVG line draws and the chart's gradient area.
function useScrollMotion(rootRef: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    root.querySelectorAll<HTMLElement>("[data-rev]").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(26px)";
      el.style.transition = `opacity .9s ${EASE}, transform .9s ${EASE}`;
      el.style.transitionDelay = `${el.dataset.delay || 0}ms`;
    });
    root.querySelectorAll<HTMLElement>("[data-bar]").forEach((el) => {
      el.style.width = "0%";
      el.style.transition = `width 1.3s ${EASE}`;
      el.style.transitionDelay = `${(Number(el.dataset.delay) || 0) + 150}ms`;
    });
    root.querySelectorAll<SVGPathElement>("path[data-draw]").forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      p.style.transition = `stroke-dashoffset 1.6s ${EASE}`;
      p.style.transitionDelay = `${p.dataset.delay || 150}ms`;
    });
    root.querySelectorAll<SVGElement>("[data-fade]").forEach((el) => {
      el.style.opacity = "0";
      el.style.transition = "opacity 1.1s ease";
      el.style.transitionDelay = `${el.dataset.delay || 900}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const t = e.target as HTMLElement;
          if (t.hasAttribute("data-rev")) {
            t.style.opacity = "1";
            t.style.transform = "none";
          }
          if (t.hasAttribute("data-bar")) t.style.width = `${t.dataset.bar}%`;
          if (t.hasAttribute("data-draw")) t.style.strokeDashoffset = "0";
          if (t.hasAttribute("data-fade")) t.style.opacity = "1";
          io.unobserve(t); // animate once
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    root.querySelectorAll("[data-rev],[data-bar],[data-draw],[data-fade]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootRef]);
}

function ScrollProgress() {
  const ref = React.useRef<HTMLElement | null>(null);
  const syncRef = useScrollSync();
  React.useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    update();
    syncRef.current = update;
    return () => {
      syncRef.current = null;
    };
  }, [syncRef]);
  return (
    <div className="oeo-progress" aria-hidden="true">
      <i ref={ref} />
    </div>
  );
}

// Counts up on intersect. Renders the final figure on the server and with JS
// off; only zeroes itself once the effect confirms motion is wanted, so the
// number is never missing. (The shared CountUp starts at zero, which would
// leave "+0%" on a JS-less render.)
function CountStat({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1800,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = React.useState<number | null>(null); // null → final value

  React.useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            setShown(value * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {(shown ?? value).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------- small bits */

function Kicker({ children, delay }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      data-rev
      data-delay={delay}
      className="oeo-mono"
      style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", color: C.accent }}
    >
      {children}
    </div>
  );
}

function Label({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="oeo-mono" style={{ fontSize: 11, color: C.faint, ...style }}>
      {children}
    </div>
  );
}

function Bar({ pct, delay, accent }: { pct: number; delay?: number; accent?: boolean }) {
  return (
    <div className="oeo-track" style={{ height: accent === undefined ? 10 : 14 }}>
      <i data-bar={pct} data-delay={delay} className={accent ? "on" : undefined} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ chrome */

function Nav() {
  return (
    <header className="mk-topbar">
      <div className="oeo-wrap mk-topbar-inner">
        <Link href="/" className="mk-nav-logo" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, letterSpacing: "-0.03em" }}>
          <MarkLogo size={22} color={C.text} accent={C.accent} />
          <span>
            {MD.brand}
            <span style={{ color: C.accent }}>.</span>
          </span>
        </Link>
        <nav className="sg-nav-links">
          {MD.nav.map((n) => (
            <Link key={n} className="sg-navlink" href={navHref(n)} style={n === "Work" ? { color: C.text } : undefined}>
              {n}
            </Link>
          ))}
          <Link className="sg-navlink" href="/stack">
            Stack
          </Link>
        </nav>
        <div className="mk-nav-right">
          <NavCta />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.line}` }}>
      <div className="oeo-wrap" style={{ paddingTop: 30, paddingBottom: 30, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: C.faint, fontSize: 13.5 }}>
        <span>
          © 2026 {MD.brandFull}. {MD.footer.address}.
        </span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ hero */

function Hero({ d }: { d: CaseStudyData }) {
  const h = d.headlineStat;
  const meta: [string, string][] = [
    ["CLIENT", d.client],
    ["INDUSTRY", d.industry],
    ["SERVICES", d.services],
    ["TIMELINE", d.timeline],
  ];
  return (
    <section className="oeo-hero">
      <div className="oeo-wrap">
        <div data-rev style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 8, height: 8, background: C.accent, display: "inline-block" }} />
          <span className="oeo-mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", color: C.accent }}>
            {d.kicker}
          </span>
        </div>

        <h1 data-rev data-delay={80} className="oeo-h1">
          {d.h1.before}
          <span style={{ position: "relative", display: "inline-block" }}>
            {d.h1.underlined}
            <svg className="oeo-underline" viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden="true">
              <path
                data-draw
                data-delay={800}
                d="M8,18 C90,6 210,4 292,13"
                style={{ fill: "none", stroke: C.accent, strokeWidth: 9, strokeLinecap: "round" }}
              />
            </svg>
          </span>
          {d.h1.after}
        </h1>

        <p data-rev data-delay={200} style={{ margin: "28px 0 0", maxWidth: 640, fontSize: 19, lineHeight: 1.6, color: C.muted }}>
          {d.sub}
        </p>

        <div data-rev data-delay={300} style={{ marginTop: 60, display: "flex", alignItems: "baseline", gap: 22, flexWrap: "wrap" }}>
          <span className="oeo-hero-stat">
            <CountStat value={h.value} prefix={h.prefix} suffix={h.suffix} decimals={h.decimals} />
          </span>
          <span className="oeo-mono" style={{ fontSize: 12, letterSpacing: "0.18em", lineHeight: 1.7, color: C.muted }}>
            {h.label[0]}
            <br />
            {h.label[1]}
          </span>
        </div>

        <div data-rev data-delay={400} className="oeo-meta">
          {meta.map(([k, v]) => (
            <div key={k}>
              <Label>{k}</Label>
              <div style={{ marginTop: 8, fontSize: 15, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>

        <div data-rev data-delay={500} style={{ marginTop: 68, display: "flex", alignItems: "center", gap: 16 }}>
          <span className="oeo-cue" aria-hidden="true">
            <i />
          </span>
          <span className="oeo-mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: C.faint }}>
            {d.scrollCue}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 01 the brief */

function Objectives({ d }: { d: CaseStudyData }) {
  const b = d.brief;
  return (
    <section className="oeo-sec oeo-sec--tint">
      <div className="oeo-wrap">
        <div className="oeo-head">
          <div data-rev>
            <Kicker>{b.kicker}</Kicker>
            <h2 className="oeo-h2">{b.heading}</h2>
          </div>
          <p data-rev data-delay={120} className="oeo-lede">
            {b.lede}
          </p>
        </div>
        <div className="oeo-cards">
          {b.objectives.map((o, i) => (
            <div key={o.n} data-rev data-delay={i * 80} className="oeo-card">
              <div className="oeo-mono" style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>
                / {o.n}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: "16px 0 10px", letterSpacing: "-0.01em" }}>{o.title}</h3>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: C.muted }}>{o.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- 02 the results */

function Results({ d }: { d: CaseStudyData }) {
  const r = d.results;
  return (
    <section className="oeo-sec">
      <div className="oeo-wrap">
        <Kicker>{r.kicker}</Kicker>
        <h2 data-rev data-delay={80} className="oeo-h2">
          {r.heading}
        </h2>
        <div className="oeo-results">
          {r.items.map((item, i) => (
            <div key={item.label} data-rev data-delay={i * 60}>
              <Label style={{ color: C.muted }}>{item.label}</Label>
              <div className="oeo-stat" style={item.lead ? { color: C.accent } : undefined}>
                <CountStat value={item.value} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals} />
              </div>
              <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5, color: C.muted }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- 03 the revenue */

// Chart geometry. The series drives the path, so real figures drop straight
// into the data file without touching any coordinates here. The vertical scale
// is pinned to the top gridline, so changing `gridlines` rescales the plot;
// values above the top gridline use the headroom, as the final point does.
const CH = { w: 1000, h: 388, base: 340, top: 66 };
const yFor = (v: number, max: number) => CH.base - (v * (CH.base - CH.top)) / max;
const xFor = (i: number, n: number) => (i * CH.w) / (n - 1);

function RevenueChart({ d }: { d: CaseStudyData }) {
  const { series, engagementIndex: ei, gridlines, rangeLabel, heading, body, kicker, chartHead, ariaLabel, baseLabel, markerLabel, endLabel } = d.revenue;
  const scaleMax = gridlines[gridlines.length - 1];
  const yAt = (v: number) => yFor(v, scaleMax);
  const n = series.length;
  const pt = (p: { value: number }, i: number) => `${xFor(i, n).toFixed(1)},${yAt(p.value).toFixed(1)}`;

  const pre = series.slice(0, ei + 1).map((p, i) => pt(p, i));
  const post = series.slice(ei).map((p, i) => pt(p, i + ei));
  const preD = `M${pre.join(" L")}`;
  const postD = `M${post.join(" L")}`;
  const areaD = `${postD} L${CH.w},${CH.base} L${xFor(ei, n).toFixed(1)},${CH.base} Z`;
  const markerX = xFor(ei, n);
  const last = series[n - 1];

  const mono = { fontFamily: "inherit", letterSpacing: "0.1em", fontVariantNumeric: "tabular-nums" } as const;

  return (
    <section className="oeo-sec oeo-sec--tint">
      <div className="oeo-wrap">
        <div className="oeo-head">
          <div data-rev>
            <Kicker>{kicker}</Kicker>
            <h2 className="oeo-h2">{heading}</h2>
          </div>
          <p data-rev data-delay={120} className="oeo-lede">
            {body}
          </p>
        </div>

        <div data-rev data-delay={160} className="oeo-chart-card">
          {/* Indexed, not absolute — the client's real monthly figures are not
              published. The index carries the same curve and growth rate. */}
          <div className="oeo-chart-head oeo-mono">
            <span>{chartHead}</span>
            <span>{rangeLabel}</span>
          </div>
          <svg viewBox={`0 0 ${CH.w} ${CH.h}`} role="img" aria-label={ariaLabel}>
            <defs>
              <linearGradient id="oeoRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={C.accent} stopOpacity="0.22" />
                <stop offset="1" stopColor={C.accent} stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridlines.map((g) => (
              <line key={g} x1="0" y1={yAt(g)} x2={CH.w} y2={yAt(g)} style={{ stroke: C.line }} />
            ))}
            <line x1="0" y1={CH.base} x2={CH.w} y2={CH.base} style={{ stroke: "rgba(255,255,255,0.16)" }} />
            {gridlines.map((g) => (
              <text key={g} x="0" y={yAt(g) - 8} style={{ ...mono, fontSize: 12, fill: C.faint }}>
                {g}
              </text>
            ))}

            <line x1={markerX} y1="40" x2={markerX} y2={CH.base} style={{ stroke: C.faint, strokeDasharray: "3 7" }} />
            <text x={markerX + 11} y="66" style={{ ...mono, fontSize: 11.5, letterSpacing: "0.14em", fill: C.accent, fontWeight: 600 }}>
              {markerLabel}
            </text>

            <path data-fade data-delay={1000} d={areaD} style={{ fill: "url(#oeoRev)" }} />
            <path data-draw data-delay={200} d={preD} style={{ fill: "none", stroke: C.faint, strokeWidth: 2.5 }} />
            <path data-draw data-delay={600} d={postD} style={{ fill: "none", stroke: C.accent, strokeWidth: 3.5, strokeLinejoin: "round" }} />

            {baseLabel ? (
              <text x={markerX + 11} y={yAt(series[ei].value) + 26} style={{ ...mono, fontSize: 12, fill: C.faint }}>
                {baseLabel}
              </text>
            ) : null}
            <circle className="oeo-pulse" cx={CH.w} cy={yAt(last.value)} r="5.5" style={{ fill: C.accent }} />
            <circle cx={CH.w} cy={yAt(last.value)} r="5.5" style={{ fill: C.accent }} />
            <text x={CH.w - 10} y={yAt(last.value) - 19} textAnchor="end" style={{ ...mono, fontSize: 13, fontWeight: 600, fill: C.text }}>
              {endLabel}
            </text>

            <text x="0" y="380" style={{ ...mono, fontSize: 11.5, fill: C.faint }}>
              {series[0].label}
            </text>
            <text x={markerX} y="380" textAnchor="middle" style={{ ...mono, fontSize: 11.5, fill: C.accent }}>
              {series[ei].label}
            </text>
            <text x={CH.w} y="380" textAnchor="end" style={{ ...mono, fontSize: 11.5, fill: C.faint }}>
              {last.label}
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- 04 the split bars */

// `reveal` puts a reveal on each row, for the right-hand column where the rows
// arrive one by one. The left column reveals as a block from its container
// instead, so its rows stay plain — nesting the two would fade a row in against
// an already-fading parent.
function Bars({
  group,
  accentFirst,
  reveal,
  delayStep,
}: {
  group: BarGroup;
  accentFirst?: boolean;
  reveal?: boolean;
  delayStep: number;
}) {
  return (
    <>
      {group.bars.map((b, i) => (
        <div
          key={b.label}
          {...(reveal ? { "data-rev": true, "data-delay": i * delayStep } : {})}
          style={{ display: "grid", gap: 8 }}
        >
          <div className="oeo-mono" style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em" }}>
            <span>{b.label}</span>
            <span>
              {b.pct}%{b.note ? <span style={{ color: C.faint }}> · {b.note}</span> : null}
            </span>
          </div>
          <Bar pct={b.pct} delay={i * delayStep} accent={accentFirst ? i === 0 : undefined} />
        </div>
      ))}
    </>
  );
}

function Split({ d }: { d: CaseStudyData }) {
  const s = d.split;
  return (
    <section className="oeo-sec oeo-sec--tint oeo-sec--joined">
      <div className="oeo-wrap">
        <div className="oeo-traffic">
          <div>
            <Kicker>{s.kicker}</Kicker>
            <h2 data-rev data-delay={80} className="oeo-h2">
              {s.heading}
            </h2>
            <p data-rev data-delay={160} style={{ margin: "22px 0 0", maxWidth: 480, fontSize: 16, lineHeight: 1.65, color: C.muted }}>
              {s.body}
            </p>
            <div data-rev data-delay={240} style={{ marginTop: 46, display: "grid", gap: 18 }}>
              <Label>{s.primary.label}</Label>
              <Bars group={s.primary} accentFirst delayStep={120} />
              {s.primary.footnote ? <Label style={{ letterSpacing: "0.12em" }}>{s.primary.footnote}</Label> : null}
            </div>
          </div>

          <div>
            <div data-rev style={{ marginBottom: 26 }}>
              <Label>{s.secondary.label}</Label>
            </div>
            <div style={{ display: "grid", gap: 22 }}>
              <Bars group={s.secondary} reveal delayStep={80} />
            </div>
            {s.secondary.footnote ? (
              <div data-rev style={{ marginTop: 22 }}>
                <Label style={{ letterSpacing: "0.12em" }}>{s.secondary.footnote}</Label>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 05 the stack */

function Stack({ d }: { d: CaseStudyData }) {
  const s = d.stack;
  return (
    <section className="oeo-sec oeo-sec--tint oeo-sec--joined">
      <div className="oeo-wrap">
        <div className="oeo-head">
          <div data-rev>
            <Kicker>{s.kicker}</Kicker>
            <h2 className="oeo-h2">{s.heading}</h2>
          </div>
          <p data-rev data-delay={120} className="oeo-lede">
            {s.body}
          </p>
        </div>
        {/* Same tile anatomy as /stack — brand-tinted logo chip, name, role —
            resolved from STACK_TOOLS so a platform looks identical on both. */}
        <div className="oeo-chips">
          {s.platforms.map((name, i) => {
            const tool = STACK_TOOLS.find((t) => t.name === name);
            if (!tool) return null;
            return (
              <div key={name} data-rev data-delay={i * 40} className="oeo-chip oeo-chip--tool">
                <ToolLogo tool={tool} size={44} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tool.name}
                  </div>
                  <div style={{ color: C.faint, fontSize: 13, marginTop: 3 }}>{tool.role}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- 06 the shipped */

// Schematic stand-ins for real page captures. When `image` is set on a build in
// the data file the screenshot renders instead — no other change needed.
function Thumb({ page }: { page: PageBuild }) {
  if (page.image) {
    return (
      <div className="oeo-thumb oeo-thumb--img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={page.image} alt="" />
      </div>
    );
  }
  const line = (w: string, tall = 8, cls = "oeo-sk") => <div className={cls} style={{ height: tall, width: w }} />;
  switch (page.thumb) {
    case "hero":
      return (
        <div className="oeo-thumb">
          <div className="oeo-sk--on" style={{ height: "44%", opacity: 0.85 }} />
          <div style={{ display: "flex", gap: 8, height: "34%" }}>
            <div className="oeo-sk" style={{ flex: 1 }} />
            <div className="oeo-sk" style={{ flex: 1 }} />
            <div className="oeo-sk" style={{ flex: 1 }} />
          </div>
          {line("70%")}
          {line("45%")}
        </div>
      );
    case "split":
      return (
        <div className="oeo-thumb" style={{ flexDirection: "row", gap: 10 }}>
          <div className="oeo-sk" style={{ flex: 1.2 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {line("90%", 12, "oeo-sk oeo-sk--2")}
            {line("70%")}
            {line("80%")}
            {line("55%")}
            <div className="oeo-sk--on" style={{ marginTop: "auto", height: 30, opacity: 0.85 }} />
          </div>
        </div>
      );
    case "form":
      return (
        <div className="oeo-thumb" style={{ gap: 10, justifyContent: "center" }}>
          {line("60%", 12, "oeo-sk oeo-sk--2")}
          <div style={{ height: 30, border: `1px solid ${C.line}`, borderRadius: 4 }} />
          <div style={{ height: 30, border: `1px solid ${C.line}`, borderRadius: 4 }} />
          <div style={{ height: 30, border: `1px solid ${C.line}`, borderRadius: 4 }} />
          <div className="oeo-sk--on" style={{ height: 32, opacity: 0.85 }} />
        </div>
      );
    case "grid":
      return (
        <div className="oeo-thumb" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: 8 }}>
          <div className="oeo-sk" />
          <div className="oeo-sk" />
          <div className="oeo-sk--on" style={{ opacity: 0.85 }} />
          <div className="oeo-sk" />
          <div className="oeo-sk" />
          <div className="oeo-sk" />
        </div>
      );
    case "dark":
      // The one dark-thumbnail card in the reference — a campaign landing page.
      return (
        <div className="oeo-thumb" style={{ background: "#050605", gap: 10, justifyContent: "center" }}>
          <div style={{ height: 14, width: "80%", background: "rgba(243,245,242,0.85)" }} />
          <div style={{ height: 14, width: "55%", background: "rgba(243,245,242,0.85)" }} />
          <div style={{ height: 8, width: "65%", background: "rgba(243,245,242,0.3)" }} />
          <div className="oeo-sk--on" style={{ marginTop: 10, height: 32, width: "55%" }} />
        </div>
      );
    case "profile":
      return (
        <div className="oeo-thumb" style={{ gap: 10, alignItems: "center", justifyContent: "center" }}>
          <div className="oeo-sk" style={{ width: 74, height: 74, borderRadius: "50%" }} />
          {line("60%", 12, "oeo-sk oeo-sk--2")}
          {line("75%")}
          <div className="oeo-sk--on" style={{ height: 26, width: "46%", opacity: 0.85 }} />
        </div>
      );
    case "list":
      return (
        <div className="oeo-thumb" style={{ gap: 10, justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: i ? 8 : 0 }}>
                <div className={i === 2 ? "oeo-sk--on" : "oeo-sk oeo-sk--2"} style={{ width: 22, height: 22, borderRadius: "50%", flex: "none", opacity: i === 2 ? 0.85 : 1 }} />
                <div className="oeo-sk" style={{ height: 8, flex: 1 }} />
              </div>
              {line(["85%", "70%", "60%"][i])}
            </React.Fragment>
          ))}
        </div>
      );
  }
}

function Compare({ c }: { c: NonNullable<CaseStudyData["shipped"]["compare"]> }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const onSplit = (e: React.FormEvent<HTMLInputElement>) => {
    ref.current?.style.setProperty("--split", `${e.currentTarget.value}%`);
  };
  return (
    <div data-rev style={{ marginTop: 70 }}>
      <Label>{c.label}</Label>
      <div className="oeo-compare" ref={ref}>
        {/* BEFORE — the cluttered legacy page */}
        <div className="oeo-compare-layer oeo-compare-before">
          {c.beforeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.beforeImage} alt={c.beforeAlt} />
          ) : (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="oeo-sk--2" style={{ width: 70, height: 12 }} />
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="oeo-sk" style={{ width: 40, height: 10 }} />
                ))}
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 14, minHeight: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div className="oeo-sk--2" style={{ height: 16, width: "55%" }} />
                  {["95%", "88%", "92%", "85%", "90%", "80%", "86%", "72%"].map((w, i) => (
                    <div key={i} className="oeo-sk" style={{ height: 7, width: w }} />
                  ))}
                  <div className="oeo-sk--2" style={{ height: 24, width: 110, marginTop: 6 }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="oeo-sk" style={{ height: 52 }} />
                  <div className="oeo-sk" style={{ height: 52 }} />
                  <div className="oeo-sk" style={{ height: 52 }} />
                  <div className="oeo-sk--2" style={{ height: 22 }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* AFTER — the rebuilt template, revealed by the divider */}
        <div className="oeo-compare-layer oeo-compare-after" style={{ gap: 14 }}>
          {c.afterImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.afterImage} alt={c.afterAlt} />
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 90, height: 14, background: C.text }} />
                <div style={{ width: 90, height: 26, background: C.accent, borderRadius: 999 }} />
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, minHeight: 0 }}>
                <div className="oeo-sk" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center" }}>
                  <div style={{ height: 18, width: "85%", background: C.text }} />
                  <div className="oeo-sk" style={{ height: 8, width: "70%" }} />
                  <div className="oeo-sk" style={{ height: 8, width: "60%" }} />
                  <div className="oeo-sk--2" style={{ height: 14, width: "40%", marginTop: 6 }} />
                  <div style={{ height: 36, width: "65%", background: C.accent, borderRadius: 999, marginTop: 6 }} />
                  <div className="oeo-sk" style={{ height: 8, width: "50%" }} />
                </div>
              </div>
            </>
          )}
        </div>

        <span className="oeo-mono oeo-compare-tag oeo-compare-tag--before">Before</span>
        <span className="oeo-mono oeo-compare-tag oeo-compare-tag--after">After</span>
        <div className="oeo-compare-divider" />
        <div className="oeo-compare-handle" aria-hidden="true">
          ◂▸
        </div>
        <input
          className="oeo-compare-range"
          type="range"
          min="0"
          max="100"
          step="0.1"
          defaultValue="50"
          onInput={onSplit}
          aria-label="Compare before and after"
        />
      </div>
      <Label style={{ marginTop: 14, letterSpacing: "0.14em" }}>{c.caption}</Label>
    </div>
  );
}

function Shipped({ d }: { d: CaseStudyData }) {
  const s = d.shipped;
  return (
    <section className="oeo-sec oeo-sec--tint oeo-sec--joined">
      <div className="oeo-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 32, flexWrap: "wrap" }}>
          <div data-rev>
            <Kicker>{s.kicker}</Kicker>
            <h2 className="oeo-h2">{s.heading}</h2>
            <p style={{ margin: "22px 0 0", maxWidth: 560, fontSize: 16, lineHeight: 1.65, color: C.muted }}>{s.body}</p>
          </div>
          <div data-rev data-delay={120} style={{ paddingBottom: 6 }}>
            <Label style={{ letterSpacing: "0.2em" }}>{s.scrollHint}</Label>
          </div>
        </div>

        <div className="oeo-scroller">
          {s.pages.map((p, i) => (
            <div key={p.name} data-rev data-delay={i * 60} className="oeo-pcard">
              <Thumb page={p} />
              <div style={{ padding: "16px 18px" }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                <Label style={{ marginTop: 5, fontSize: 10, letterSpacing: "0.14em" }}>{p.type}</Label>
              </div>
            </div>
          ))}
          {s.more ? (
            <div data-rev data-delay={s.pages.length * 60} className="oeo-pcard oeo-pcard--more">
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em" }}>+{s.more.count}</div>
              <Label style={{ letterSpacing: "0.2em" }}>{s.more.label}</Label>
            </div>
          ) : null}
        </div>

        {s.compare ? <Compare c={s.compare} /> : null}
      </div>
    </section>
  );
}

/* --------------------------------------------------------- 07 how it ran */

function Approach({ d }: { d: CaseStudyData }) {
  const a = d.approach;
  return (
    <section className="oeo-sec oeo-sec--tint oeo-sec--joined" style={{ paddingBottom: 130 }}>
      <div className="oeo-wrap">
        <div className="oeo-approach">
          <div className="oeo-sticky">
            <Kicker>{a.kicker}</Kicker>
            <h2 data-rev data-delay={80} className="oeo-h2">
              {a.heading}
            </h2>
            <p data-rev data-delay={160} style={{ margin: "22px 0 0", maxWidth: 420, fontSize: 16, lineHeight: 1.65, color: C.muted }}>
              {a.body}
            </p>
          </div>
          <div>
            {a.phases.map((p, i) => (
              <div key={p.n} data-rev className="oeo-phase">
                <div className={`oeo-ghost${i === a.phases.length - 1 ? " on" : ""}`}>{p.n}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{p.title}</h3>
                  <span className="oeo-mono oeo-period">{p.period}</span>
                </div>
                <p style={{ margin: "14px 0 0", maxWidth: 520, fontSize: 15, lineHeight: 1.65, color: C.muted }}>{p.body}</p>
                <div className="oeo-mono" style={{ marginTop: 22, display: "grid", gap: 10, fontSize: 11, letterSpacing: "0.14em", color: C.muted }}>
                  {p.bullets.map((b) => (
                    <div key={b} style={{ display: "flex", gap: 10 }}>
                      {/* "/" rather than a dash — same marker the section
                          kickers and objective numbers use. */}
                      <span style={{ color: C.accent }}>/</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ quote */

function Quote({ q }: { q: NonNullable<CaseStudyData["quote"]> }) {
  return (
    <section className="oeo-sec" style={{ paddingBottom: 130 }}>
      <div className="oeo-wrap">
        <figure data-rev style={{ maxWidth: 980, margin: 0 }}>
          <div aria-hidden="true" style={{ fontSize: 64, fontWeight: 800, lineHeight: 0.6, color: C.accent }}>
            &ldquo;
          </div>
          <blockquote className="oeo-quote" style={{ margin: "18px 0 0" }}>
            {q.body}
          </blockquote>
          <figcaption className="oeo-mono" style={{ marginTop: 30, fontSize: 12, letterSpacing: "0.16em", color: C.muted }}>
            {q.attribution}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- page */

export default function CaseStudy({ data }: { data: CaseStudyData }) {
  const root = React.useRef<HTMLDivElement | null>(null);
  useScrollMotion(root);
  return (
    <div className="oeo" ref={root}>
      <ScrollProgress />
      <Nav />
      <Hero d={data} />
      <Objectives d={data} />
      <Results d={data} />
      <RevenueChart d={data} />
      <Split d={data} />
      <Stack d={data} />
      <Shipped d={data} />
      <Approach d={data} />
      {data.quote ? <Quote q={data.quote} /> : null}
      <Footer />
    </div>
  );
}
