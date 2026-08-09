# Build Brief — Homepage "Selected Work" Stacked Cards

**For:** Claude Code
**Goal:** Replace the homepage section that says **"Trusted by brands scaling across 47 markets"** (the placeholder logo strip: NORTHWIND / Lumen / VELA / Halcyon / MERIDIAN / Kit&Co) with a **scroll-stacking case-study card section**, recreating the effect from skona.ca's homepage (Salient theme "Nectar Post Grid — stacked / blurred_scale"). Rebuild it natively in React — do NOT port their markup.

---

## 1. The effect, decoded (reference behavior)

From skona.ca's rendered output:

- Single column of full-bleed cards: **height 80vh, border-radius 25px, 40px gap**.
- Every card is `position: sticky; top: 40px`. Because later cards come later in the document, each new card **scrolls up and over** the pinned one — the stack happens in pure CSS.
- As card *i+1* covers card *i*, card *i* animates **linearly with coverage**:
  - `scale: 1 → 0.8`
  - `filter: blur(0px) → blur(5px)`
  - (Verified from their mid-scroll inline styles: a ~28%-covered card sits at `scale(0.944) blur(1.38px)`.)
- The last card never gets covered → never scales/blurs.
- Card anatomy: background image + dark overlay (`#141414` @ 0.3), huge centered display title, small pill tag chips, whole card is a link.
- Hover: a cursor-following pill tooltip reading "View" (blurred backdrop, white text).

## 2. Placement

- **Remove:** the "Trusted by brands scaling across 47 markets" heading + the placeholder brand-name strip on the homepage (it sits right after the hero/stats).
- **Insert:** this section in its place. It *is* the social proof now — work, not logos.
- Everything above and below stays untouched.

## 3. Section copy (placeholder-quality — Mark will refine)

- **Eyebrow (mono, small caps):** `SELECTED WORK · 47 MARKETS`
- **Heading:** `Proof, in any market.`
- Optional one-liner under heading: `Brands we've taken global — and the systems underneath them.`

## 4. Card data — 4 temporary placeholders

Use the brand names already on the site so nothing else needs renaming. Put this in a data array (e.g. `lib/work.ts`) so real case studies swap in cleanly later.

| # | Title | Tags (pills) | Metric | Href |
|---|-------|--------------|--------|------|
| 1 | NORTHWIND | DACH launch · Paid media · Localization | +212% ROAS | /work/northwind |
| 2 | LUMEN | UK → APAC · AI marketing · CRO | 3.1× revenue | /work/lumen |
| 3 | VELA | LATAM entry · Storefront build · Logistics | 7-week launch | /work/vela |
| 4 | HALCYON | MENA · Lifecycle & retention · Paid + organic | +168% AOV | /work/halcyon |

**Card backgrounds (temporary):** no stock photos. Use per-card CSS gradients in the site's palette (distinct navy tints, one card may carry a subtle accent glow) + the existing faint blueprint grid texture at low opacity. Looks intentional, zero assets, swaps for real 1920×1080 case photography later. Keep the 0.3 dark overlay layer in the DOM so photo swap is a one-line change.

## 5. Reference implementation

Adapt naming/tokens to the repo's conventions. Dependency-free (rAF + sticky). GSAP/ScrollTrigger can replace the scroll math later when the Approach page lands — same visual result; don't add GSAP just for this.

```tsx
// components/home/StackedWork.tsx
"use client";
import { useEffect, useRef } from "react";
import styles from "./StackedWork.module.css";
import { WORK } from "@/lib/work";

const STICKY_TOP = 88;        // px — header height + breathing room. MUST match CSS.
const MAX_BLUR_DESKTOP = 5;   // px
const MAX_BLUR_MOBILE = 0;    // blur on 80vh layers janks low-end phones — scale only

export default function StackedWork() {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // cards still stack via sticky; no scale/blur

    const maxBlur = window.matchMedia("(max-width: 768px)").matches
      ? MAX_BLUR_MOBILE
      : MAX_BLUR_DESKTOP;

    let raf = 0;
    const update = () => {
      const cards = refs.current;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const next = cards[i + 1];
        if (!card) continue;
        if (!next) { card.style.transform = ""; card.style.filter = ""; continue; }
        const h = card.offsetHeight;
        // next card's top travels from (STICKY_TOP + h) down to STICKY_TOP as it covers this card
        const p = Math.min(1, Math.max(0, (STICKY_TOP + h - next.getBoundingClientRect().top) / h));
        card.style.transform = `scale(${1 - p * 0.2})`;                    // 1 → 0.8
        card.style.filter = maxBlur ? `blur(${(p * maxBlur).toFixed(2)}px)` : "";
      }
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.section} aria-label="Selected work">
      {/* eyebrow + heading here, matching homepage section header pattern */}
      <div className={styles.stack}>
        {WORK.map((item, i) => (
          <a
            key={item.title}
            href={item.href}
            className={styles.card}
            ref={(el) => { refs.current[i] = el; }}
            style={{ background: item.bg }}
          >
            <div className={styles.overlay} />
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <div className={styles.meta}>
                {item.tags.map((t) => <span key={t} className={styles.pill}>{t}</span>)}
                <span className={styles.metric}>{item.metric}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

```css
/* StackedWork.module.css — pull colors/fonts from the site's existing tokens */
.stack {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.card {
  position: sticky;
  top: 88px;                    /* MUST match STICKY_TOP in the component */
  height: 80vh;
  border-radius: 25px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  will-change: transform, filter;
  text-decoration: none;
}
.overlay { position: absolute; inset: 0; background: #141414; opacity: 0.3; }
.content { position: relative; text-align: center; padding: 0 24px; }
.title {
  /* skona: 12vw capped at 220px — tune to the site's display face */
  font-size: clamp(48px, 11vw, 180px);
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 20px;
}
.meta { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; align-items: center; }
.pill {
  font-size: 13px;
  padding: 7px 14px;
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 999px;
}
.metric { /* accent-colored, mono, slightly separated — the payoff number */ }

@media (max-width: 768px) {
  .stack { gap: 20px; }
  .card { height: 72vh; top: 76px; border-radius: 16px; }  /* keep JS constant in sync if changed responsively */
}
```

**Sync warning:** `STICKY_TOP` in JS and `top` in CSS must match, including the mobile override — either read the value from `getComputedStyle(card).top` on init, or keep them manually aligned.

## 6. Optional polish (only if quick)

- **Cursor "View →" pill** on card hover: fixed-position element tracking the pointer inside the card, `backdrop-filter: blur(6px)`, small white mono text on `rgba(0,0,0,0.25)`. Hide on touch devices. This is skona's `data-indicator` tooltip.
- Card entrance: subtle fade/rise on first reveal. Skip anything springy.

## 7. Definition of done

- [ ] Logo-strip section fully removed; this section renders in its place, visually consistent with adjacent homepage sections (same container width, section spacing, heading pattern).
- [ ] 4 cards stack on scroll; covered cards scale to 0.8 and blur to 5px linearly (desktop); last card unaffected.
- [ ] Works on touch; no blur on mobile; 60fps scroll (only `transform`/`filter` animate; rAF-throttled).
- [ ] Cards are real links with visible keyboard focus; whole card tabbable; `prefers-reduced-motion` → static stacked cards, no scale/blur.
- [ ] Card data lives in one data file for easy swap to real case studies.
- [ ] No layout shift under the sticky header; cards never tuck under it (sticky offset clears header height).
