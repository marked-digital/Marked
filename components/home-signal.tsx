"use client";

// Marked Digital homepage — "Signal" direction, final theme baked in
// (deep emerald #1FA85F, Plus Jakarta Sans, Signal atmosphere).
// Ported from the Claude Design handoff (home-signal.jsx).

import React from "react";
import Link from "next/link";
import { MD, C, STACK_TOOLS, STACK_CATS, WORK, navHref } from "@/lib/md";
import { ArrowIcon, CountUp, MarkLogo, ScrollGlobe, Swap, useInView, useMagnetic, useReveal, useRotate, useScrollSync } from "@/components/shared";
import { ExpansionPlanner, GrowthCalc, WorkflowField } from "@/components/interactive";
import { MobileMenu, NavCta } from "@/components/site-nav";

function Nav() {
  return (
    <header className="mk-topbar">
      <div className="sg-wrap mk-topbar-inner">
      <div className="mk-nav-logo" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700, letterSpacing: "-0.03em" }}>
        <MarkLogo size={22} color={C.text} accent={C.accent} />
        <span>
          {MD.brand}
          <span style={{ color: C.accent }}>.</span>
        </span>
      </div>
      <nav className="sg-nav-links">
        {MD.nav.map((n) => (
          <Link key={n} className="sg-navlink" href={navHref(n)}>
            {n}
          </Link>
        ))}
      </nav>
      {/* ≤760px the link row above and the bar CTA are hidden, and MobileMenu's
          hamburger takes over at the right end of the bar. */}
      <div className="mk-nav-right">
        <NavCta />
        <MobileMenu />
      </div>
      </div>
    </header>
  );
}

function Hero() {
  const h = MD.hero;
  const mag = useMagnetic<HTMLAnchorElement>(0.3);
  const mk = useRotate(MD.markets.length);
  return (
    <div className="sg-hero-shell">
      <ScrollGlobe />
      <header className="sg-wrap sg-hero" style={{ paddingTop: 100, paddingBottom: 64 }}>
      <div
        className="reveal"
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 30,
          padding: "7px 14px 7px 11px",
          borderRadius: 999,
          border: `1px solid ${C.line}`,
          background: "rgba(255,255,255,.025)",
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: 9, background: C.accent }}></span>
        <span style={{ color: C.muted, fontSize: 13.5, letterSpacing: "0.02em", fontWeight: 500 }}>{h.eyebrow}</span>
      </div>
      <h1 className="sg-h1 reveal d1" style={{ position: "relative", fontWeight: 700, margin: 0, maxWidth: 1000 }}>
        {h.h1[0]}
        <br />
        <span style={{ color: C.muted }}>{h.h1[1]}</span>
      </h1>
      <p className="reveal d2" style={{ position: "relative", color: C.muted, fontSize: 20, lineHeight: 1.55, maxWidth: 580, marginTop: 34 }}>
        {h.sub}
      </p>
      <div className="reveal d3" style={{ position: "relative", display: "flex", gap: 14, marginTop: 38, flexWrap: "wrap" }}>
        <Link ref={mag} className="sg-btn sg-btn--p" href={MD.ctaHref}>
          {MD.cta}
          <ArrowIcon />
        </Link>
        <Link className="sg-btn sg-btn--g" href="/#work">
          See our work
        </Link>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginTop: 22, color: C.faint, fontSize: 14.5 }}>
        <span style={{ width: 6, height: 6, borderRadius: 6, background: C.accent }}></span>
        Now launching in <Swap style={{ color: C.text, fontWeight: 600 }}>{MD.markets[mk]}</Swap>
      </div>
      <div className="sg-metrics reveal d4" style={{ position: "relative", marginTop: 92, borderTop: `1px solid ${C.line}` }}>
        {MD.metrics.map((m, i) => (
          <div key={i} style={{ padding: "30px 26px 0 0", borderLeft: i === 0 ? "none" : `1px solid ${C.line}`, paddingLeft: i === 0 ? 0 : 26 }}>
            <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.03em" }}>
              <CountUp {...m} />
            </div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 8 }}>{m.label}</div>
          </div>
        ))}
      </div>
      </header>
    </div>
  );
}

// Depth cue for the stacked cards. Blurring 80vh layers janks low-end phones,
// so it's desktop-only — small screens get the scale alone.
const WORK_MAX_BLUR = 5; // px
const WORK_BLUR_MIN_W = 768; // px

// Selected work — a scroll-stacking card section, and the homepage's social
// proof (work, not logos). The stacking itself is pure CSS: every card is
// sticky at the same offset, so each new card scrolls up and over the pinned
// one. This effect only adds the depth cue — as card i+1 covers card i, card i
// scales 1 → 0.8 and blurs 0 → 5px linearly with coverage. The last card is
// never covered, so it's left alone.
function SelectedWork() {
  const cardsRef = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [headRef, headSeen] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const syncRef = useScrollSync();

  React.useEffect(() => {
    // Reduced motion: the cards still stack via sticky, they just don't
    // scale or blur.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The sticky offset lives in CSS (.sg-work-card) and shifts responsively,
    // so read it back instead of duplicating the number here — the two can't
    // drift out of sync.
    let stickyTop = 0;
    let maxBlur = 0;
    const measure = () => {
      const first = cardsRef.current[0];
      stickyTop = first ? parseFloat(getComputedStyle(first).top) || 0 : 0;
      maxBlur = window.innerWidth > WORK_BLUR_MIN_W ? WORK_MAX_BLUR : 0;
    };

    const update = () => {
      const cards = cardsRef.current;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card) continue;
        const next = cards[i + 1];
        if (!next) {
          card.style.transform = "";
          card.style.filter = "";
          continue;
        }
        // offsetHeight, not the rect — the rect is already scaled by us.
        const h = card.offsetHeight;
        // The next card's top travels from (stickyTop + h) down to stickyTop as
        // it slides over this one; that ratio is how covered this card is.
        const p = Math.min(1, Math.max(0, (stickyTop + h - next.getBoundingClientRect().top) / h));
        card.style.transform = `scale(${(1 - p * 0.2).toFixed(4)})`;
        card.style.filter = maxBlur ? `blur(${(p * maxBlur).toFixed(2)}px)` : "";
      }
    };
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    syncRef.current = update;
    window.addEventListener("resize", onResize);
    return () => {
      syncRef.current = null;
      window.removeEventListener("resize", onResize);
    };
  }, [syncRef]);

  // Cursor-following "View" pill. Mouse only — the pill is hidden on touch by
  // the (hover: hover) media query, so there's nothing to move there.
  const trackCursor = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    // The card may be mid-scale, so map viewport px back into its own space.
    const k = el.offsetWidth ? r.width / el.offsetWidth : 1;
    el.style.setProperty("--wx", `${(e.clientX - r.left) / k}px`);
    el.style.setProperty("--wy", `${(e.clientY - r.top) / k}px`);
  };

  return (
    <section id="work" className="sg-wrap" style={{ paddingTop: 96, paddingBottom: 96, scrollMarginTop: 96 }}>
      <div
        ref={headRef}
        className={"mk-reveal" + (headSeen ? " is-in" : "")}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginBottom: 46 }}
      >
        <div className="mk-reveal-l">
          <h2 style={{ fontSize: 15, fontWeight: 500, color: C.muted, letterSpacing: "0.04em", margin: 0 }}>SELECTED WORK · 47 MARKETS</h2>
          <h3 className="sg-h2" style={{ fontWeight: 700, letterSpacing: "-0.03em", margin: "22px 0 0", lineHeight: 1.06 }}>
            Proof, in any market.
          </h3>
        </div>
        <p className="mk-reveal-r" style={{ color: C.faint, fontSize: 14, maxWidth: 340, margin: 0 }}>
          Growth engineered through expansion, paid media, web builds, and marketing systems.
        </p>
      </div>

      <div className="sg-work-stack">
        {WORK.map((item, i) => (
          <Link
            key={item.title}
            href={item.href}
            prefetch={false}
            className="sg-work-card"
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            style={{ background: item.bg }}
            onPointerMove={trackCursor}
            aria-label={`${item.title}. ${item.industry}. ${item.tags.join(", ")}. ${item.metric}`}
          >
            <span className="sg-work-texture" aria-hidden="true" />
            {/* Kept in the DOM so real case photography drops in behind it. */}
            <span className="sg-work-shade" aria-hidden="true" />
            <span className="sg-work-body">
              <span className="sg-work-n">{String(i + 1).padStart(2, "0")}</span>
              {/* The display size is tuned for short wordmarks. A full company
                  name set at that scale wraps to three lines and swallows the
                  card, so long titles step down a size. */}
              <span className={"sg-work-title" + (item.title.length > 12 ? " sg-work-title--long" : "")}>{item.title}</span>
              <span className="sg-work-industry">{item.industry}</span>
              <span className="sg-work-meta">
                {item.tags.map((t) => (
                  <span key={t} className="sg-work-pill">
                    {t}
                  </span>
                ))}
                <span className="sg-work-metric">{item.metric}</span>
              </span>
            </span>
            <span className="sg-work-cursor" aria-hidden="true">
              View →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const [active, setActive] = React.useState(0);
  const detRef = React.useRef<HTMLDivElement | null>(null);
  const firstRef = React.useRef(true);
  // Slide the category list in from the left when the section scrolls into view.
  const [listRef, listSeen] = useInView<HTMLDivElement>({ threshold: 0.2 });
  React.useEffect(() => {
    const el = detRef.current;
    if (!el) return;
    const show = () => {
      if (detRef.current) {
        detRef.current.style.opacity = "1";
        detRef.current.style.transform = "none";
      }
    };
    if (firstRef.current) {
      firstRef.current = false;
      show();
      return;
    }
    // Snap to the hidden state with the transition off, and commit it with a
    // forced reflow before re-enabling. With the 0.45s transition live, these
    // writes animated the panel downward first (a visible jump on mobile
    // frame rates) before the fade-in yanked it back.
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    void el.offsetHeight;
    el.style.transition = "";
    const id = requestAnimationFrame(() => requestAnimationFrame(show));
    const t = setTimeout(show, 240);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [active]);
  return (
    <section id="services" className="sg-wrap" style={{ paddingTop: 108, paddingBottom: 108, scrollMarginTop: 96 }}>
      <div className="sg-sec-head">
        <h2 style={{ fontSize: 15, fontWeight: 500, color: C.muted, letterSpacing: "0.04em", margin: 0 }}>WHAT WE DO</h2>
        <p style={{ color: C.faint, fontSize: 14, margin: 0 }}>Five capabilities. One growth system.</p>
      </div>
      <div className="sg-svc-grid">
        <div ref={listRef} className={"sg-svc-list" + (listSeen ? " is-in" : "")}>
          {MD.services.map((sv, i) => (
            <div
              key={sv.key}
              className={"sg-svc" + (i === active ? " is-on" : "")}
              onClick={() => setActive(i)}
              style={{
                borderBottom: i === MD.services.length - 1 ? `1px solid ${C.line}` : "none",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <span className="sg-svc-n">{sv.n}</span>
              <span className="sg-svc-t">{sv.title}</span>
            </div>
          ))}
        </div>
        <div ref={detRef} className="sg-detail" style={{ position: "sticky", top: 40, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: 40 }}>
          {/* Every panel renders into the server HTML (inactive ones are
              display:none) so crawlers and answer engines can quote all five
              subheads and descriptions, not just the tab that happens to be
              open. The tab-change animation lives on the container above and
              is unaffected. */}
          {MD.services.map((sv, i) => (
            <div key={sv.key} style={{ display: i === active ? "block" : "none" }}>
              <h3 style={{ color: C.accent, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0 }}>{sv.tag}</h3>
              <p style={{ color: C.muted, fontSize: 16.5, lineHeight: 1.6, marginTop: 18 }}>{sv.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginTop: 30 }}>
                {sv.bullets.map((b) => (
                  <div key={b} className="sg-bullet">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.4" style={{ marginTop: 3, flex: "none" }}>
                      <path d="M5 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {b}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 34, paddingTop: 26, borderTop: `1px solid ${C.line}` }}>
                <span style={{ fontSize: 40, color: C.text, fontWeight: 700, letterSpacing: "-0.03em" }}>{sv.stat[0]}</span>
                <span style={{ color: C.muted, fontSize: 15 }}>{sv.stat[1]}</span>
              </div>
              {/* The Architecture section deep-dives the stack; this panel
                  stays service-level and links down. */}
              {sv.key === "stack" && (
                <Link className="sg-navlink" href="/stack" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 22, color: C.text, fontSize: 14, fontWeight: 600 }}>
                  Explore the full stack
                  <ArrowIcon />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Lead platforms for the "Embedded" blurb — one recognizable name per
// category, pulled straight from the Tech Stack data so copy + animation
// stay in sync with STACK_TOOLS.
const EMBED_LEAD = ["Commerce", "Advertising", "Email & CRM", "Cloud & Infrastructure", "AI & Automation"]
  .map((cat) => STACK_TOOLS.find((t) => t.cat === cat)?.name)
  .filter(Boolean)
  .slice(0, 5)
  .join(", ");

function Architecture() {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <section id="about" className="sg-wrap sg-arch" style={{ paddingTop: 40, paddingBottom: 110, scrollMarginTop: 96 }}>
      <div className="sg-arch-grid">
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 500, color: C.muted, letterSpacing: "0.04em", margin: 0 }}>ARCHITECTURE</h2>
          <h3 className="sg-h2" style={{ fontWeight: 700, letterSpacing: "-0.03em", margin: "22px 0 0", lineHeight: 1.06 }}>
            The right stack,
            <br />
            not the biggest one.
          </h3>
          <p style={{ color: C.muted, fontSize: 17.5, lineHeight: 1.6, marginTop: 22, maxWidth: 460 }}>
            Every category has three or four credible options, and the right one depends entirely on your catalog, margins, markets, and team. We have
            hands-on experience with {STACK_TOOLS.length} platforms across {STACK_CATS.length} categories. The work isn&apos;t running all of them &mdash;
            it&apos;s cutting back to the short list that fits your requirements.
          </p>
          <p style={{ color: C.muted, fontSize: 17.5, lineHeight: 1.6, marginTop: 18, maxWidth: 460 }}>
            Most stacks arrive inherited: overlapping subscriptions, half-finished migrations, integrations nobody owns. We unpick that and rebuild the
            operational systems underneath, so what you keep scales with volume, markets, and headcount instead of fighting all three.
          </p>
          <div style={{ display: "flex", gap: 36, marginTop: 36, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 34, fontWeight: 700, color: C.accent, letterSpacing: "-0.03em" }}>
                <CountUp value={STACK_TOOLS.length} />
              </div>
              <div style={{ color: C.muted, fontSize: 13.5, marginTop: 4 }}>platforms we know</div>
            </div>
            <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 36 }}>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em" }}>
                <CountUp value={1} />
              </div>
              <div style={{ color: C.muted, fontSize: 13.5, marginTop: 4 }}>stack, scoped to your requirements</div>
            </div>
          </div>
          <Link className="sg-navlink" href="/stack" style={{ display: "inline-flex", alignItems: "center", gap: 7, marginTop: 34, color: C.text, fontSize: 15, fontWeight: 600 }}>
            Explore the full stack
            <ArrowIcon />
          </Link>
        </div>

        <div
          ref={ref}
          className="sg-embed"
          style={{
            opacity: seen ? 1 : 0,
            transform: seen ? "none" : "translateY(28px) skewY(1.5deg)",
            transition: "opacity 0.6s, transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)",
            willChange: "transform, opacity",
          }}
        >
          <WorkflowField />
          <div className="sg-embed-meta">
            <div className="sg-embed-title-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
              <span>Embedded in your workflow</span>
            </div>
            <p>{EMBED_LEAD}. We plug into whatever you already run, and operate it like part of your team.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Interactive() {
  return (
    <>
      <section className="sg-wrap" style={{ paddingTop: 0, paddingBottom: 110 }}>
        <GrowthCalc />
      </section>
      <section className="sg-wrap" style={{ paddingTop: 0, paddingBottom: 110 }}>
        <ExpansionPlanner />
      </section>
    </>
  );
}

function Approach() {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.18 });
  return (
    <section style={{ background: C.panel, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
      <div ref={ref} className={"sg-wrap mk-reveal" + (seen ? " is-in" : "")} style={{ paddingTop: 92, paddingBottom: 92 }}>
        <h2 className="sg-h2 mk-reveal-l" style={{ fontWeight: 600, letterSpacing: "-0.03em", margin: 0, maxWidth: 620 }}>
          A system that compounds, not a campaign that ends.
        </h2>
        <div className="sg-approach-grid mk-reveal-r" style={{ marginTop: 64 }}>
          {MD.approach.map((a) => (
            <div key={a.n}>
              <div style={{ fontSize: 18, color: C.accent, fontWeight: 500 }}>{a.n}</div>
              <div style={{ fontSize: 26, fontWeight: 600, marginTop: 14, letterSpacing: "-0.02em" }}>{a.title}</div>
              <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.6, marginTop: 12 }}>{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const c = MD.ctaBand;
  return (
    <section className="sg-wrap" style={{ paddingTop: 110, paddingBottom: 110, textAlign: "center" }}>
      <div style={{ color: C.accent, fontSize: 14, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 22 }}>{c.kicker.toUpperCase()}</div>
      <h2 className="sg-cta-h2" style={{ fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.0, margin: 0 }}>
        {c.title[0]}
        <br />
        {c.title[1]}
      </h2>
      <p style={{ color: C.muted, fontSize: 19, lineHeight: 1.55, maxWidth: 520, margin: "26px auto 0" }}>{c.sub}</p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 38 }}>
        <Link className="sg-btn sg-btn--p" href={MD.ctaHref}>
          {MD.cta}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  const f = MD.footer;
  return (
    <footer style={{ borderTop: `1px solid ${C.line}` }}>
      <div className="sg-wrap sg-foot-grid" style={{ paddingTop: 60, paddingBottom: 44 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>
            <MarkLogo size={24} color={C.text} accent={C.accent} />
            <span>
              {MD.brand}
              <span style={{ color: C.accent }}>.</span>
            </span>
          </div>
          <p style={{ color: C.faint, fontSize: 14.5, marginTop: 16, maxWidth: 230, lineHeight: 1.55 }}>{f.address}</p>
        </div>
        {f.cols.map((col) => (
          <div key={col.h}>
            <div style={{ fontSize: 13, color: C.faint, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>{col.h}</div>
            {col.items.map((it) => {
              const label = typeof it === "string" ? it : it.label;
              const href = typeof it === "string" ? "#" : it.href;
              const external = href.startsWith("http");
              return (
                <a
                  key={label}
                  className="sg-navlink"
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  style={{ display: "block", marginBottom: 11 }}
                >
                  {label}
                </a>
              );
            })}
          </div>
        ))}
      </div>
      <div className="sg-wrap" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 22, paddingBottom: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: C.faint, fontSize: 13.5 }}>
        <span>© 2026 {MD.brandFull}. All rights reserved.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}

export default function HomeSignal() {
  const root = useReveal<HTMLDivElement>();
  return (
    <div className="sg" ref={root}>
      <Nav />
      <Hero />
      <SelectedWork />
      <Services />
      <Architecture />
      <Interactive />
      <Approach />
      <CTA />
      <Footer />
    </div>
  );
}
