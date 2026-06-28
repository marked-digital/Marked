# Build Brief — Marked Digital "Approach" Page (Interactive Blueprint)

**For:** Claude Code
**From:** Design/product
**Goal:** Build an *interactive*, scroll-and-touch experience for the `/approach` route where a blueprint of a growth system gets **built by the user**, not just revealed. Direct manipulation in every section. The copy below is final — use it verbatim.

---

## 0. TL;DR for Claude Code

Build a Next.js page at `/approach` with 5 sequential stages. The page's signature is a **cyanotype blueprint that accumulates** — each stage adds a layer on top of the last, and by the end the whole "building" the user assembled is on screen. The previous version only *animated on scroll*; **that's the thing to fix.** Every stage must have a genuine interaction the user performs (drag, connect, slider, click-to-place), with feedback (snap, pulse, sound-optional, counters). Scroll moves between stages; interaction happens *within* a stage.

Priorities, in order:
1. **Interactivity per stage** (the main miss in v1).
2. The cumulative "build upon itself" blueprint metaphor.
3. Polish: motion, custom cursor HUD, performance, a11y.

---

## 1. Context

- **Marked Digital** — growth partner for e-commerce brands going global (international expansion, AI-run advertising, conversion-built sites) operated as "one compounding system."
- Live site: `https://marked-digital.vercel.app/` (Next.js on Vercel). The home page already has interactive widgets — a **Growth modeler** (drag dials for ad spend/ROAS → projected revenue) and an **Expansion planner** (select markets → first-year opportunity). **Match that interaction language and quality.** This page should feel like it belongs next to those.
- Brand voice: confident, engineered, plainspoken, "no decks, no fluff."

---

## 2. Core concept

A **5-stage construction sequence**, each stage = a draftable layer on a shared blueprint:

`Foundation → Frame → Connect → Test → Replicate`

The blueprint is **persistent and cumulative**: stage 2 draws over stage 1's footings, stage 3 wires the frame from stage 2, etc. The user is the draftsman. The metaphor: *we build growth like architecture.*

What changes vs. v1: instead of layers auto-drawing as you scroll, the **user triggers each build through interaction**. Scroll advances stages once the current one is "built."

---

## 3. Recommended stack

Integrate into the existing Next.js app as a route. Use what the repo already has where possible.

- **React / Next.js** (App Router page or component, match repo convention).
- **GSAP + ScrollTrigger** — stage pinning + scrubbed transitions between stages. (Primary motion engine.)
- **Lenis** — smooth scroll, so scrubbing/pinning feels premium.
- **SVG** for all blueprint linework (crisp, themeable, drawable via `stroke-dashoffset` / `pathLength="1"`).
- **Pointer Events API** for drag/connect interactions (covers mouse + touch + pen). Add keyboard fallbacks.
- **Optional:** `react-three-fiber` + `drei` *only if* you do the isometric-frame variant in §6.2; otherwise skip WebGL. Many small particles → use a single `<canvas>` layer, not hundreds of DOM nodes.
- **No heavy UI kit.** Tokens + plain CSS/Tailwind to match the repo.

If the repo already uses Framer Motion, GSAP and Framer Motion can coexist — use GSAP/ScrollTrigger for the scroll choreography and Framer Motion for component micro-interactions, or standardize on one. Don't pull in both unless needed.

---

## 4. Design tokens (carry over from v1 — these are approved)

```css
--ink:#08131f;        /* deepest bg */
--ink-2:#0a1a2c;
--panel:#0d2138;
--grid:#11314e;       /* graph-paper lines */
--line:#3a6c95;       /* faint blueprint stroke */
--line-2:#5d93bd;     /* mid stroke */
--line-bright:#b3dbfb;/* drawn/active stroke */
--text:#e9f2fb;
--muted:#85a3bd;
--accent:#ff8a4c;     /* "live signal" — used ONLY for active/energy/interactive affordances */
--accent-soft:#ffb78c;
```

**Type:**
- Display: **Space Grotesk** (600/700)
- Body: **IBM Plex Sans** (400/500)
- Annotations / HUD / numbers: **IBM Plex Mono** (400/500) — this is the "drafting" voice; use it for coordinates, figure labels, dimension callouts, counters.

**Background:** blueprint graph-paper (two grid scales, 30px + 150px) faded top/bottom. Keep it subtle.

**Accent discipline:** `--accent` (orange) is the ONLY warm color and it means "alive / you can touch this / this is active." Don't sprinkle it. Everything cool = structure; one warm = energy.

---

## 5. Global interaction layer (applies across all stages)

These make the whole page feel like a live instrument:

1. **Draftsman cursor HUD.** Replace the cursor over the blueprint with a thin crosshair that **snaps to the grid**. A small mono readout in a corner shows live `X:### Y:### · SHEET 0n/05`. Reverts to normal cursor over text/buttons. Hide on touch devices.
2. **Cursor parallax.** Blueprint layers shift a few px against pointer movement (depth). Disable on touch + reduced-motion.
3. **Persistent build rail (01–05)** down one side: numbers fill/activate as stages complete; click a number to jump to that stage. On mobile this becomes a top progress bar.
4. **Title block** (bottom corner of the stage), styled like a real drawing set: `MARKED DIGITAL · THE APPROACH · SHEET 0n OF 05 · SCALE ∞ · REV 2026`. Sheet number updates per stage.
5. **Optional sound.** Tiny UI ticks on snap/connect/lock, muted by default, with a small speaker toggle. Tasteful, <40ms, low volume. Skip if it can't be done cleanly.
6. **Completion feedback.** When a stage's interaction goal is met, the new layer "locks in" (brief accent flash + the rail tick fills), and a subtle cue invites scrolling on.

---

## 6. Section-by-section spec

Each section: **the words are final (use verbatim)** → **the visual** → **the required interaction**. The interaction is the point. A stage isn't done until the user has actually manipulated it.

> **Hybrid flow:** Pin the stage. Scrolling into a stage draws its *base* layer; the **interactive controls then activate** and the user completes the build; when complete, scrolling advances. Allow users to skip interaction by scrolling past (auto-complete the build) so the page never traps anyone — but reward those who play.

---

### Section 1 — Setting the Foundations

**Eyebrow:** `Fig.01 · Foundation`
**Heading:** Setting the foundations
**Body:** We identify the right architecture, platforms and systems to scale your e-commerce operations — mapped to your specific requirements, never a template dropped on top of your business.
**Outputs:**
- A1 — Architecture & platform selection
- A2 — Requirements & constraints mapped
- A3 — Data & measurement groundwork

**Visual:** a survey plot — datum/baseline line, dimension callouts, corner survey crosses, empty footing slots.

**INTERACTION — "Map the requirements."**
A row of selectable **requirement chips**: `Markets`, `Catalog size`, `Channels`, `Fulfilment`, `Data/CDP`, `Headless?`. As the user toggles chips, **footings stamp onto the plot** with a snap, the plot's dimension line re-measures (numbers animate), and a "recommended architecture" label updates (e.g., selecting *Headless + 3 markets* → `ARCH: COMPOSABLE / MULTI-REGION`). This literally turns "your specific requirements" into a foundation. Keyboard: chips are buttons, tab + enter. Goal: ≥1 chip → foundation laid.

---

### Section 2 — Framing the Structure

**Eyebrow:** `Fig.02 · Framework`
**Heading:** Framing the structure
**Body:** We turn requirements into a blueprint — the data flows, automation logic and integration map the build will follow. The load-bearing decisions get made here, on paper, before a single line of it ships.
**Outputs:**
- B1 — System & data blueprint
- B2 — Automation & logic design
- B3 — Integration map across the stack

**Visual:** columns rise from the footings placed in §1; beams + a gable frame; bracing.

**INTERACTION — "Raise the frame."**
Two options, pick the one that fits effort budget:
- **6.1 (simpler, do this first):** A **drag-up gesture / vertical slider** ("schematic → structure"). Dragging raises the columns and snaps beams into place with feedback; the more requirements chosen in §1, the more bays appear. Toggle chips reveal labeled load paths (data flow arrows) along the beams.
- **6.2 (stretch):** Render the frame **isometric in react-three-fiber**; let the user **orbit ~20°** with the mouse/drag and tap beams to "lock" them. Only if time allows and it stays 60fps.

Goal: frame fully raised/locked.

---

### Section 3 — Connecting the Dots  ⭐ hero interaction

**Eyebrow:** `Fig.03 · Implementation`
**Heading:** Connecting the dots
**Body:** End-to-end implementation. We wire best-in-class platforms into one connected stack — media, AI, site and content operating as a single system, not a drawer of disconnected tools.
**Outputs:**
- C1 — End-to-end build & integration
- C2 — Media, AI, site & content unified
- C3 — One operating system, fully wired

**Visual:** platform **nodes** sit on the frame, initially unconnected. Nodes are real tools from Marked's stack: `Shopify`, `Google Ads`, `Meta`, `Klaviyo`, `AWS`, `Claude / AI`, `GA4`, `Search/SEO`. (Pull the real list from the `/stack` page if available.)

**INTERACTION — "Wire the stack." (This is the showpiece — make it great.)**
The user **drags from one node to another to draw a connection.** Valid connections **snap** with an orthogonal route (PCB-style), and a **pulse flows** along the new wire. Invalid/duplicate connections spring back. Hovering a node shows a tooltip (name + role, e.g. *"Klaviyo — lifecycle & retention"*). A counter tracks `n / N connections`. When the graph is fully wired, the center reads **"1 SYSTEM"** and all wires pulse in sync — the disconnected drawer becomes one organism.
- **Keyboard fallback (required):** click/enter node A, then node B, to connect. Don't make connection drag-only.
- **Touch:** drag works via Pointer Events; ensure large hit targets (≥44px).
- Auto-complete remaining wires if the user scrolls past.

---

### Section 4 — Pressure-Testing the System

**Eyebrow:** `Fig.04 · Validation`
**Heading:** Pressure-testing the system
**Body:** We instrument everything end-to-end, then optimize under real load — proving performance compounds before we scale it. Nothing gets handed forward until the structure holds.
**Outputs:**
- D1 — Instrumented end-to-end
- D2 — Optimized under real load
- D3 — Performance proven to compound

**Visual:** gauges/dials over the wired system; a performance curve; the wires from §3 now carry data.

**INTERACTION — "Apply load."** (Echo the home page's Growth modeler.)
Live **sliders**: `Monthly ad spend` and `Current ROAS`. As the user drags:
- gauge needles respond in real time,
- the **performance curve redraws** and the wire **pulses speed up** with load,
- a `Modeled +1.8× ROAS` style readout + `Projected annual revenue` counter animate (reuse the home page's modeling logic/numbers so they're consistent).
Add a **"Run stress test"** button that ramps load to max and shows the system holding (gauges peak, curve stays up) → triggers the "validated" lock. Goal: move a slider or run the test.

---

### Section 5 — Self-Serve Scale

**Eyebrow:** `Fig.05 · Scale`
**Heading:** Self-serve scale
**Body:** Systems built to be uncapped. Unlimited potential to enter newer markets and build forward — the structure replicates itself, so growth never means starting over from the ground.
**Outputs:**
- E1 — Uncapped, self-serve systems
- E2 — Replicable across new markets
- E3 — Built to keep building forward

**Visual:** the completed module; ghosted copies ready to tessellate; expansion arrows beyond the frame.

**INTERACTION — "Replicate across markets."** (Echo the Expansion planner.)
A compact set of market chips/mini-map: `Germany, UK, Japan, Singapore, S. Korea, Australia, UAE, Brazil, Mexico`. Selecting a market **spawns a replicated module** that tiles outward (each appears instantly — "self-serve"), and counters update: `markets`, `projected first-year opportunity $`, `regions`. The grid feels **uncapped** — keep tiling/panning as more are added, no visible ceiling. Goal: select ≥1 market; ending state shows a field of replicated systems extending past the frame.

**End of page:** roll straight into the existing CTA — *"Ready to put a mark on your market?"* → Book a strategy call. Reuse the site's CTA component.

---

## 7. The cumulative blueprint (don't lose this)

- One shared SVG coordinate space. Each stage = a `<g class="layer">`. Completed layers **stay visible and dimmed slightly**; the active layer is bright + accent-interactive.
- Drawing: `pathLength="1"` + `stroke-dasharray:1; stroke-dashoffset:1 → 0`. Fills fade in.
- The user's choices **carry forward**: footings from §1 define bays in §2; the frame in §2 hosts nodes in §3; wires in §3 carry load in §4; the whole module in §5 is what replicates. This continuity is what makes it feel built, not slideshowed.

---

## 8. Motion & feel

- Premium, weighty, **never bouncy-cute**. Eases like `cubic-bezier(.55,.1,.25,1)`. Durations 0.4–1.2s for builds, <150ms for micro-feedback.
- Snap/lock interactions get a crisp confirm (scale 1→1.04→1, accent flash). Connections get a traveling pulse.
- One orchestrated moment per stage beats lots of scattered effects.
- Respect `prefers-reduced-motion`: disable parallax, pulses, scrubbed draws → show built state instantly; interactions still work.

---

## 9. Accessibility & performance (definition of done)

- **Keyboard:** every interaction has a non-drag path (chips/buttons, click-A-then-B for wiring, sliders are native `<input type=range>`).
- **Focus visible**, logical tab order, ARIA labels on nodes/sliders/chips. Announce stage changes via an `aria-live` region.
- **Touch:** Pointer Events; 44px+ targets; no hover-only info.
- **Reduced motion** honored throughout.
- **Perf:** animate only `transform`/`opacity`; throttle pointer handlers with rAF; `will-change` sparingly; lazy-mount heavy stages; target 60fps mid-range mobile. If using canvas/WebGL, cap DPR and pause offscreen.
- **No layout thrash** from ScrollTrigger pins (use `pin: true` with proper spacing; test resize).

---

## 10. Suggested file structure

```
app/approach/page.tsx            // route, assembles stages + scroll controller
components/approach/
  BlueprintStage.tsx             // shared SVG canvas + cumulative layers + cursor HUD
  BuildRail.tsx                  // 01–05 progress + jump links
  TitleBlock.tsx
  stages/
    S1Foundation.tsx             // requirement chips → footings
    S2Frame.tsx                  // raise/lock frame (+ optional R3F variant)
    S3Connect.tsx                // drag-to-wire node graph  ⭐
    S4Test.tsx                   // load sliders + gauges + curve
    S5Scale.tsx                  // market chips → replicate
  useScrollStage.ts              // GSAP ScrollTrigger + Lenis controller
  useCursorHud.ts
lib/approach/
  model.ts                       // reuse home-page modeling math (ROAS, opportunity)
  copy.ts                        // the verbatim copy from §6, single source of truth
  tokens.css
```

Put all copy in `copy.ts` so it's never hard-coded twice.

---

## 11. Acceptance criteria

- [ ] All 5 stages present with the **exact copy** from §6.
- [ ] Each stage has a working interaction the user performs (chips / frame-raise / drag-wire / sliders / market-replicate), with snap/pulse/counter feedback.
- [ ] Blueprint is **cumulative** — earlier layers persist and earlier choices feed later stages.
- [ ] §3 drag-to-wire works on mouse, touch, AND keyboard.
- [ ] §4 sliders reuse the site's modeling numbers.
- [ ] Custom grid-snapping cursor HUD + build rail + title block.
- [ ] Scrolling past an incomplete stage auto-completes it (no traps).
- [ ] Reduced-motion, keyboard, and 60fps-mobile checks pass.
- [ ] Visually consistent with `marked-digital.vercel.app` tokens/type and the Growth modeler / Expansion planner widgets.

---

## 12. Decisions to confirm before building

1. **§2 frame:** simple drag-to-raise (6.1) or isometric R3F orbit (6.2)? Default to 6.1 unless the 3D is clearly worth it.
2. **Sound:** include the optional UI sound layer, or skip?
3. **Real platform list for §3 nodes** — pull from `/stack`, or use the working set in §6.3?
4. **§4 numbers** — point me to the existing modeler's formula/source so they match exactly.
