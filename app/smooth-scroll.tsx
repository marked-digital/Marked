"use client";

import { ReactLenis } from "lenis/react";

// Universal smooth scrolling (Lenis). `root` attaches Lenis to the
// document scroller so the whole site — every page under the layout —
// inherits the eased scroll. The rAF loop and cleanup are handled by
// the ReactLenis component.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
