"use client";

// Branded interstitial for the booking CTA. Every "Book a strategy call"
// button on the site is a plain <Link href="/book">; this component, mounted
// once in the root layout, intercepts those clicks at the document level,
// sweeps a near-black curtain up over the page while the mark draws itself
// and the tagline fades in, navigates underneath the cover, then lifts the
// curtain off the booking page.
//
// Ordinary navigation is untouched: modified clicks (new tab), middle
// clicks, reduced-motion users, and clicks while already on /book all fall
// through to the default <Link> behaviour. Styles live in the
// "booking transition" section of marked.css (.bkt-).

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { C, MD } from "@/lib/md";

// cover: curtain sweeps up — the page is fully hidden when it ends
// (hold):  logo + tagline sit on black while /book commits underneath
// reveal: curtain lifts away, exposing the booking page
const COVER_MS = 480;
const HOLD_MS = 900;
const REVEAL_MS = 560;
// If the route never commits (offline, error boundary), lift the curtain
// rather than trapping the user behind a black screen.
const FAILSAFE_MS = 4000;

type Phase = "idle" | "cover" | "reveal";

export default function BookTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = React.useState<Phase>("idle");

  // Mirrors for the click handler, which is bound once.
  const phaseRef = React.useRef(phase);
  const pathnameRef = React.useRef(pathname);
  React.useEffect(() => {
    phaseRef.current = phase;
    pathnameRef.current = pathname;
  }, [phase, pathname]);
  // Set once the covered navigation lands on /book, so the arrival effect
  // and the failsafe can't both schedule the reveal.
  const arrivedRef = React.useRef(false);

  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = React.useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  React.useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  // Intercept /book clicks. Capture phase on the document so this runs ahead
  // of Next's own Link handler (attached at the React root); stopPropagation
  // keeps that handler from also starting the navigation.
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || url.pathname !== MD.ctaHref) return;
      // Reduced motion: skip the interstitial entirely — plain navigation.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Already on /book (the nav's self-link): nothing to transition to.
      if (pathnameRef.current === MD.ctaHref) return;

      e.preventDefault();
      e.stopPropagation();
      if (phaseRef.current !== "idle") return; // a run is already in flight

      arrivedRef.current = false;
      setPhase("cover");
      // Push once the curtain has the page hidden; the route change (and its
      // scroll-to-top) happens out of sight. The CTA <Link>s have already
      // prefetched /book, so the commit is effectively instant.
      later(() => router.push(MD.ctaHref), COVER_MS);
      later(() => {
        if (phaseRef.current === "cover" && !arrivedRef.current) {
          arrivedRef.current = true;
          setPhase("reveal");
          later(() => setPhase("idle"), REVEAL_MS);
        }
      }, FAILSAFE_MS);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, later]);

  // The covered navigation has landed: hold the lockup a beat, then lift.
  React.useEffect(() => {
    if (phase !== "cover" || pathname !== MD.ctaHref || arrivedRef.current) return;
    arrivedRef.current = true;
    later(() => setPhase("reveal"), HOLD_MS);
    later(() => setPhase("idle"), HOLD_MS + REVEAL_MS);
  }, [phase, pathname, later]);

  if (phase === "idle") return null;

  return (
    <div className={`bkt bkt--${phase}`} aria-hidden="true">
      <div className="bkt-inner">
        <div className="bkt-brand">
          {/* MarkLogo (components/shared.tsx) redrawn with pathLength=1 on the
              strokes so the M can draw itself via dashoffset. */}
          <svg className="bkt-logo" viewBox="0 0 32 32" fill="none">
            <rect className="bkt-logo-frame" x="1.2" y="1.2" width="29.6" height="29.6" rx="7" stroke={C.text} strokeWidth="1.6" />
            <path className="bkt-logo-m" d="M8 22V10l8 8 8-8v12" pathLength={1} stroke={C.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle className="bkt-logo-dot" cx="16" cy="24.5" r="1.7" fill={C.accent} />
          </svg>
          <span className="bkt-word">
            {MD.brand}
            <span style={{ color: C.accent }}>.</span>
          </span>
        </div>
        <div className="bkt-tag">
          {MD.hero.h1[0]} <span style={{ color: C.accent }}>{MD.hero.h1[1]}</span>
        </div>
      </div>
    </div>
  );
}
