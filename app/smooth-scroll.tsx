"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

// Universal smooth scrolling (Lenis). `root` attaches Lenis to the
// document scroller so the whole site — every page under the layout —
// inherits the eased scroll. The rAF loop and cleanup are handled by
// the ReactLenis component.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Lenis has no reduced-motion handling of its own. Resolved in an effect
  // rather than at render so the server and first client pass agree; the
  // options object is compared by value inside ReactLenis, so flipping this
  // rebuilds the instance once, before any wheel input lands.
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        // lerp only — never alongside `duration`. Lenis treats them as
        // mutually exclusive and duration wins (Animate.advance), so setting
        // both silently discards the lerp and turns every wheel tick into a
        // fixed 1.2s eased run to target, which reads as lag. Damping is
        // frame-rate independent, so 0.1 holds on 60Hz and 120Hz alike.
        lerp: 0.1,
        smoothWheel: !reduceMotion,
        // Inertia carrying across a route change leaves the next page
        // drifting on arrival. Internal links cancel it.
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
