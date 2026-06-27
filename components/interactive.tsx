"use client";

// Interactive modules for the homepage — Growth calculator + Expansion Planner.
// Ported from the Claude Design handoff (interactive.jsx), baked to the
// final Signal theme (deep emerald, Plus Jakarta, radius 16).

import React from "react";
import { MD, C, STACK_TOOLS } from "@/lib/md";
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

/* ------------------------------------ EMBEDDED WORKFLOW (platform physics field)
   A canvas "ball pit": every platform from the Tech Stack page (STACK_TOOLS)
   becomes a chip that falls under gravity, collides, and scatters away from the
   cursor — so the visual stays in sync with the stack data. */

type Chip = {
  mono: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export function WorkflowField() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fontFamily =
      getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";

    let W = 0;
    let H = 0;
    const chips: Chip[] = [];
    const mouse = { x: 0, y: 0, on: false };

    const measure = () => {
      const rect = wrap.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      // Radius scales to the available area so all platforms fit and settle.
      const r = Math.max(19, Math.min(27, Math.sqrt((W * H) / (STACK_TOOLS.length * 7.2))));
      chips.length = 0;
      STACK_TOOLS.forEach((t, i) => {
        const span = Math.max(1, W - 2 * r);
        const vspan = Math.max(1, H - 2 * r);
        chips.push({
          mono: t.mono,
          color: t.color,
          r,
          // Scatter across the field; a gentle pull to center then packs
          // them into a floating cluster (collisions keep them apart).
          x: reduce ? r + ((i * 97 + 31) % span) : r + Math.random() * span,
          y: reduce ? r + ((i * 53 + 19) % vspan) : r + Math.random() * vspan,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      });
    };

    const ATTRACT = 0.014; // pull toward center
    const DAMP = 0.86; // velocity damping (settles the cluster)
    const PUSH = 12; // cursor repel strength

    const clampWalls = (c: Chip) => {
      if (c.x < c.r) c.x = c.r;
      else if (c.x > W - c.r) c.x = W - c.r;
      if (c.y < c.r) c.y = c.r;
      else if (c.y > H - c.r) c.y = H - c.r;
    };

    const step = () => {
      const cx = W / 2;
      const cy = H / 2;
      for (const c of chips) {
        c.vx += (cx - c.x) * ATTRACT;
        c.vy += (cy - c.y) * ATTRACT;
        if (mouse.on) {
          const dx = c.x - mouse.x;
          const dy = c.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          const R = 130;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * PUSH;
            c.vx += (dx / d) * f;
            c.vy += (dy / d) * f;
          }
        }
        c.vx *= DAMP;
        c.vy *= DAMP;
        c.x += c.vx;
        c.y += c.vy;
      }
      // chip-chip collisions + wall constraints (relaxation passes)
      for (let pass = 0; pass < 6; pass++) {
        for (let i = 0; i < chips.length; i++) {
          for (let j = i + 1; j < chips.length; j++) {
            const a = chips[i];
            const b = chips[j];
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let d2 = dx * dx + dy * dy;
            const min = a.r + b.r;
            if (d2 < min * min) {
              // Break exact overlap so a normal direction always exists.
              if (d2 < 0.0001) {
                dx = (Math.random() - 0.5) * 0.5;
                dy = (Math.random() - 0.5) * 0.5;
                d2 = dx * dx + dy * dy;
              }
              const d = Math.sqrt(d2);
              const overlap = (min - d) / 2;
              const nx = dx / d;
              const ny = dy / d;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;
            }
          }
        }
        for (const c of chips) clampWalls(c);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const c of chips) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = "#141614"; // opaque base so overlaps stay readable
        ctx.fill();
        ctx.fillStyle = hexToRgba(c.color, 0.2);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = hexToRgba(c.color, 0.55);
        ctx.stroke();
        const fs = c.mono.length >= 3 ? c.r * 0.6 : c.mono.length === 2 ? c.r * 0.78 : c.r;
        ctx.font = `800 ${fs}px ${fontFamily}`;
        ctx.fillStyle = c.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.mono, c.x, c.y + 1);
      }
    };

    measure();
    build();

    let raf = 0;
    let running = false;
    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduce) {
      // Settle a static arrangement once; no animation.
      for (let k = 0; k < 260; k++) step();
      draw();
    }

    // Only animate while the field is on-screen.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const ro = new ResizeObserver(() => {
      measure();
      for (const c of chips) {
        c.x = Math.min(Math.max(c.r, c.x), W - c.r);
        c.y = Math.min(Math.max(c.r, c.y), H - c.r);
      }
      if (reduce) draw();
    });
    ro.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.on = true;
    };
    const onLeave = () => {
      mouse.on = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="sg-embed-canvas">
      <canvas ref={canvasRef} />
    </div>
  );
}
