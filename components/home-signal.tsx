"use client";

// Marked Digital homepage — "Signal" direction, final theme baked in
// (deep emerald #1FA85F, Plus Jakarta Sans, Signal atmosphere).
// Ported from the Claude Design handoff (home-signal.jsx).

import React from "react";
import Link from "next/link";
import { MD, C } from "@/lib/md";
import { ArrowIcon, CountUp, MarkLogo, Swap, useMagnetic, useReveal, useRotate } from "@/components/shared";
import { ExpansionPlanner, GrowthCalc } from "@/components/interactive";

// Signal atmosphere: glow 0.17 → hex alpha 2b
const GLOW = `${C.accent}2b`;

function Nav() {
  return (
    <div className="sg-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 84 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>
        <MarkLogo size={26} color={C.text} accent={C.accent} />
        <span>
          {MD.brand}
          <span style={{ color: C.accent }}>.</span>
        </span>
      </div>
      <nav className="sg-nav-links">
        {MD.nav.map((n) => (
          <a key={n} className="sg-navlink" href="#">
            {n}
          </a>
        ))}
        <Link className="sg-navlink" href="/stack">
          Stack
        </Link>
      </nav>
      <button className="sg-btn sg-btn--p" style={{ padding: "11px 20px", fontSize: 15 }}>
        {MD.cta}
      </button>
    </div>
  );
}

function Hero() {
  const h = MD.hero;
  const mag = useMagnetic(0.3);
  const mk = useRotate(MD.markets.length);
  return (
    <header className="sg-wrap sg-hero" style={{ paddingTop: 100, paddingBottom: 64 }}>
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -90,
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GLOW}, transparent 62%)`,
          pointerEvents: "none",
        }}
      ></div>
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
        <button ref={mag} className="sg-btn sg-btn--p">
          {MD.cta}
          <ArrowIcon />
        </button>
        <button className="sg-btn sg-btn--g">See our work</button>
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
  );
}

function Logos() {
  return (
    <section className="sg-wrap" style={{ paddingTop: 56, paddingBottom: 16 }}>
      <p style={{ color: C.faint, fontSize: 13.5, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 26 }}>
        Trusted by brands scaling across 47 markets
      </p>
      <div className="sg-logo-row" style={{ display: "flex", flexWrap: "wrap", gap: "26px 48px", alignItems: "center" }}>
        {MD.logos.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const [active, setActive] = React.useState(0);
  const s = MD.services[active];
  const detRef = React.useRef<HTMLDivElement | null>(null);
  const firstRef = React.useRef(true);
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
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    const id = requestAnimationFrame(() => requestAnimationFrame(show));
    const t = setTimeout(show, 240);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [active]);
  return (
    <section className="sg-wrap" style={{ paddingTop: 108, paddingBottom: 108 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 46 }}>
        <h2 style={{ fontSize: 15, fontWeight: 500, color: C.muted, letterSpacing: "0.04em", margin: 0 }}>WHAT WE DO</h2>
        <p style={{ color: C.faint, fontSize: 14 }}>Five capabilities. One growth system.</p>
      </div>
      <div className="sg-svc-grid">
        <div>
          {MD.services.map((sv, i) => (
            <div
              key={sv.key}
              className={"sg-svc" + (i === active ? " is-on" : "")}
              onClick={() => setActive(i)}
              style={{ borderBottom: i === MD.services.length - 1 ? `1px solid ${C.line}` : "none" }}
            >
              <span className="sg-svc-n">{sv.n}</span>
              <span className="sg-svc-t">{sv.title}</span>
            </div>
          ))}
        </div>
        <div ref={detRef} className="sg-detail" style={{ position: "sticky", top: 40, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: 40 }}>
          <div style={{ color: C.accent, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>{s.tag}</div>
          <p style={{ color: C.muted, fontSize: 16.5, lineHeight: 1.6, marginTop: 18 }}>{s.desc}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px", marginTop: 30 }}>
            {s.bullets.map((b) => (
              <div key={b} className="sg-bullet">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.4" style={{ marginTop: 3, flex: "none" }}>
                  <path d="M5 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 34, paddingTop: 26, borderTop: `1px solid ${C.line}` }}>
            <span style={{ fontSize: 40, color: C.text, fontWeight: 700, letterSpacing: "-0.03em" }}>{s.stat[0]}</span>
            <span style={{ color: C.muted, fontSize: 15 }}>{s.stat[1]}</span>
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
  return (
    <section style={{ background: C.panel, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
      <div className="sg-wrap" style={{ paddingTop: 92, paddingBottom: 92 }}>
        <h2 className="sg-h2" style={{ fontWeight: 600, letterSpacing: "-0.03em", margin: 0, maxWidth: 620 }}>
          A system that compounds — not a campaign that ends.
        </h2>
        <div className="sg-approach-grid" style={{ marginTop: 64 }}>
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
        <button className="sg-btn sg-btn--p">
          {MD.cta}
          <ArrowIcon />
        </button>
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
            {col.items.map((it) => (
              <a key={it} className="sg-navlink" href="#" style={{ display: "block", marginBottom: 11 }}>
                {it}
              </a>
            ))}
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
      <Logos />
      <Services />
      <Interactive />
      <Approach />
      <CTA />
      <Footer />
    </div>
  );
}
