"use client";

// "The Stack" page — interactive filterable grid of platforms, Signal style.
// Ported from the Claude Design handoff (stack-page.jsx).

import React from "react";
import Link from "next/link";
import { MD, C, STACK_CATS, STACK_TOOLS, navHref } from "@/lib/md";
import { ArrowIcon, CountUp, MarkLogo, ToolLogo, useScrollSync } from "@/components/shared";
import SiteFooter from "@/components/site-footer";
import { MobileMenu, NavCta } from "@/components/site-nav";

type Tool = (typeof STACK_TOOLS)[number];

// Height of .mk-topbar-inner — the filter bar pins directly under it, and the
// sentinel has to clear the same distance to know when the bar went sticky.
const TOPBAR_H = 64;

function Tile({ t, i }: { t: Tool; i: number }) {
  return (
    <div className="stk-tile stk-reveal" style={{ transitionDelay: (i % 4) * 50 + "ms" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <ToolLogo tool={t} />
        <div style={{ minWidth: 0 }}>
          <div className="stk-disp" style={{ fontSize: 18, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
          <div style={{ color: C.faint, fontSize: 13, marginTop: 3 }}>{t.role}</div>
        </div>
      </div>
      <div className="stk-why">{t.why}</div>
    </div>
  );
}

function Grid({ tools }: { tools: Tool[] }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = requestAnimationFrame(() => el && el.classList.add("in"));
    const t = setTimeout(() => el && el.classList.add("in"), 400);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [tools]);
  return (
    <div ref={ref} className="stk-grid">
      {tools.map((t, i) => (
        <Tile key={t.name} t={t} i={i} />
      ))}
    </div>
  );
}

function Section({ cat }: { cat: string }) {
  const tools = STACK_TOOLS.filter((t) => t.cat === cat);
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 22 }}>
        <h3 className="stk-disp" style={{ fontSize: 22, fontWeight: 700, margin: 0, whiteSpace: "nowrap" }}>{cat}</h3>
        <span style={{ color: C.faint, fontSize: 14 }}>{tools.length}</span>
        <div style={{ flex: 1, height: 1, background: C.line, marginLeft: 6 }}></div>
      </div>
      <Grid tools={tools} />
    </div>
  );
}

function Nav() {
  return (
    <header className="mk-topbar">
      <div className="stk-wrap mk-topbar-inner">
      <Link href="/" className="stk-disp mk-nav-logo" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700 }}>
        <MarkLogo size={22} color={C.text} accent={C.accent} />
        <span>
          {MD.brand}
          <span style={{ color: C.accent }}>.</span>
        </span>
      </Link>
      <nav className="stk-nav-links">
        {MD.nav.map((n) => (
          <Link key={n} className="stk-navlink" href={navHref(n)} style={n === "Stack" ? { color: C.text } : undefined}>
            {n}
          </Link>
        ))}
      </nav>
      <div className="mk-nav-right">
        {/* .stk-btn is this page's button flavour; .mk-nav-cta trims it to the
            bar's compact sizing. */}
        <NavCta className="stk-btn" />
        <MobileMenu />
      </div>
      </div>
    </header>
  );
}

// The sticky category filter. Expanded (all chips wrapped) while the hero is
// still on screen; collapsed to one scrolling row once the bar pins, so it
// costs ~56px of viewport instead of ~230px on the way down the page.
function FilterBar({ filter, setFilter }: { filter: string; setFilter: (c: string) => void }) {
  const [stuck, setStuck] = React.useState(false);
  const [open, setOpen] = React.useState(false); // manual override while stuck
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const railRef = React.useRef<HTMLDivElement | null>(null);
  const syncRef = useScrollSync();

  // The bar is pinned exactly when its own top has reached the sticky offset,
  // so measure that directly. An IntersectionObserver on a marker above the bar
  // is the usual trick, but a zero-height target gives the observer an empty
  // rect and it stops reporting crossings, which leaves the bar stuck open.
  React.useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const update = () => {
      const pinned = el.getBoundingClientRect().top <= TOPBAR_H + 0.5;
      setStuck(pinned);
      if (!pinned) setOpen(false); // back at the top: forget the override
    };
    update();
    syncRef.current = update;
    window.addEventListener("resize", update);
    return () => {
      syncRef.current = null;
      window.removeEventListener("resize", update);
    };
  }, [syncRef]);

  const collapsed = stuck && !open;

  // Collapsing hides everything past the first row, so pull the selected chip
  // into view rather than leaving it somewhere off to the right. The chip is
  // looked up by attribute rather than held in a ref — one ref shared across
  // chips lands on whichever element React attaches last, which is not
  // reliably the selected one. Instant, not smooth: picking a category also
  // reflows the page, and that cancels an in-flight smooth scroll.
  React.useEffect(() => {
    const rail = railRef.current;
    if (!collapsed || !rail) return;
    const chip = rail.querySelector<HTMLElement>(`[data-cat="${CSS.escape(filter)}"]`);
    if (!chip) return;
    const left = rail.scrollLeft + chip.getBoundingClientRect().left - rail.getBoundingClientRect().left;
    rail.scrollTo({ left: Math.max(0, left - (rail.clientWidth - chip.offsetWidth) / 2), behavior: "auto" });
  }, [collapsed, filter]);

  return (
    <div ref={barRef} className={"stk-filter" + (collapsed ? " is-collapsed" : "")}>
      <div className="stk-wrap stk-filter-inner">
        <div ref={railRef} className="stk-filter-rail">
          {["All", ...STACK_CATS].map((c) => (
            <button
              key={c}
              data-cat={c}
              className={"stk-chip" + (filter === c ? " on" : "")}
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
            >
              {c}
            </button>
          ))}
        </div>
        {stuck && (
          <button className="stk-filter-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={!collapsed}>
            {collapsed ? "All filters" : "Collapse"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 15l6-6 6 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function StackPage() {
  const [filter, setFilter] = React.useState("All");
  const shown = filter === "All" ? STACK_CATS : [filter];
  return (
    <div className="stk">
      <Nav />
      {/* hero */}
      <header className="stk-wrap" style={{ paddingTop: 84, paddingBottom: 30 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            marginBottom: 28,
            padding: "7px 14px 7px 11px",
            borderRadius: 999,
            border: `1px solid ${C.line}`,
            background: "rgba(255,255,255,.025)",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 9, background: C.accent }}></span>
          <span style={{ color: C.muted, fontSize: 13.5, fontWeight: 500 }}>Platforms we work in every day</span>
        </div>
        <h1 className="stk-disp stk-h1" style={{ lineHeight: 0.98, fontWeight: 700, margin: 0, maxWidth: 900 }}>
          The right stack,
          <br />
          <span style={{ color: C.muted }}>not the biggest one.</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 20, lineHeight: 1.55, maxWidth: 640, marginTop: 30 }}>
          These are the platforms we have hands-on, in-production experience with. The work isn&apos;t running all of them. It&apos;s identifying the
          short list of best-in-class tools that actually fit your business requirements, and cutting the ones that don&apos;t earn their place.
        </p>
        <div style={{ display: "flex", gap: 40, marginTop: 44, flexWrap: "wrap" }}>
          <div>
            <div className="stk-disp" style={{ fontSize: 44, fontWeight: 700, color: C.accent }}>
              <CountUp value={STACK_TOOLS.length} />
            </div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>platforms we know</div>
          </div>
          <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 40 }}>
            <div className="stk-disp" style={{ fontSize: 44, fontWeight: 700 }}>
              <CountUp value={STACK_CATS.length} />
            </div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>categories covered</div>
          </div>
          <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 40 }}>
            <div className="stk-disp" style={{ fontSize: 44, fontWeight: 700 }}>
              <CountUp value={1} />
              <span style={{ fontSize: 44, fontWeight: 700 }}> stack</span>
            </div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>scoped to your requirements</div>
          </div>
        </div>
      </header>
      {/* filter bar */}
      <FilterBar filter={filter} setFilter={setFilter} />
      {/* sections */}
      <main className="stk-wrap" style={{ paddingTop: 56, paddingBottom: 40 }}>
        {shown.map((cat) => (
          <Section key={cat} cat={cat} />
        ))}
      </main>
      {/* how the stack gets chosen — selection first, then the legacy cleanup
          that usually has to happen before any of it can scale */}
      <section className="stk-wrap" style={{ paddingTop: 30, paddingBottom: 20 }}>
        <div className="stk-note-grid">
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>Selection</div>
            <h2 className="stk-disp" style={{ fontSize: 26, fontWeight: 700, margin: "14px 0 0" }}>Fit before feature count.</h2>
            <p style={{ color: C.muted, fontSize: 16.5, lineHeight: 1.6, marginTop: 12 }}>
              Every category above has three or four credible options, and the right one depends entirely on your catalog, margins, markets, and team.
              We start from your business requirements and work back to the shortest list of tools that meets them. Fewer platforms, each one
              genuinely earning its licence.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: C.accent, fontWeight: 600 }}>Untangling</div>
            <h2 className="stk-disp" style={{ fontSize: 26, fontWeight: 700, margin: "14px 0 0" }}>Most stacks arrive inherited.</h2>
            <p style={{ color: C.muted, fontSize: 16.5, lineHeight: 1.6, marginTop: 12 }}>
              Overlapping subscriptions, half-finished migrations, integrations nobody owns. We&apos;ve spent years unpicking legacy setups and
              rebuilding the operational systems underneath them, so the stack you keep is one that scales with volume, markets, and headcount
              instead of fighting all three.
            </p>
          </div>
        </div>
      </section>
      {/* cta */}
      <section className="stk-wrap" style={{ paddingTop: 50, paddingBottom: 100, textAlign: "center", borderTop: `1px solid ${C.line}` }}>
        <h2 className="stk-disp" style={{ fontSize: 40, fontWeight: 700, margin: "60px 0 0", letterSpacing: "-0.03em" }}>Not sure what belongs in yours?</h2>
        <p style={{ color: C.muted, fontSize: 18, marginTop: 16, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
          We&apos;ll audit what you&apos;re running today, map it against what you actually need, and build the stack that gets you there.
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <Link className="stk-btn" href={MD.ctaHref} style={{ fontSize: 16, padding: "15px 26px" }}>
            {MD.cta}
            <ArrowIcon />
          </Link>
        </div>
      </section>
      {/* The shared footer (components/site-footer.tsx) — same on every page. */}
      <SiteFooter />
    </div>
  );
}
