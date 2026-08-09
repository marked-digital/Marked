"use client";

// "The Stack" page — interactive filterable grid of platforms, Signal style.
// Ported from the Claude Design handoff (stack-page.jsx).

import React from "react";
import Link from "next/link";
import { MD, C, STACK_CATS, STACK_TOOLS, navHref } from "@/lib/md";
import { iconPath } from "@/lib/icons";
import { ArrowIcon, BrandLogo, CountUp, MarkLogo, hexToRgba, useLocalLogo } from "@/components/shared";

type Tool = (typeof STACK_TOOLS)[number];

function Tile({ t, i }: { t: Tool; i: number }) {
  const localUrl = useLocalLogo(t.localLogo);
  const logo = iconPath(t.icon);
  return (
    <div className="stk-tile stk-reveal" style={{ transitionDelay: (i % 4) * 50 + "ms" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: hexToRgba(t.color, 0.14),
            border: `1px solid ${hexToRgba(t.color, 0.3)}`,
            color: t.color,
            fontWeight: 800,
            fontSize: t.mono.length >= 3 ? 14 : t.mono.length === 2 ? 19 : 24,
            letterSpacing: "-0.02em",
          }}
        >
          {localUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={localUrl} alt="" width={28} height={28} style={{ objectFit: "contain" }} />
          ) : logo ? (
            <BrandLogo path={logo} color={t.color} size={26} />
          ) : (
            t.mono
          )}
        </div>
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
      <Link href="/" className="stk-disp" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 700 }}>
        <MarkLogo size={22} color={C.text} accent={C.accent} />
        <span>
          {MD.brand}
          <span style={{ color: C.accent }}>.</span>
        </span>
      </Link>
      <nav className="stk-nav-links">
        {MD.nav.map((n) => (
          <Link key={n} className="stk-navlink" href={navHref(n)}>
            {n}
          </Link>
        ))}
        <Link className="stk-navlink" style={{ color: C.text }} href="/stack">
          Stack
        </Link>
      </nav>
      {/* Compact nav variant of .stk-btn — matches the .sg-btn--p nav sizing. */}
      <Link className="stk-btn" href={MD.ctaHref} style={{ padding: "9px 17px", fontSize: 14 }}>
        {MD.cta}
      </Link>
      </div>
    </header>
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
          <span style={{ color: C.muted, fontSize: 13.5, fontWeight: 500 }}>The stack behind the growth</span>
        </div>
        <h1 className="stk-disp stk-h1" style={{ lineHeight: 0.98, fontWeight: 700, margin: 0, maxWidth: 900 }}>
          Best-in-class tools,
          <br />
          <span style={{ color: C.muted }}>wired into one system.</span>
        </h1>
        <p style={{ color: C.muted, fontSize: 20, lineHeight: 1.55, maxWidth: 600, marginTop: 30 }}>
          We don&apos;t reinvent the wheel — we orchestrate the best platforms in commerce, cloud, AI, and analytics so your growth runs on proven
          infrastructure.
        </p>
        <div style={{ display: "flex", gap: 40, marginTop: 44, flexWrap: "wrap" }}>
          <div>
            <div className="stk-disp" style={{ fontSize: 44, fontWeight: 700, color: C.accent }}>
              <CountUp value={STACK_TOOLS.length} />
            </div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>platforms</div>
          </div>
          <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 40 }}>
            <div className="stk-disp" style={{ fontSize: 44, fontWeight: 700 }}>
              <CountUp value={STACK_CATS.length} />
            </div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>categories</div>
          </div>
          <div style={{ borderLeft: `1px solid ${C.line}`, paddingLeft: 40 }}>
            <div className="stk-disp" style={{ fontSize: 44, fontWeight: 700 }}>
              <CountUp value={1} />
              <span style={{ fontSize: 44, fontWeight: 700 }}> system</span>
            </div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>connected end-to-end</div>
          </div>
        </div>
      </header>
      {/* filter bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: hexToRgba("#0A0B0A", 0.82), backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.line}` }}>
        <div className="stk-wrap" style={{ display: "flex", gap: 10, paddingTop: 16, paddingBottom: 16, flexWrap: "wrap" }}>
          {["All", ...STACK_CATS].map((c) => (
            <button key={c} className={"stk-chip" + (filter === c ? " on" : "")} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {/* sections */}
      <main className="stk-wrap" style={{ paddingTop: 56, paddingBottom: 40 }}>
        {shown.map((cat) => (
          <Section key={cat} cat={cat} />
        ))}
      </main>
      {/* cta */}
      <section className="stk-wrap" style={{ paddingTop: 50, paddingBottom: 100, textAlign: "center", borderTop: `1px solid ${C.line}` }}>
        <h2 className="stk-disp" style={{ fontSize: 40, fontWeight: 700, margin: "60px 0 0", letterSpacing: "-0.03em" }}>Want this stack working for you?</h2>
        <p style={{ color: C.muted, fontSize: 18, marginTop: 16, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          We&apos;ll architect, integrate, and run the whole system — so you don&apos;t have to.
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
          <Link className="stk-btn" href={MD.ctaHref} style={{ fontSize: 16, padding: "15px 26px" }}>
            {MD.cta}
            <ArrowIcon />
          </Link>
        </div>
      </section>
      {/* footer */}
      <footer style={{ borderTop: `1px solid ${C.line}` }}>
        <div className="stk-wrap" style={{ paddingTop: 26, paddingBottom: 26, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, color: C.faint, fontSize: 13.5 }}>
          <Link href="/" className="stk-disp" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 18, fontWeight: 700, color: C.text }}>
            <MarkLogo size={20} color={C.text} accent={C.accent} />
            <span>
              {MD.brand}
              <span style={{ color: C.accent }}>.</span>
            </span>
          </Link>
          <span>
            © 2026 {MD.brandFull}. {MD.footer.address}
          </span>
        </div>
      </footer>
    </div>
  );
}
