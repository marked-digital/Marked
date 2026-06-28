"use client";

// Marked Digital — "The Approach" interactive blueprint.
//
// One shared SVG coordinate space (1000 × 720) onto which a growth system is
// *assembled by the visitor* across five scroll stages. Each stage draws a new
// layer on top of the last, and the choices carry forward: requirement chips
// stamp footings → footings raise the frame → the frame hosts the platform
// nodes you wire → the wired system carries load you apply → the finished
// module replicates across markets. Earlier layers persist (dimmed); the active
// one is bright and interactive.
//
// Same brand system as the rest of the site — deep emerald #1FA85F as the only
// warm/"alive" colour, Plus Jakarta Sans, dark Signal canvas. No new deps: the
// scroll choreography rides the site's existing Lenis smooth scroll via plain
// scroll math, the same hand-rolled approach used elsewhere in the repo.

import React from "react";
import Link from "next/link";
import { MD, C, navHref } from "@/lib/md";
import { iconPath } from "@/lib/icons";
import { ArrowIcon, MarkLogo, useCountTo, money } from "@/components/shared";

/* ------------------------------------------------------------------ copy
   Final, verbatim from the build brief. Single source of truth. */
const STAGES = [
  {
    eyebrow: "Fig.01 · Foundation",
    heading: "Setting the foundations",
    body: "We identify the right architecture, platforms and systems to scale your e-commerce operations — mapped to your specific requirements, never a template dropped on top of your business.",
    outputs: ["Architecture & platform selection", "Requirements & constraints mapped", "Data & measurement groundwork"],
  },
  {
    eyebrow: "Fig.02 · Framework",
    heading: "Framing the structure",
    body: "We turn requirements into a blueprint — the data flows, automation logic and integration map the build will follow. The load-bearing decisions get made here, on paper, before a single line of it ships.",
    outputs: ["System & data blueprint", "Automation & logic design", "Integration map across the stack"],
  },
  {
    eyebrow: "Fig.03 · Implementation",
    heading: "Connecting the dots",
    body: "End-to-end implementation. We wire best-in-class platforms into one connected stack — media, AI, site and content operating as a single system, not a drawer of disconnected tools.",
    outputs: ["End-to-end build & integration", "Media, AI, site & content unified", "One operating system, fully wired"],
  },
  {
    eyebrow: "Fig.04 · Validation",
    heading: "Pressure-testing the system",
    body: "We instrument everything end-to-end, then optimize under real load — proving performance compounds before we scale it. Nothing gets handed forward until the structure holds.",
    outputs: ["Instrumented end-to-end", "Optimized under real load", "Performance proven to compound"],
  },
  {
    eyebrow: "Fig.05 · Scale",
    heading: "Self-serve scale",
    body: "Systems built to be uncapped. Unlimited potential to enter newer markets and build forward — the structure replicates itself, so growth never means starting over from the ground.",
    outputs: ["Uncapped, self-serve systems", "Replicable across new markets", "Built to keep building forward"],
  },
];
const N = STAGES.length;

/* ------------------------------------------------------------- geometry
   Shared blueprint coordinate space. */
const VB = { w: 1000, h: 720 };
const BASE_Y = 560; // ground / datum line
const TOP_Y = 244; // top beam
const APEX = { x: 500, y: 188 }; // roof apex
const FX = [210, 326, 442, 558, 674, 790]; // the six footing / column positions

// Requirement chips → each lights one footing, turning "your requirements"
// into the literal footprint of the build.
const REQS = ["Markets", "Catalog size", "Channels", "Fulfilment", "Data / CDP", "Headless?"];

// Stage 3 platform nodes — real tools from the Marked stack, arranged as a
// ring inside the frame. Wiring the ring closes the loop into one system.
type Node = { name: string; role: string; color: string; icon?: string; mono: string; x: number; y: number };
const RX = 200; // ring radii about the centre
const RY = 130;
const CEN = { x: 500, y: 404 };
const NODES: Node[] = [
  { name: "Shopify", role: "Storefront & checkout", color: "#95BF47", icon: "shopify", mono: "S", x: CEN.x, y: CEN.y - RY - 14 },
  { name: "Claude / AI", role: "Creative & automation", color: "#D97757", icon: "claude", mono: "C", x: CEN.x + RX, y: CEN.y - RY / 2 },
  { name: "GA4", role: "Measurement & attribution", color: "#E8710A", icon: "googleanalytics", mono: "GA", x: CEN.x + RX, y: CEN.y + RY / 2 },
  { name: "Klaviyo", role: "Lifecycle & retention", color: "#23856D", mono: "K", x: CEN.x, y: CEN.y + RY + 14 },
  { name: "Meta", role: "Paid social & retargeting", color: "#0866FF", icon: "meta", mono: "M", x: CEN.x - RX, y: CEN.y + RY / 2 },
  { name: "Google Ads", role: "Search & shopping demand", color: "#FBBC04", icon: "googleads", mono: "Ads", x: CEN.x - RX, y: CEN.y - RY / 2 },
];
// Target wiring map: the ring (adjacent neighbours) — six connections.
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
];
const NR = 31; // node radius
const ekey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
const EDGE_SET = new Set(EDGES.map(([a, b]) => ekey(a, b)));

// Stage 4 — reuse the homepage Growth modeler's math so the numbers match.
const LIFT = 1.8;

const LINE = "rgba(255,255,255,0.34)";
const LINE_DIM = "rgba(255,255,255,0.15)";
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* =============================================================== component */
export default function ApproachPage() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  // scroll-driven stage
  const [active, setActive] = React.useState(0);
  const [reached, setReached] = React.useState(0);

  // per-stage build state (persists + feeds forward)
  const [reqs, setReqs] = React.useState<Set<number>>(() => new Set([0, 1, 2, 3]));
  const [frame, setFrame] = React.useState(0); // 0..1 raise
  const [conns, setConns] = React.useState<Set<string>>(() => new Set());
  const [pending, setPending] = React.useState<number | null>(null);
  const [spend, setSpend] = React.useState(50000);
  const [roas, setRoas] = React.useState(2.0);
  const [validated, setValidated] = React.useState(false);
  const [markets, setMarkets] = React.useState<Set<number>>(() => new Set());

  // a11y: announce stage changes
  const wired = conns.size >= EDGES.length;

  /* --------------------------------------------------- scroll controller
     Active stage is derived from scroll position. As the visitor passes a
     stage we mark it "reached" (so its layer persists) and auto-complete any
     interaction they skipped — the page never traps anyone who'd rather read.
     This lives in the scroll event (not an effect) so the cumulative state is
     updated as a side-effect of the user action, not a cascading re-render. */
  const lastIdx = React.useRef(0);
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
        const idx = Math.min(N - 1, Math.floor(p * N));
        if (idx === lastIdx.current) return;
        lastIdx.current = idx;
        setActive(idx);
        setReached((r) => Math.max(r, idx));
        for (let k = 0; k < idx; k++) {
          if (k === 0) setReqs((s) => (s.size === 0 ? new Set([0, 1, 2, 3]) : s));
          if (k === 1) setFrame((f) => (f < 0.98 ? 1 : f));
          if (k === 2) setConns((s) => (s.size < EDGES.length ? new Set(EDGES.map(([a, b]) => ekey(a, b))) : s));
          if (k === 3) setValidated(true);
          if (k === 4) setMarkets((s) => (s.size === 0 ? new Set([0, 1, 2]) : s));
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const jump = (k: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const total = wrap.offsetHeight - window.innerHeight;
    const top = wrap.offsetTop + ((k + 0.5) / N) * total;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const stageDone = [reqs.size >= 1, frame >= 0.98, wired, validated, markets.size >= 1];

  /* ---------------------------------------------------------------- wiring */
  const connect = (a: number, b: number) => {
    if (a === b) return false;
    const k = ekey(a, b);
    if (!EDGE_SET.has(k) || conns.has(k)) return false;
    setConns((s) => new Set(s).add(k));
    return true;
  };
  const onNodeKeyPick = (i: number) => {
    if (pending == null) setPending(i);
    else if (pending === i) setPending(null);
    else {
      connect(pending, i);
      setPending(null);
    }
  };

  return (
    <div className="apr">
      <div className="apr-grid" aria-hidden="true" />
      <Nav />

      {/* live region for stage changes */}
      <div aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {`Stage ${active + 1} of ${N}: ${STAGES[active].heading}`}
      </div>

      {/* build rail 01–05 */}
      <nav className="apr-rail" aria-label="Approach stages">
        {STAGES.map((_, i) => (
          <button
            key={i}
            className={"apr-rail-dot" + (i === active ? " on" : "") + (reached > i && stageDone[i] ? " done" : "")}
            onClick={() => jump(i)}
            aria-label={`Go to stage ${i + 1}: ${STAGES[i].heading}`}
            aria-current={i === active ? "step" : undefined}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </nav>

      <Intro />

      {/* pinned blueprint + scroll spacers */}
      <div ref={wrapRef} className="apr-stage-wrap" style={{ height: `${N * 125}vh` }}>
        <div className="apr-sticky">
          <div className="apr-stage-grid">
            <StagePanel
              active={active}
              reqs={reqs}
              setReqs={setReqs}
              frame={frame}
              setFrame={setFrame}
              conns={conns}
              pending={pending}
              onNodeKeyPick={onNodeKeyPick}
              wired={wired}
              spend={spend}
              setSpend={setSpend}
              roas={roas}
              setRoas={setRoas}
              validated={validated}
              setValidated={setValidated}
              markets={markets}
              setMarkets={setMarkets}
            />
            <Blueprint
              active={active}
              reached={reached}
              reqs={reqs}
              frame={frame}
              conns={conns}
              pending={pending}
              setPending={setPending}
              connect={connect}
              wired={wired}
              spend={spend}
              roas={roas}
              validated={validated}
              markets={markets}
            />
          </div>
        </div>
      </div>

      <CTA />
      <Footer />
    </div>
  );
}

/* ====================================================== left: copy + controls */
function StagePanel(props: {
  active: number;
  reqs: Set<number>;
  setReqs: React.Dispatch<React.SetStateAction<Set<number>>>;
  frame: number;
  setFrame: (v: number) => void;
  conns: Set<string>;
  pending: number | null;
  onNodeKeyPick: (i: number) => void;
  wired: boolean;
  spend: number;
  setSpend: (v: number) => void;
  roas: number;
  setRoas: (v: number) => void;
  validated: boolean;
  setValidated: (v: boolean) => void;
  markets: Set<number>;
  setMarkets: React.Dispatch<React.SetStateAction<Set<number>>>;
}) {
  const { active } = props;
  const s = STAGES[active];

  return (
    <div>
      {/* key={active} remounts on each stage, replaying the fade-up animation */}
      <div className="apr-stage-copy" key={active}>
        <div className="apr-mono" style={{ fontSize: 12.5, textTransform: "uppercase", color: C.accent, marginBottom: 16 }}>
          {s.eyebrow}
        </div>
        <h2 style={{ fontSize: "clamp(30px,3.6vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.04 }}>{s.heading}</h2>
        <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.6, marginTop: 16, maxWidth: 460 }}>{s.body}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 9, margin: "22px 0 26px" }}>
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

        {/* the interaction for this stage */}
        {active === 0 && <FoundationControls {...props} />}
        {active === 1 && <FrameControls {...props} />}
        {active === 2 && <ConnectControls {...props} />}
        {active === 3 && <TestControls {...props} />}
        {active === 4 && <ScaleControls {...props} />}
      </div>
    </div>
  );
}

function CueScroll({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="apr-mono" style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 18, fontSize: 12, color: done ? C.accent : C.faint }}>
      <span style={{ width: 7, height: 7, borderRadius: 9, background: done ? C.accent : "transparent", border: done ? "none" : `1.5px solid ${C.faint}` }} />
      {done ? "LOCKED · scroll to continue ↓" : label}
    </div>
  );
}

/* --- Stage 1: requirement chips → footings */
function FoundationControls({ reqs, setReqs }: { reqs: Set<number>; setReqs: React.Dispatch<React.SetStateAction<Set<number>>> }) {
  const toggle = (i: number) =>
    setReqs((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  const arch = `${reqs.has(5) ? "COMPOSABLE" : "MONOLITH"} / ${reqs.has(0) ? "MULTI-REGION" : "SINGLE-REGION"}`;
  return (
    <div>
      <div className="apr-mono" style={{ fontSize: 12, color: C.faint, marginBottom: 11 }}>MAP THE REQUIREMENTS</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {REQS.map((r, i) => (
          <button key={r} className={"apr-chip" + (reqs.has(i) ? " on" : "")} onClick={() => toggle(i)} aria-pressed={reqs.has(i)}>
            <span style={{ width: 8, height: 8, borderRadius: 8, flex: "none", background: reqs.has(i) ? C.accent : "transparent", border: reqs.has(i) ? "none" : `1.5px solid ${C.faint}` }} />
            {r}
          </button>
        ))}
      </div>
      <div className="apr-mono" style={{ marginTop: 18, fontSize: 13, color: C.muted }}>
        ARCH:{" "}
        <span style={{ color: C.accent, fontWeight: 600 }}>{arch}</span>
        <span style={{ color: C.faint }}> · {reqs.size} FOOTING{reqs.size === 1 ? "" : "S"}</span>
      </div>
      <CueScroll done={reqs.size >= 1} label="select ≥ 1 requirement to lay the foundation" />
    </div>
  );
}

/* --- Stage 2: raise the frame */
function FrameControls({ frame, setFrame, reqs }: { frame: number; setFrame: (v: number) => void; reqs: Set<number> }) {
  return (
    <div>
      <div className="apr-mono" style={{ fontSize: 12, color: C.faint, marginBottom: 11 }}>RAISE THE FRAME — {reqs.size} BAY{reqs.size === 1 ? "" : "S"}</div>
      <input
        className="apr-range"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={frame}
        aria-label="Raise the structural frame"
        onChange={(e) => setFrame(parseFloat(e.target.value))}
        style={{ background: `linear-gradient(90deg, ${C.accent} ${frame * 100}%, rgba(255,255,255,.10) ${frame * 100}%)` }}
      />
      <div className="apr-mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: C.muted }}>
        <span>schematic</span>
        <span style={{ color: C.accent, fontWeight: 600 }}>{Math.round(frame * 100)}%</span>
        <span>structure</span>
      </div>
      <CueScroll done={frame >= 0.98} label="drag to raise columns & beams" />
    </div>
  );
}

/* --- Stage 3: wire the stack (keyboard path; drag happens on the blueprint) */
function ConnectControls({ conns, pending, onNodeKeyPick, wired }: { conns: Set<string>; pending: number | null; onNodeKeyPick: (i: number) => void; wired: boolean }) {
  return (
    <div>
      <div className="apr-mono" style={{ fontSize: 12, color: C.faint, marginBottom: 11 }}>
        WIRE THE STACK · <span style={{ color: wired ? C.accent : C.muted }}>{conns.size} / {EDGES.length}</span>
      </div>
      <p style={{ color: C.faint, fontSize: 13, margin: "0 0 12px", maxWidth: 380 }}>
        Drag node-to-node on the blueprint — or pick two below to connect them.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {NODES.map((n, i) => (
          <button key={n.name} className={"apr-nodebtn" + (pending === i ? " pending" : "")} onClick={() => onNodeKeyPick(i)} aria-label={`${n.name} — ${n.role}`}>
            <span style={{ width: 9, height: 9, borderRadius: 9, flex: "none", background: n.color }} />
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.name}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{n.role}</span>
            </span>
          </button>
        ))}
      </div>
      <CueScroll done={wired} label="connect every node into one system" />
    </div>
  );
}

/* --- Stage 4: apply load (reuses the homepage Growth modeler math) */
function TestControls(props: { spend: number; setSpend: (v: number) => void; roas: number; setRoas: (v: number) => void; validated: boolean; setValidated: (v: boolean) => void }) {
  const { spend, setSpend, roas, setRoas, validated, setValidated } = props;
  const marked = spend * 12 * (roas + LIFT);
  const shown = useCountTo(marked);
  const spendPct = ((spend - 5000) / (500000 - 5000)) * 100;
  const roasPct = ((roas - 1) / (5 - 1)) * 100;
  const stress = () => {
    setSpend(500000);
    setRoas(5);
    setValidated(true);
  };
  return (
    <div>
      <LoadSlider label="Monthly ad spend" display={money(spend)} min={5000} max={500000} step={5000} val={spend} pct={spendPct} onChange={setSpend} />
      <LoadSlider label="Current ROAS" display={roas.toFixed(1) + "×"} min={1} max={5} step={0.1} val={roas} pct={roasPct} onChange={setRoas} />
      <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Modeled annual revenue · +{LIFT.toFixed(1)}× ROAS</div>
      <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, color: C.accent }}>{money(shown)}</div>
      <button
        className="apr-chip"
        onClick={stress}
        style={{ marginTop: 18, background: validated ? "rgba(31,168,95,.12)" : "transparent", borderColor: validated ? C.accent : undefined, color: validated ? C.text : undefined }}
      >
        {validated ? "✓ Validated — structure holds" : "Run stress test →"}
      </button>
      <CueScroll done={validated} label="apply load or run the stress test" />
    </div>
  );
}
function LoadSlider({ label, display, min, max, step, val, pct, onChange }: { label: string; display: string; min: number; max: number; step: number; val: number; pct: number; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ color: C.muted, fontSize: 14 }}>{label}</span>
        <span style={{ fontSize: 19, fontWeight: 700, color: C.accent }}>{display}</span>
      </div>
      <input className="apr-range" type="range" min={min} max={max} step={step} value={val} aria-label={label} onChange={(e) => onChange(parseFloat(e.target.value))} style={{ background: `linear-gradient(90deg, ${C.accent} ${pct}%, rgba(255,255,255,.10) ${pct}%)` }} />
    </div>
  );
}

/* --- Stage 5: replicate across markets (reuses Expansion planner data) */
function ScaleControls({ markets, setMarkets }: { markets: Set<number>; setMarkets: React.Dispatch<React.SetStateAction<Set<number>>> }) {
  const data = MD.marketData;
  const toggle = (i: number) =>
    setMarkets((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  const chosen = data.filter((_, i) => markets.has(i));
  const opp = chosen.reduce((a, m) => a + m.opp, 0) * 1e6;
  const regions = new Set(chosen.map((m) => m.region)).size;
  const oppShown = useCountTo(opp);
  return (
    <div>
      <div className="apr-mono" style={{ fontSize: 12, color: C.faint, marginBottom: 11 }}>REPLICATE ACROSS MARKETS</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, maxWidth: 460 }}>
        {data.map((m, i) => (
          <button key={m.country} className={"apr-chip" + (markets.has(i) ? " on" : "")} onClick={() => toggle(i)} aria-pressed={markets.has(i)} style={{ fontSize: 12.5, padding: "7px 12px" }}>
            {m.city}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 26, marginTop: 22 }}>
        <Stat value={String(markets.size)} label="markets" />
        <Stat value={money(oppShown)} label="first-year opp." accent />
        <Stat value={String(regions)} label="regions" />
      </div>
      <CueScroll done={markets.size >= 1} label="select markets to replicate the system" />
    </div>
  );
}
function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: accent ? C.accent : C.text }}>{value}</div>
      <div style={{ color: C.muted, fontSize: 12.5, marginTop: 3 }}>{label}</div>
    </div>
  );
}

/* ====================================================== right: the blueprint */
function Blueprint(props: {
  active: number;
  reached: number;
  reqs: Set<number>;
  frame: number;
  conns: Set<string>;
  pending: number | null;
  setPending: (v: number | null) => void;
  connect: (a: number, b: number) => boolean;
  wired: boolean;
  spend: number;
  roas: number;
  validated: boolean;
  markets: Set<number>;
}) {
  const { active, reached, reqs, frame, conns, pending, setPending, connect, wired, spend, roas, validated, markets } = props;
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const canvasRef = React.useRef<HTMLDivElement | null>(null);

  // drafting cursor HUD
  const [hud, setHud] = React.useState<{ on: boolean; px: number; py: number; vx: number; vy: number }>({ on: false, px: 0, py: 0, vx: 0, vy: 0 });
  const coarse = React.useRef(false);
  React.useEffect(() => {
    coarse.current = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  }, []);

  // client → viewBox coords
  const toVB = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const loc = pt.matrixTransform(ctm.inverse());
    return { x: loc.x, y: loc.y };
  };

  // wiring drag
  const [drag, setDrag] = React.useState<{ from: number; x: number; y: number } | null>(null);
  const onPointerDownNode = (i: number) => (e: React.PointerEvent) => {
    if (active !== 2) return;
    e.preventDefault();
    const v = toVB(e.clientX, e.clientY);
    setDrag({ from: i, x: v.x, y: v.y });
    setPending(i);
  };
  const onCanvasMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && !coarse.current) {
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const snap = 22;
      const v = toVB(e.clientX, e.clientY);
      setHud({ on: true, px: Math.round(px / snap) * snap, py: Math.round(py / snap) * snap, vx: Math.round(v.x / 10) * 10, vy: Math.round(v.y / 10) * 10 });
    }
    if (drag) {
      const v = toVB(e.clientX, e.clientY);
      setDrag({ ...drag, x: v.x, y: v.y });
    }
  };
  const onCanvasUp = (e: React.PointerEvent) => {
    if (!drag) return;
    const v = toVB(e.clientX, e.clientY);
    let hit = -1;
    let best = 44 * 44;
    NODES.forEach((n, i) => {
      const d = (n.x - v.x) ** 2 + (n.y - v.y) ** 2;
      if (d < best && i !== drag.from) {
        best = d;
        hit = i;
      }
    });
    if (hit >= 0) connect(drag.from, hit);
    setDrag(null);
    setPending(null);
  };

  const show = (k: number) => reached >= k; // cumulative
  const layerStyle = (k: number): React.CSSProperties => ({
    opacity: show(k) ? (active === k ? 1 : 0.45) : 0,
    transition: "opacity .6s cubic-bezier(.2,.7,.3,1)",
  });

  const presentFX = FX.filter((_, i) => reqs.has(i));
  const minFX = presentFX.length ? Math.min(...presentFX) : FX[0];
  const maxFX = presentFX.length ? Math.max(...presentFX) : FX[FX.length - 1];

  // stage-4 derived
  const load = clamp((spend / 500000) * 0.5 + ((roas - 1) / 4) * 0.5, 0, 1);
  const flowDur = (2.8 - load * 1.9).toFixed(2) + "s";

  return (
    <div className="apr-blueprint">
      <div
        ref={canvasRef}
        className="apr-bp-canvas"
        onPointerMove={onCanvasMove}
        onPointerUp={onCanvasUp}
        onPointerLeave={() => {
          setHud((h) => ({ ...h, on: false }));
          if (drag) {
            setDrag(null);
            setPending(null);
          }
        }}
      >
        <svg ref={svgRef} viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Cumulative growth-system blueprint">
          {/* ---- Layer 1 · Foundation: datum line + footings ---- */}
          <g style={layerStyle(0)}>
            <DrawLine x1={150} y1={BASE_Y} x2={850} y2={BASE_Y} stroke={active === 0 ? C.accent : LINE} draw={show(0)} />
            {/* dimension callout */}
            <g className="apr-mono" fill={C.faint} fontSize={13}>
              <line x1={minFX} y1={BASE_Y + 26} x2={maxFX} y2={BASE_Y + 26} stroke={LINE_DIM} />
              <line x1={minFX} y1={BASE_Y + 20} x2={minFX} y2={BASE_Y + 32} stroke={LINE_DIM} />
              <line x1={maxFX} y1={BASE_Y + 20} x2={maxFX} y2={BASE_Y + 32} stroke={LINE_DIM} />
              <text x={(minFX + maxFX) / 2} y={BASE_Y + 46} textAnchor="middle">
                {Math.round((maxFX - minFX) * 1.2 + 600)} SQ·M
              </text>
            </g>
            {/* survey crosses */}
            {[150, 850].map((x) => (
              <g key={x} stroke={LINE_DIM}>
                <line x1={x - 7} y1={BASE_Y} x2={x + 7} y2={BASE_Y} />
                <line x1={x} y1={BASE_Y - 7} x2={x} y2={BASE_Y + 7} />
              </g>
            ))}
            {/* footing slots */}
            {FX.map((x, i) => {
              const on = reqs.has(i);
              return (
                <g key={x} style={{ transition: "opacity .4s", opacity: on ? 1 : 0.25 }}>
                  <rect x={x - 24} y={BASE_Y - 10} width={48} height={20} rx={3} fill={on ? "rgba(31,168,95,.14)" : "transparent"} stroke={on ? C.accent : LINE_DIM} strokeWidth={1.4} />
                  {on && <rect x={x - 4} y={BASE_Y - 4} width={8} height={8} fill={C.accent} />}
                </g>
              );
            })}
          </g>

          {/* ---- Layer 2 · Frame: columns, beam, roof ---- */}
          <g style={layerStyle(1)}>
            {FX.map((x, i) =>
              reqs.has(i) ? (
                <g key={x} style={{ transform: `scaleY(${frame})`, transformOrigin: `${x}px ${BASE_Y}px`, transformBox: "fill-box", transition: "transform .8s cubic-bezier(.55,.1,.25,1)" }}>
                  <line x1={x} y1={TOP_Y} x2={x} y2={BASE_Y} stroke={active === 1 ? C.accent : LINE} strokeWidth={2} />
                </g>
              ) : null
            )}
            {/* top beam + roof appear once mostly raised */}
            <g style={{ opacity: frame > 0.6 ? 1 : 0, transition: "opacity .5s" }}>
              <line x1={minFX} y1={TOP_Y} x2={maxFX} y2={TOP_Y} stroke={active === 1 ? C.accent : LINE} strokeWidth={2} />
              <line x1={minFX} y1={TOP_Y} x2={APEX.x} y2={APEX.y} stroke={active === 1 ? C.accent : LINE} strokeWidth={2} />
              <line x1={APEX.x} y1={APEX.y} x2={maxFX} y2={TOP_Y} stroke={active === 1 ? C.accent : LINE} strokeWidth={2} />
              {/* a diagonal brace in the first bay — load-bearing detail */}
              {presentFX.length > 1 && <line x1={presentFX[0]} y1={BASE_Y} x2={presentFX[1]} y2={TOP_Y} stroke={LINE_DIM} strokeWidth={1.2} strokeDasharray="5 5" />}
            </g>
          </g>

          {/* ---- Layer 3 · Connect: nodes + wires + core ---- */}
          <g style={layerStyle(2)}>
            {/* drawn wires */}
            {EDGES.map(([a, b]) => {
              const k = ekey(a, b);
              if (!conns.has(k)) return null;
              const A = NODES[a];
              const B = NODES[b];
              return (
                <g key={k}>
                  <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={C.accent} strokeWidth={2.2} opacity={0.85} />
                  <line className="apr-pulse" x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={C.accentHover} strokeWidth={2.6} strokeLinecap="round" style={{ ["--flow" as string]: wired ? flowDur : "2.4s" }} />
                </g>
              );
            })}
            {/* live drag wire */}
            {drag && <line x1={NODES[drag.from].x} y1={NODES[drag.from].y} x2={drag.x} y2={drag.y} stroke={C.accent} strokeWidth={2} strokeDasharray="6 6" opacity={0.7} />}

            {/* core badge once wired */}
            <g style={{ opacity: wired ? 1 : 0, transition: "opacity .6s" }}>
              <circle cx={CEN.x} cy={CEN.y} r={34} fill="rgba(31,168,95,.12)" stroke={C.accent} />
              <text x={CEN.x} y={CEN.y + 4} textAnchor="middle" className="apr-mono" fill={C.accent} fontSize={14} fontWeight={700}>
                1 SYSTEM
              </text>
            </g>

            {/* nodes */}
            {NODES.map((n, i) => {
              const path = iconPath(n.icon);
              const lit = pending === i || conns.has(ekey(i, (i + 1) % NODES.length)) || conns.has(ekey(i, (i + 5) % NODES.length));
              return (
                <g
                  key={n.name}
                  onPointerDown={onPointerDownNode(i)}
                  style={{ cursor: active === 2 ? "grab" : "default", transition: "transform .2s" }}
                >
                  <circle cx={n.x} cy={n.y} r={NR} fill="#141614" stroke={pending === i ? C.accent : lit ? "rgba(31,168,95,.6)" : LINE} strokeWidth={pending === i ? 2.4 : 1.6} />
                  {/* generous invisible hit target */}
                  <circle cx={n.x} cy={n.y} r={44} fill="transparent" />
                  {path ? (
                    <g transform={`translate(${n.x - 13},${n.y - 13}) scale(1.083)`} fill={n.color}>
                      <path d={path} />
                    </g>
                  ) : (
                    <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle" fill={n.color} fontWeight={800} fontSize={n.mono.length >= 2 ? 16 : 22}>
                      {n.mono}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* ---- Layer 4 · Validation: gauges + performance curve ---- */}
          <g style={layerStyle(3)}>
            <Gauge cx={320} cy={250} frac={clamp((spend - 5000) / (500000 - 5000), 0, 1)} label="LOAD" />
            <Gauge cx={680} cy={250} frac={clamp((roas - 1) / 4, 0, 1)} label="ROAS" />
            {/* compounding performance curve across the interior */}
            <path
              d={`M 260 ${520} C 420 ${520 - load * 40}, 560 ${500 - load * 150}, 740 ${480 - load * 230}`}
              fill="none"
              stroke={C.accent}
              strokeWidth={2.4}
              style={{ transition: "d .5s" }}
              strokeLinecap="round"
            />
            <text x={744} y={480 - load * 230 - 12} className="apr-mono" fill={validated ? C.accent : C.muted} fontSize={13} textAnchor="end">
              {validated ? "✓ HOLDS UNDER LOAD" : "PERF ↑"}
            </text>
          </g>

          {/* ---- Layer 5 · Scale: replicated ghost modules ---- */}
          <g style={layerStyle(4)}>
            {Array.from(markets).map((m, idx) => {
              // tile the finished module outward to the right & down — uncapped
              const col = idx % 3;
              const row = Math.floor(idx / 3);
              const tx = 560 + col * 150 - row * 40;
              const ty = -40 + row * 120;
              const op = clamp(0.5 - row * 0.12, 0.16, 0.5);
              return (
                <g key={m} transform={`translate(${tx},${ty}) scale(0.26)`} style={{ opacity: op }}>
                  <GhostModule />
                </g>
              );
            })}
            {markets.size > 0 && (
              <>
                <line x1={840} y1={400} x2={930} y2={400} stroke={C.accent} strokeWidth={2} markerEnd="url(#arr)" />
                <text x={930} y={384} className="apr-mono" fill={C.accent} fontSize={13} textAnchor="end">
                  +{markets.size} MARKET{markets.size === 1 ? "" : "S"}
                </text>
              </>
            )}
            <defs>
              <marker id="arr" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={C.accent} />
              </marker>
            </defs>
          </g>
        </svg>

        {/* drafting HUD overlay */}
        {hud.on && active >= 0 && (
          <>
            <div className="apr-cross-v" style={{ left: hud.px }} />
            <div className="apr-cross-h" style={{ top: hud.py }} />
            <div className="apr-cross-dot" style={{ left: hud.px, top: hud.py }} />
            <div className="apr-hud-read" style={{ left: 8, top: 8 }}>
              X:{String(hud.vx).padStart(4, "0")} Y:{String(hud.vy).padStart(4, "0")} · SHEET {String(active + 1).padStart(2, "0")}/0{N}
            </div>
          </>
        )}

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

// A stroke that "draws" itself via stroke-dashoffset when `draw` flips true.
function DrawLine({ x1, y1, x2, y2, stroke, draw }: { x1: number; y1: number; x2: number; y2: number; stroke: string; draw: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={draw ? 0 : 1} className="apr-draw" />;
}

// A semicircular drafting gauge whose needle + arc track a 0..1 value.
function Gauge({ cx, cy, frac, label }: { cx: number; cy: number; frac: number; label: string }) {
  const r = 52;
  const f = clamp(frac, 0, 1);
  const theta = Math.PI - f * Math.PI; // 180°(0) → 0°(1)
  const nx = cx + r * 0.82 * Math.cos(theta);
  const ny = cy - r * 0.82 * Math.sin(theta);
  const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  return (
    <g>
      <path d={arc} fill="none" stroke={LINE_DIM} strokeWidth={3} />
      <path d={arc} fill="none" stroke={C.accent} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - f} style={{ transition: "stroke-dashoffset .4s" }} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={C.accentHover} strokeWidth={2.4} strokeLinecap="round" style={{ transition: "all .35s" }} />
      <circle cx={cx} cy={cy} r={4} fill={C.accent} />
      <text x={cx} y={cy + 22} textAnchor="middle" className="apr-mono" fill={C.muted} fontSize={12}>
        {label}
      </text>
    </g>
  );
}

// A tiny silhouette of the finished module, reused for the replicated copies.
function GhostModule() {
  return (
    <g stroke={C.accent} strokeWidth={4} fill="none">
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
      <div className="sg-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 84 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>
          <MarkLogo size={26} color={C.text} accent={C.accent} />
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
        <button className="sg-btn sg-btn--p" style={{ padding: "11px 20px", fontSize: 15 }}>
          {MD.cta}
        </button>
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
        Not a campaign that ends — a system that compounds. Scroll to assemble it, layer by layer: foundation, frame, wiring, load test, and a structure that replicates itself across every market you enter.
      </p>
      <div className="apr-mono" style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 34, color: C.faint, fontSize: 13 }}>
        <span style={{ width: 7, height: 7, borderRadius: 9, background: C.accent }} />
        Drag · connect · model — the blueprint is yours to draw ↓
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
    <footer style={{ borderTop: `1px solid ${C.line}`, position: "relative", zIndex: 2 }}>
      <div className="apr-wrap" style={{ paddingTop: 30, paddingBottom: 30, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: C.faint, fontSize: 13.5 }}>
        <span>© 2026 {MD.brandFull}. {f.address}.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
