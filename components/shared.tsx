"use client";

// Shared hooks + visual bits for the Marked Digital pages.
// Ported from the Claude Design handoff (shared.jsx), minus the
// design-tool preview/env workarounds.

import React from "react";
import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import landTopo from "world-atlas/land-110m.json";

/* ------------------------------------------------------------- HOOKS */

export function useInView<T extends HTMLElement = HTMLSpanElement>(opts?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = React.useRef<T | null>(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: opts?.threshold ?? 0.25, rootMargin: opts?.rootMargin ?? "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, seen] as const;
}

// Reveal-on-mount: flips data-animate on after mount so the CSS
// `.reveal` transitions run once, with a timeout fallback.
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = React.useRef<T | null>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      if (ref.current) ref.current.setAttribute("data-animate", "on");
    });
    const t = setTimeout(() => {
      if (ref.current) ref.current.setAttribute("data-animate", "on");
    }, 700);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, []);
  return ref;
}

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength = 0.28) {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const leave = () => {
      el.style.transform = "translate(0,0)";
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return ref;
}

export function useCountTo(value: number, duration = 650) {
  const [n, setN] = React.useState(value);
  const cur = React.useRef(value);
  React.useEffect(() => {
    const from = cur.current,
      to = value,
      start = performance.now();
    let raf: number;
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = from + (to - from) * e;
      cur.current = v;
      setN(v);
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        cur.current = to;
        setN(to);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return n;
}

export function money(v: number) {
  if (v >= 1e9) return "$" + (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return "$" + Math.round(v / 1e3) + "K";
  return "$" + Math.round(v);
}

export function useRotate(len: number, ms = 2400) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (len <= 1) return;
    const id = setInterval(() => setI((v) => (v + 1) % len), ms);
    return () => clearInterval(id);
  }, [len, ms]);
  return i;
}

/* -------------------------------------------------------- COMPONENTS */

// Fades its children in whenever they change (reliable transition, no keyframes).
export function Swap({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const r = React.useRef<HTMLSpanElement | null>(null);
  const first = React.useRef(true);
  React.useEffect(() => {
    const el = r.current;
    if (!el) return;
    const show = () => {
      if (r.current) {
        r.current.style.opacity = "1";
        r.current.style.transform = "none";
      }
    };
    if (first.current) {
      first.current = false;
      show();
      return;
    }
    el.style.opacity = "0";
    el.style.transform = "translateY(6px)";
    const id = requestAnimationFrame(() => requestAnimationFrame(show));
    const t = setTimeout(show, 240);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [children]);
  return (
    <span ref={r} style={{ display: "inline-block", transition: "opacity .35s ease, transform .35s ease", ...style }}>
      {children}
    </span>
  );
}

function fmt(v: number, decimals?: number) {
  return decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1500,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!seen) return;
    let raf: number;
    let start: number | undefined;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const fb = setTimeout(() => setN(value), duration + 900);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fb);
    };
  }, [seen, value, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {fmt(n, decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------ VISUAL BITS */

// Spinning earth for the hero — continent outlines + a graticule rendered to
// canvas with an orthographic projection, in the brand green. Rotation is
// driven by scroll: scrolling advances the projection's longitude so the
// globe turns. Land data is a low-res world coastline (~55KB topojson)
// bundled at build time, so there's no runtime fetch.
const GLOBE_GREEN = "31, 168, 95"; // brand accent #1FA85F as rgb triple

export function ScrollGlobe() {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topo = landTopo as any;
    const land = feature(topo, topo.objects.land);
    const graticule = geoGraticule10();
    const sphere = { type: "Sphere" } as const;
    const projection = geoOrthographic().clipAngle(90).precision(0.4);
    const path = geoPath(projection, ctx);
    const tilt = 18; // northward tilt, degrees

    let size = 0;
    let dpr = 1;
    const draw = () => {
      projection.rotate([window.scrollY * 0.15, -tilt]);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);
      // faint sphere fill so the front hemisphere reads as a solid earth
      ctx.beginPath();
      path(sphere);
      ctx.fillStyle = `rgba(${GLOBE_GREEN}, 0.05)`;
      ctx.fill();
      // graticule (meridians + parallels)
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = `rgba(${GLOBE_GREEN}, 0.2)`;
      ctx.lineWidth = 1;
      ctx.stroke();
      // continents
      ctx.beginPath();
      path(land);
      ctx.fillStyle = `rgba(${GLOBE_GREEN}, 0.13)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${GLOBE_GREEN}, 0.85)`;
      ctx.lineWidth = 1.1;
      ctx.stroke();
      // crisp silhouette
      ctx.beginPath();
      path(sphere);
      ctx.strokeStyle = `rgba(${GLOBE_GREEN}, 0.9)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    const resize = () => {
      size = wrap.clientWidth;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      projection.scale(size / 2 - 2).translate([size / 2, size / 2]);
      draw();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw();
        });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mk-globe" aria-hidden="true" ref={wrapRef}>
      <div className="mk-globe-halo" />
      <canvas className="mk-globe-canvas" ref={canvasRef} />
    </div>
  );
}

export function MarkLogo({ size = 26, color = "currentColor", accent }: { size?: number; color?: string; accent?: string }) {
  // A confident "M" / target mark — concentric strokes through a slash.
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.34 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="7" stroke={color} strokeWidth="1.6" opacity="0.28" />
        <path d="M8 22V10l8 8 8-8v12" stroke={accent || color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16" cy="24.5" r="1.7" fill={accent || color} />
      </svg>
    </span>
  );
}

export const Icon = {
  globe: "M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2c2.5 2.7 4 6.3 4 10s-1.5 7.3-4 10c-2.5-2.7-4-6.3-4-10s1.5-7.3 4-10z",
  spark: "M12 2l2.2 6.3L20.5 10 14.2 12 12 18.3 9.8 12 3.5 10l6.3-1.7L12 2z",
  chart: "M4 20V4M4 20h16M8 16l4-5 3 3 5-7",
  code: "M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

export function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={Icon.arrow} />
    </svg>
  );
}

export function hexToRgba(hex: string, a: number) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return hex;
  return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
}

// Custom brand logos live in /public/logos/<slug>.svg. We preload the file
// and only return its URL once it loads — so a missing file simply falls
// through to the next option with no broken-image flash.
export function localLogoUrl(slug?: string) {
  return slug ? `/logos/${slug}.svg` : undefined;
}

export function useLocalLogo(slug?: string): string | null {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    const href = localLogoUrl(slug);
    if (!href) return; // no slug → stays on the null fallback
    let alive = true;
    const img = new Image();
    img.onload = () => alive && setUrl(href);
    img.onerror = () => alive && setUrl(null);
    img.src = href;
    return () => {
      alive = false;
    };
  }, [slug]);
  return url;
}

// Renders a Simple Icons single-path brand glyph (24×24 viewBox) in a color.
export function BrandLogo({ path, color, size = 24 }: { path: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  );
}
