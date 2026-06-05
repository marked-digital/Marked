"use client";

// Interactive modules for the homepage — Growth calculator + Expansion Planner.
// Ported from the Claude Design handoff (interactive.jsx), baked to the
// final Signal theme (deep emerald, Plus Jakarta, radius 16).

import React from "react";
import { MD, C } from "@/lib/md";
import { money, useCountTo, hexToRgba } from "@/components/shared";

const TRACK = "rgba(255,255,255,.10)";

function Heading({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, color: C.accent }}>{kicker}</div>
      <h2 style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.05 }}>{title}</h2>
      <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.55, marginTop: 14, maxWidth: 560 }}>{sub}</p>
    </div>
  );
}

/* ----------------------------------------------------- GROWTH CALCULATOR */

function Slider({
  label,
  val,
  display,
  min,
  max,
  step,
  pct,
  onChange,
}: {
  label: string;
  val: number;
  display: string;
  min: number;
  max: number;
  step: number;
  pct: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <span style={{ color: C.muted, fontSize: 14.5 }}>{label}</span>
        <span style={{ fontSize: 22, fontWeight: 700, color: C.accent }}>{display}</span>
      </div>
      <input
        type="range"
        className="sg-range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ background: `linear-gradient(90deg, ${C.accent} ${pct}%, ${TRACK} ${pct}%)` }}
      />
    </div>
  );
}

export function GrowthCalc() {
  const [spend, setSpend] = React.useState(50000);
  const [roas, setRoas] = React.useState(2.0);
  const LIFT = 1.8; // modeled additional ROAS points with Marked
  const today = spend * 12 * roas;
  const marked = spend * 12 * (roas + LIFT);
  const added = marked - today;
  const shown = useCountTo(marked);
  const addedShown = useCountTo(added);
  const todayW = Math.max(8, (today / marked) * 100);
  const spendPct = ((spend - 5000) / (500000 - 5000)) * 100;
  const roasPct = ((roas - 1) / (5 - 1)) * 100;

  const bars: [string, number, number, string][] = [
    ["Today", today, todayW, C.faint],
    ["With Marked", marked, 100, C.accent],
  ];

  return (
    <>
      <Heading
        kicker="Growth modeler"
        title="See what compounding looks like."
        sub="Drag the dials. We model the lift our clients see when media, AI, and site work as one system."
      />
      <div className="sg-calc-grid" style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: 44 }}>
        <div>
          <Slider label="Monthly ad spend" val={spend} display={money(spend)} min={5000} max={500000} step={5000} pct={spendPct} onChange={setSpend} />
          <Slider label="Current ROAS" val={roas} display={roas.toFixed(1) + "×"} min={1} max={5} step={0.1} pct={roasPct} onChange={setRoas} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "9px 15px", borderRadius: 999, background: "rgba(255,255,255,.05)", border: `1px solid ${C.line}`, marginTop: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 8, background: C.accent }}></span>
            <span style={{ color: C.muted, fontSize: 13 }}>Modeled +{LIFT.toFixed(1)}× ROAS · client avg.</span>
          </div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 14, marginBottom: 6 }}>Projected annual revenue with Marked</div>
          <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: C.accent }}>{money(shown)}</div>
          <div style={{ marginTop: 30 }}>
            {bars.map(([lab, v, w, col]) => (
              <div key={lab} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: C.muted, marginBottom: 7 }}>
                  <span>{lab}</span>
                  <span style={{ color: C.text }}>{money(v)}</span>
                </div>
                <div style={{ height: 12, borderRadius: 8, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
                  <div className="sg-bar" style={{ width: w + "%", height: "100%", background: col, borderRadius: 8 }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: C.text }}>+{money(addedShown)}</span>
            <span style={{ color: C.muted, fontSize: 14 }}>added revenue per year</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ----------------------------------------------------- EXPANSION PLANNER */

function StatTile({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "16px 18px", background: "rgba(255,255,255,.025)" }}>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: C.text }}>{value}</div>
      <div style={{ color: C.muted, fontSize: 12.5, marginTop: 4 }}>{label}</div>
    </div>
  );
}

export function ExpansionPlanner() {
  const data = MD.marketData;
  const [sel, setSel] = React.useState<Set<number>>(() => new Set([0, 1, 2]));
  const soft = hexToRgba(C.accent, 0.12);
  const toggle = (i: number) => {
    setSel((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  };
  const chosen = data.filter((_, i) => sel.has(i));
  const totalOppRaw = chosen.reduce((a, m) => a + m.opp, 0);
  const totalOpp = totalOppRaw * 1e6;
  const avgWeeks = chosen.length ? Math.round(chosen.reduce((a, m) => a + m.weeks, 0) / chosen.length) : 0;
  const regions = new Set(chosen.map((m) => m.region)).size;
  const oppShown = useCountTo(totalOpp);
  const sorted = [...chosen].sort((a, b) => b.opp - a.opp);

  return (
    <>
      <Heading
        kicker="Expansion planner"
        title="Map your next market."
        sub="Select the markets you're eyeing. We size the first-year opportunity and the path in — instantly."
      />
      <div className="sg-plan-grid" style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: 40 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>
            {sel.size} of {data.length} markets selected
          </div>
          <div className="sg-mkt-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {data.map((m, i) => {
              const on = sel.has(i);
              return (
                <button
                  key={m.country}
                  onClick={() => toggle(i)}
                  className="sg-chip"
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: 12,
                    padding: "13px 15px",
                    border: `1px solid ${on ? C.accent : C.line}`,
                    background: on ? soft : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                  }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: 9, flex: "none", background: on ? C.accent : "transparent", border: on ? "none" : `1.5px solid ${C.faint}` }}></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.country}</span>
                    <span style={{ fontSize: 11.5, color: C.muted }}>
                      {m.region} · ${m.opp}M
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 14, marginBottom: 6 }}>Projected first-year opportunity</div>
          <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: C.accent }}>{money(oppShown)}</div>
          <div style={{ display: "flex", gap: 3, height: 12, marginTop: 24, marginBottom: 10 }}>
            {sorted.length ? (
              sorted.map((m, i) => (
                <div
                  key={m.country}
                  title={m.country}
                  className="sg-bar"
                  style={{
                    width: (m.opp / totalOppRaw) * 100 + "%",
                    height: "100%",
                    background: hexToRgba(C.accent, Math.max(0.3, 0.95 - i * 0.12)),
                    borderRadius: 4,
                  }}
                ></div>
              ))
            ) : (
              <div style={{ width: "100%", background: "rgba(255,255,255,.06)", borderRadius: 4 }}></div>
            )}
          </div>
          <div style={{ color: C.faint, fontSize: 12.5, marginBottom: 24 }}>Opportunity weighting by market</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <StatTile value={sel.size} label="markets" />
            <StatTile value={avgWeeks ? avgWeeks + " wks" : "—"} label="avg. launch" />
            <StatTile value={regions} label="regions" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
            {["Localized storefronts", "Local paid media", "Cross-border logistics"].map((t) => (
              <span key={t} style={{ fontSize: 12.5, color: C.muted, padding: "7px 12px", borderRadius: 999, border: `1px solid ${C.line}` }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
