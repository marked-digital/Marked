"use client";

// Marked Digital — "The Approach" drawing set.
//
// One shared SVG sheet (1000 × 720) onto which a growth system draws itself
// across five pinned scroll stages: footings → frame → wiring → load test →
// replication. Earlier layers persist (dimmed); the active one is bright.
//
// Scroll position is the only input. Nothing here is clicked, dragged, toggled
// or "completed" by the visitor — the drawing is a drawing, not a toy.
//
// How the motion works: the scroll listener writes one custom property per
// stage onto the page root (--s0…--s4, each ramping 0→1 as that stage passes),
// and every stroke on the sheet derives its own draw-in from those via CSS
// calc(). React re-renders only when the *integer* stage changes — for the
// copy, the rail and the sheet number — so the whole sheet animates without a
// single per-frame React render.
//
// Same brand system as the rest of the site: deep emerald #1FA85F as the only
// warm/"alive" colour, Plus Jakarta Sans, dark Signal canvas, no new deps.

import React from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { MD, C, navHref } from "@/lib/md";
import { iconPath } from "@/lib/icons";
import { ArrowIcon, MarkLogo } from "@/components/shared";

/* ------------------------------------------------------------------ copy
   Single source of truth for the five sheets. `spec` is the small drafting
   readout under each stage's outputs — a fixed schedule of values, not a
   control panel. */
const STAGES = [
  {
    eyebrow: "Fig.01 · Foundation",
    heading: "Setting the foundations",
    body: "First we work out what you actually need to scale: the platform, the architecture, and the systems that have to talk to each other. That comes from your catalogue, your markets and your fulfilment setup, not from whatever we built for the last client.",
    outputs: ["Platform and architecture selected", "Requirements and constraints mapped", "Measurement and data groundwork"],
    spec: [
      ["Datum", "Established"],
      ["Footings", "06"],
      ["Architecture", "Composable"],
    ],
  },
  {
    eyebrow: "Fig.02 · Framework",
    heading: "Framing the structure",
    body: "Requirements become a blueprint: the data flows, the automation logic, and how each platform connects to the rest. We make the load-bearing decisions here, on paper, while they're still cheap to change.",
    outputs: ["System and data blueprint", "Automation and workflow logic", "Integration map across the stack"],
    spec: [
      ["Bays", "05"],
      ["Load path", "Resolved"],
      ["Blueprint", "Signed off"],
    ],
  },
  {
    eyebrow: "Fig.03 · Implementation",
    heading: "Connecting the dots",
    body: "Then we build it. Media, AI, site and content get wired into one stack that shares the same data, instead of six tools that each know part of the story.",
    outputs: ["Full build and integration", "One shared data layer", "One operating system, fully wired"],
    spec: [
      ["Platforms", "06"],
      ["Connections", "06"],
      ["Systems", "01"],
    ],
  },
  {
    eyebrow: "Fig.04 · Validation",
    heading: "Pressure-testing the system",
    body: "We instrument everything before we scale anything. Then it runs under real spend, we find where it bends, and we fix that first. Performance has to hold up under load, not in a slide.",
    outputs: ["Instrumented end to end", "Tuned under real spend", "Results that hold over time"],
    spec: [
      ["Load applied", "100%"],
      ["ROAS lift", "+1.8×"],
      ["Structure", "Holds"],
    ],
  },
  {
    eyebrow: "Fig.05 · Scale",
    heading: "Self-serve scale",
    body: "The point of building it this way is that you can do it again. New market, new channel, same structure. You're not rebuilding from the ground every time you expand, and you're not waiting on us to do it.",
    outputs: ["Systems you can run yourself", "Repeatable in a new market", "No rebuild required to expand"],
    spec: [
      ["Markets", "Uncapped"],
      ["Replication", "Self-serve"],
      ["Scale", "∞"],
    ],
  },
];
const N = STAGES.length;

// Fraction of each stage's scroll spent drawing. The remainder is a hold, so a
// finished layer sits still and readable before the next one starts.
const DRAW = 0.7;

/* ------------------------------------------------------------- geometry
   Shared sheet coordinate space. The bands are laid out so the five layers
   nest instead of colliding: replication along the top, load onto the roof,
   the frame and its wiring in the middle, the datum and its dimension below. */
const VB = { w: 1000, h: 720 };
const BASE_Y = 560; // datum / ground line
const TOP_Y = 244; // top beam
const APEX = { x: 500, y: 188 }; // roof apex
const FX = [210, 326, 442, 558, 674, 790]; // the six footing / column positions
const SPAN_L = FX[0];
const SPAN_R = FX[FX.length - 1];

// Stage 3 platform nodes — the real Marked stack, arranged as a ring inside the
// frame. The ring closing is what turns six tools into one system.
type Node = { name: string; color: string; icon?: string; mono: string; x: number; y: number };
const CEN = { x: 500, y: 400 };
const RX = 155;
const RY = 100;
const NODES: Node[] = [
  { name: "Shopify", color: "#95BF47", icon: "shopify", mono: "S", x: CEN.x, y: CEN.y - RY },
  { name: "Claude / AI", color: "#D97757", icon: "claude", mono: "C", x: CEN.x + RX, y: CEN.y - RY / 2 },
  { name: "GA4", color: "#E8710A", icon: "googleanalytics", mono: "GA", x: CEN.x + RX, y: CEN.y + RY / 2 },
  { name: "Klaviyo", color: "#23856D", mono: "K", x: CEN.x, y: CEN.y + RY },
  { name: "Meta", color: "#0866FF", icon: "meta", mono: "M", x: CEN.x - RX, y: CEN.y + RY / 2 },
  { name: "Google Ads", color: "#FBBC04", icon: "googleads", mono: "Ads", x: CEN.x - RX, y: CEN.y - RY / 2 },
];
// The ring: each node to its neighbour, six connections, loop closed.
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
];
const NR = 31; // node radius

// Stage 5 — the replicated copies, on their own datum above the sheet. Each is
// 80 wide at the scale they're drawn, and GhostModule's ground sits 64 below
// its origin, so GHOST_Y is where all three land.
const GHOST_X = [300, 460, 620];
const GHOST_Y = 104;

// Stage 4 — the load arrows that press down onto the roof.
const LOAD_X = [300, 400, 500, 600, 700];
// Height of the roof slope at a given x, so each arrow stops just short of it.
const roofY = (x: number) => TOP_Y - (TOP_Y - APEX.y) * (1 - Math.abs(x - APEX.x) / (APEX.x - SPAN_L));

const LINE = "rgba(255,255,255,0.34)";
const LINE_DIM = "rgba(255,255,255,0.15)";
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* ---------------------------------------------------------------- CSS ramps
   `ramp(2, .35, .85)` reads "0 → 1 across the 35–85% slice of stage 3", as a
   CSS expression off that stage's progress property. Feed it to opacity, to a
   scale factor, to a rotation, or through `undrawn()` to a stroke-dashoffset
   on a pathLength={1} stroke to make a line draw itself. */
const ramp = (stage: number, a: number, b: number) => `clamp(0, calc((var(--s${stage}) - ${a}) / ${+(b - a).toFixed(4)}), 1)`;
// The dash offset that leaves a pathLength={1} stroke undrawn until its slice.
// Multiplied out to a length: CSS rejects a bare calc() number for a property
// that wants <length>, and 1px is one user unit inside the viewBox.
const undrawn = (stage: number, a: number, b: number) => `calc((1 - ${ramp(stage, a, b)}) * 1px)`;
// The i-th of n items drawing in sequence across [a,b], each over `span`.
const slice = (i: number, n: number, a: number, b: number, span = 0.18) => {
  const start = n > 1 ? a + ((b - a - span) * i) / (n - 1) : a;
  return [start, start + span] as const;
};

/* =============================================================== component */
export default function ApproachPage() {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState(0);

  /* --------------------------------------------------- scroll controller
     Writes --s0…--s4 on the root every animation frame the page moves, and
     lifts the integer stage into React state only when it actually changes.
     Under prefers-reduced-motion the stages snap to drawn/undrawn instead of
     ramping, so the sheet is always complete rather than mid-stroke. */
  React.useEffect(() => {
    const root = rootRef.current;
    const wrap = wrapRef.current;
    if (!root || !wrap) return;
    const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastIdx = -1;
    const apply = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
      const scaled = p * N;
      const idx = Math.min(N - 1, Math.floor(scaled));
      for (let i = 0; i < N; i++) {
        const v = still ? (i <= idx ? 1 : 0) : clamp((scaled - i) / DRAW, 0, 1);
        root.style.setProperty(`--s${i}`, v.toFixed(4));
      }
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Land mid-stage so the layer is drawn and holding, not caught mid-stroke.
  // The jump has to go through Lenis: it owns the document scroll position and
  // its rAF loop overwrites a native smooth scrollTo mid-animation, which is
  // why the rail used to look inert on click.
  const lenis = useLenis();
  const jump = (k: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const total = wrap.offsetHeight - window.innerHeight;
    const top = wrap.offsetTop + ((k + DRAW + (1 - DRAW) / 2) / N) * total;
    if (lenis) lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="apr" ref={rootRef}>
      <div className="apr-grid" aria-hidden="true" />
      <Nav />

      {/* live region for stage changes */}
      <div aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {`Sheet ${active + 1} of ${N}: ${STAGES[active].heading}`}
      </div>

      {/* sheet rail 01–05 — position, progress, and a jump for each stage */}
      <nav className="apr-rail" aria-label="Approach stages">
        {STAGES.map((s, i) => (
          <button
            key={i}
            className={"apr-rail-dot" + (i === active ? " on" : "") + (i < active ? " done" : "")}
            style={{ ["--sc" as string]: `var(--s${i})` } as React.CSSProperties}
            onClick={() => jump(i)}
            aria-label={`Go to sheet ${i + 1}: ${s.heading}`}
            aria-current={i === active ? "step" : undefined}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </nav>

      <Intro />

      {/* pinned sheet + scroll spacers */}
      <div ref={wrapRef} className="apr-stage-wrap" style={{ height: `${N * 120}vh` }}>
        <div className="apr-sticky">
          <div className="apr-stage-grid">
            <StagePanel active={active} />
            <Blueprint active={active} />
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </div>
  );
}

/* ====================================================== left: the stage copy */
function StagePanel({ active }: { active: number }) {
  const s = STAGES[active];
  return (
    <div>
      {/* key={active} remounts on each stage, replaying the fade-up */}
      <div className="apr-stage-copy" key={active}>
        <div className="apr-mono" style={{ fontSize: 12.5, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
          {s.eyebrow}
        </div>
        <h2 style={{ fontSize: "clamp(30px,3.6vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.04 }}>{s.heading}</h2>
        <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.6, marginTop: 16, maxWidth: 460 }}>{s.body}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 22 }}>
          {s.outputs.map((o, i) => (
            <div key={o} className="apr-out">
              <span className="apr-mono" style={{ color: C.faint, fontSize: 12.5, marginTop: 1, flex: "none" }}>
                {String.fromCharCode(65 + active)}
                {i + 1}
              </span>
              <span>{o}</span>
            </div>
          ))}
        </div>

        {/* drafting schedule for this sheet — fixed values, nothing to operate */}
        <div className="apr-spec">
          {s.spec.map(([k, v]) => (
            <div key={k}>
              <div className="apr-mono" style={{ fontSize: 11, textTransform: "uppercase", color: C.faint, marginBottom: 5 }}>
                {k}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====================================================== right: the sheet */
function Blueprint({ active }: { active: number }) {
  // Layers persist once passed and dim behind the live one; scrolling back up
  // takes them off again, so what you see always matches where you are.
  const layer = (k: number): React.CSSProperties => ({
    opacity: active >= k ? (active === k ? 1 : 0.42) : 0,
    transition: "opacity .6s cubic-bezier(.2,.7,.3,1)",
  });
  const live = (k: number) => (active === k ? C.accent : LINE);

  return (
    <div className="apr-blueprint">
      <div className="apr-bp-canvas">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Blueprint of the Marked Digital growth system, drawn in five layers: foundation, frame, wiring, load test and replication.">
          {/* ---- Layer 1 · Foundation: datum, survey marks, footings ---- */}
          <g style={layer(0)}>
            <Stroke x1={150} y1={BASE_Y} x2={850} y2={BASE_Y} stroke={live(0)} width={2} draw={[0, 0, 0.45]} />
            {[150, 850].map((x) => (
              <g key={x} stroke={LINE_DIM} style={{ opacity: ramp(0, 0.35, 0.5) }}>
                <line x1={x - 7} y1={BASE_Y} x2={x + 7} y2={BASE_Y} />
                <line x1={x} y1={BASE_Y - 7} x2={x} y2={BASE_Y + 7} />
              </g>
            ))}
            {FX.map((x, i) => {
              const [a, b] = slice(i, FX.length, 0.42, 0.95, 0.16);
              return (
                <g key={x} style={{ opacity: ramp(0, a, b) }}>
                  <rect x={x - 24} y={BASE_Y - 10} width={48} height={20} rx={3} fill="rgba(31,168,95,.14)" stroke={C.accent} strokeWidth={1.4} />
                  <rect x={x - 4} y={BASE_Y - 4} width={8} height={8} fill={C.accent} />
                </g>
              );
            })}
            {/* span dimension below the datum */}
            <g className="apr-mono" fill={C.faint} fontSize={13} style={{ opacity: ramp(0, 0.8, 1) }}>
              <line x1={SPAN_L} y1={BASE_Y + 18} x2={SPAN_R} y2={BASE_Y + 18} stroke={LINE_DIM} />
              <line x1={SPAN_L} y1={BASE_Y + 12} x2={SPAN_L} y2={BASE_Y + 24} stroke={LINE_DIM} />
              <line x1={SPAN_R} y1={BASE_Y + 12} x2={SPAN_R} y2={BASE_Y + 24} stroke={LINE_DIM} />
              <text x={(SPAN_L + SPAN_R) / 2} y={BASE_Y + 38} textAnchor="middle">
                SPAN {SPAN_R - SPAN_L}
              </text>
            </g>
          </g>

          {/* ---- Layer 2 · Framework: columns rise, then beam and roof ---- */}
          <g style={layer(1)}>
            {FX.map((x, i) => {
              const [a, b] = slice(i, FX.length, 0, 0.6, 0.26);
              return (
                <g key={x} style={{ transform: `scaleY(${ramp(1, a, b)})`, transformOrigin: `${x}px ${BASE_Y}px` }}>
                  <line x1={x} y1={TOP_Y} x2={x} y2={BASE_Y} stroke={live(1)} strokeWidth={2} />
                </g>
              );
            })}
            <Stroke x1={SPAN_L} y1={TOP_Y} x2={SPAN_R} y2={TOP_Y} stroke={live(1)} width={2} draw={[1, 0.52, 0.76]} />
            <Stroke x1={SPAN_L} y1={TOP_Y} x2={APEX.x} y2={APEX.y} stroke={live(1)} width={2} draw={[1, 0.72, 0.92]} />
            <Stroke x1={SPAN_R} y1={TOP_Y} x2={APEX.x} y2={APEX.y} stroke={live(1)} width={2} draw={[1, 0.72, 0.92]} />
            {/* a diagonal brace in the first bay — the load-bearing detail */}
            <line x1={FX[0]} y1={BASE_Y} x2={FX[1]} y2={TOP_Y} stroke={LINE_DIM} strokeWidth={1.2} strokeDasharray="5 5" style={{ opacity: ramp(1, 0.88, 1) }} />
          </g>

          {/* ---- Layer 3 · Implementation: nodes, then the ring closes ---- */}
          <g style={layer(2)}>
            {EDGES.map(([a, b], i) => {
              const A = NODES[a];
              const B = NODES[b];
              const [f, t] = slice(i, EDGES.length, 0.34, 0.88, 0.2);
              return (
                <g key={`${a}-${b}`}>
                  <Stroke x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={C.accent} width={2.2} opacity={0.85} draw={[2, f, t]} />
                  <line className="apr-pulse" x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={C.accentHover} strokeWidth={2.6} strokeLinecap="round" style={{ opacity: ramp(2, t, 1) }} />
                </g>
              );
            })}

            {/* the whole point of the layer: six tools reading as one system */}
            <g style={{ opacity: ramp(2, 0.88, 1) }}>
              <circle cx={CEN.x} cy={CEN.y} r={38} fill="rgba(31,168,95,.12)" stroke={C.accent} />
              <text x={CEN.x} y={CEN.y - 1} textAnchor="middle" className="apr-mono" fill={C.accent} fontSize={13} fontWeight={700}>
                1
              </text>
              <text x={CEN.x} y={CEN.y + 14} textAnchor="middle" className="apr-mono" fill={C.accent} fontSize={13} fontWeight={700}>
                SYSTEM
              </text>
            </g>

            {NODES.map((n, i) => {
              const path = iconPath(n.icon);
              const [a, b] = slice(i, NODES.length, 0, 0.38, 0.16);
              return (
                <g key={n.name} style={{ opacity: ramp(2, a, b) }}>
                  <circle cx={n.x} cy={n.y} r={NR} fill="#141614" stroke="rgba(31,168,95,.55)" strokeWidth={1.6} />
                  {path ? (
                    <g transform={`translate(${n.x - 13},${n.y - 13}) scale(1.083)`} fill={n.color}>
                      <path d={path} />
                    </g>
                  ) : (
                    <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fill={n.color} fontWeight={800} fontSize={n.mono.length >= 2 ? 16 : 22}>
                      {n.mono}
                    </text>
                  )}
                  {/* Side nodes label outboard of the ring; the ring's own
                      vertical wires run straight through where a label
                      underneath them would sit. */}
                  <text
                    x={n.x === CEN.x ? n.x : n.x + (n.x > CEN.x ? NR + 11 : -NR - 11)}
                    y={n.x === CEN.x ? n.y + NR + 17 : n.y + 4}
                    textAnchor={n.x === CEN.x ? "middle" : n.x > CEN.x ? "start" : "end"}
                    className="apr-mono"
                    fill={C.muted}
                    fontSize={13}
                  >
                    {n.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ---- Layer 4 · Validation: load onto the roof, gauges sweep ---- */}
          <g style={layer(3)}>
            {LOAD_X.map((x, i) => {
              const [a, b] = slice(i, LOAD_X.length, 0.12, 0.62, 0.2);
              const yTo = roofY(x) - 9;
              return (
                <g key={x} style={{ opacity: ramp(3, a, b) }}>
                  <Stroke x1={x} y1={yTo - 54} x2={x} y2={yTo} stroke={C.accent} width={1.8} draw={[3, a, b]} />
                  <path d={`M ${x - 5} ${yTo - 9} L ${x} ${yTo} L ${x + 5} ${yTo - 9}`} fill="none" stroke={C.accent} strokeWidth={1.8} strokeLinecap="round" />
                </g>
              );
            })}
            <Gauge cx={104} cy={300} to={1} label="Load" read="100%" from={0.05} until={0.6} />
            <Gauge cx={896} cy={300} to={0.72} label="ROAS lift" read="+1.8×" from={0.05} until={0.6} />
            <text x={APEX.x} y={230} textAnchor="middle" className="apr-mono" fill={C.accent} fontSize={13} style={{ opacity: ramp(3, 0.74, 0.94) }}>
              HOLDS UNDER LOAD
            </text>
          </g>

          {/* ---- Layer 5 · Scale: the finished module, repeating ---- */}
          <g style={layer(4)}>
            {/* A shared datum under the copies, running off to the right: the
                same structure on the same ground, not three loose objects. */}
            <line x1={GHOST_X[0] - 10} y1={GHOST_Y} x2={GHOST_X[2] + 90} y2={GHOST_Y} stroke={LINE_DIM} strokeWidth={1.4} strokeDasharray="7 7" style={{ opacity: ramp(4, 0, 0.3) }} />
            {GHOST_X.map((tx, i) => {
              const [a, b] = slice(i, GHOST_X.length, 0.05, 0.72, 0.24);
              return (
                <g key={tx} style={{ opacity: `calc(${ramp(4, a, b)} * ${(0.62 - i * 0.14).toFixed(2)})` }}>
                  <g transform={`translate(${tx},${GHOST_Y - 64}) scale(0.2)`}>
                    <GhostModule />
                  </g>
                </g>
              );
            })}
            <g style={{ opacity: ramp(4, 0.74, 1) }}>
              <Stroke x1={GHOST_X[2] + 95} y1={GHOST_Y} x2={838} y2={GHOST_Y} stroke={C.accent} width={2} draw={[4, 0.74, 0.95]} />
              <path d={`M 832 ${GHOST_Y - 6} L 845 ${GHOST_Y} L 832 ${GHOST_Y + 6}`} fill={C.accent} />
              <text x={845} y={GHOST_Y - 16} className="apr-mono" fill={C.accent} fontSize={13} textAnchor="end">
                UNCAPPED
              </text>
            </g>
          </g>
        </svg>

        {/* title block */}
        <div className="apr-titleblock">
          <span>MARKED DIGITAL</span>
          <span>THE APPROACH</span>
          <span>SHEET {String(active + 1).padStart(2, "0")} OF 0{N}</span>
          <span>SCALE ∞</span>
          <span>REV 2026</span>
        </div>
      </div>
    </div>
  );
}

/* A stroke that draws itself across a slice of a stage's scroll progress.
   pathLength={1} normalises the dash to the line's own length, so one ramp
   expression works for every stroke on the sheet regardless of geometry. */
function Stroke({ x1, y1, x2, y2, stroke, width = 2, opacity, draw }: { x1: number; y1: number; x2: number; y2: number; stroke: string; width?: number; opacity?: number; draw: readonly [number, number, number] }) {
  const [stage, a, b] = draw;
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={width}
      opacity={opacity}
      pathLength={1}
      strokeDasharray={1}
      style={{ strokeDashoffset: undrawn(stage, a, b) }}
    />
  );
}

/* A semicircular drafting gauge whose arc and needle sweep to a fixed reading
   as stage 4 draws. `to` is the target fraction, `read` the value it lands on. */
function Gauge({ cx, cy, to, label, read, from, until }: { cx: number; cy: number; to: number; label: string; read: string; from: number; until: number }) {
  const r = 52;
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const sweep = `calc(${ramp(3, from, until)} * ${to})`;
  return (
    <g>
      <path d={arc} fill="none" stroke={LINE_DIM} strokeWidth={3} />
      <path d={arc} fill="none" stroke={C.accent} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: `calc((1 - ${sweep}) * 1px)` }} />
      {/* Needle rests pointing left at 0 and sweeps to the right. Positive
          rotation is clockwise in SVG's y-down space, which takes a leftward
          vector up and over — under the arc, not below the gauge. */}
      <g style={{ transform: `rotate(calc(${sweep} * 180deg))`, transformOrigin: `${cx}px ${cy}px` }}>
        <line x1={cx} y1={cy} x2={cx - r * 0.82} y2={cy} stroke={C.accentHover} strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <circle cx={cx} cy={cy} r={4} fill={C.accent} />
      <text x={cx} y={cy + 22} textAnchor="middle" className="apr-mono" fill={C.muted} fontSize={12} style={{ textTransform: "uppercase" }}>
        {label}
      </text>
      <text x={cx} y={cy + 44} textAnchor="middle" className="apr-mono" fill={C.accent} fontSize={16} fontWeight={700} style={{ opacity: ramp(3, until, until + 0.15) }}>
        {read}
      </text>
    </g>
  );
}

// A silhouette of the finished module, reused for the replicated copies.
function GhostModule() {
  return (
    <g stroke={C.accent} strokeWidth={6} fill="none">
      <line x1={0} y1={320} x2={400} y2={320} />
      {[40, 160, 280, 360].map((x) => (
        <line key={x} x1={x} y1={120} x2={x} y2={320} />
      ))}
      <line x1={40} y1={120} x2={360} y2={120} />
      <line x1={40} y1={120} x2={200} y2={40} />
      <line x1={200} y1={40} x2={360} y2={120} />
      <circle cx={200} cy={220} r={26} fill="rgba(31,168,95,.18)" />
    </g>
  );
}

/* =================================================== shared chrome (nav/cta/footer)
   Re-built compact with the site's classes so the page sits cleanly next to the
   homepage without refactoring the existing single-file home component. */
function Nav() {
  return (
    <header className="mk-topbar">
      <div className="sg-wrap mk-topbar-inner">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 700, letterSpacing: "-0.03em" }}>
          <MarkLogo size={22} color={C.text} accent={C.accent} />
          <span>
            {MD.brand}
            <span style={{ color: C.accent }}>.</span>
          </span>
        </Link>
        <nav className="sg-nav-links">
          {MD.nav.map((n) => (
            <Link key={n} className="sg-navlink" href={navHref(n)} style={n === "Approach" ? { color: C.text } : undefined}>
              {n}
            </Link>
          ))}
          <Link className="sg-navlink" href="/stack">
            Stack
          </Link>
        </nav>
        <Link className="sg-btn sg-btn--p" href={MD.ctaHref} style={{ padding: "9px 17px", fontSize: 14 }}>
          {MD.cta}
        </Link>
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section className="apr-wrap" style={{ paddingTop: 92, paddingBottom: 40, position: "relative", zIndex: 2 }}>
      <div className="apr-mono" style={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: C.accent, marginBottom: 20 }}>
        The Approach · Drawing set 01–05
      </div>
      <h1 style={{ fontSize: "clamp(40px,6.4vw,80px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.98, margin: 0, maxWidth: 900 }}>
        We build growth
        <br />
        <span style={{ color: C.muted }}>like architecture.</span>
      </h1>
      <p style={{ color: C.muted, fontSize: 19, lineHeight: 1.55, maxWidth: 560, marginTop: 28 }}>
        Campaigns stop when the budget stops. A system keeps working. Five sheets, in the order we build them: foundation, frame, wiring, load test, and a structure that goes up again in the next market.
      </p>
      <div className="apr-mono" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 34, color: C.faint, fontSize: 13 }}>
        <span style={{ width: 7, height: 7, borderRadius: 9, background: C.accent }} />
        Scroll to draw the set ↓
      </div>
    </section>
  );
}

function CTA() {
  const c = MD.ctaBand;
  return (
    <section className="apr-wrap" style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center", position: "relative", zIndex: 2 }}>
      <div className="apr-mono" style={{ color: C.accent, fontSize: 13, letterSpacing: "0.06em", fontWeight: 600, marginBottom: 22, textTransform: "uppercase" }}>{c.kicker}</div>
      <h2 style={{ fontSize: "clamp(40px,5.4vw,68px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.0, margin: 0 }}>
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
    <footer style={{ borderTop: `1px solid ${C.line}`, position: "relative", zIndex: 2 }}>
      <div className="apr-wrap" style={{ paddingTop: 30, paddingBottom: 30, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: C.faint, fontSize: 13.5 }}>
        <span>© 2026 {MD.brandFull}. {f.address}.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
