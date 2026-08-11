"use client";

// Shared topbar pieces used by all five page navs (home, stack, approach, work
// case study, book). The desktop bar still lives in each page — this file owns
// the two parts that have to behave identically everywhere:
//
//   NavCta     the pill CTA, with a shorter label on phones
//   MobileMenu the hamburger button plus its drawer, ≤760px only
//
// Below 760px the desktop link row (.sg-nav-links / .stk-nav-links) is hidden by
// marked.css; the drawer is what replaces it. Logo and CTA stay in the bar.

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { MD, navHref } from "@/lib/md";

// Drawer destinations, in the same order the desktop navs render them: the four
// MD.nav items, then /stack, which every page appends by hand.
const NAV_ITEMS = [...MD.nav, "Stack"];

// Which nav item the current route belongs to, so the drawer can mark it.
// "/work/…" case studies belong to Work; the homepage's hash sections have no
// stable active state, so "/" highlights nothing.
function activeItem(pathname: string | null): string | null {
  if (!pathname) return null;
  if (pathname === "/approach") return "Approach";
  if (pathname === "/stack") return "Stack";
  if (pathname.startsWith("/work")) return "Work";
  return null;
}

/** The nav's pill CTA. `className` picks the page's button flavour
 *  (.sg-btn .sg-btn--p everywhere except the stack page's .stk-btn); the compact
 *  nav sizing and the responsive label live in .mk-nav-cta. */
export function NavCta({ className, current }: { className?: string; current?: boolean }) {
  return (
    <Link
      className={`${className ?? "sg-btn sg-btn--p"} mk-nav-cta`}
      href={MD.ctaHref}
      {...(current ? { "aria-current": "page" as const } : {})}
    >
      {/* One of the two is display:none at any width, which also keeps it out of
          the accessible name. */}
      <span className="mk-nav-cta-full">{MD.cta}</span>
      <span className="mk-nav-cta-short">{MD.ctaShort}</span>
    </Link>
  );
}

export function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = React.useRef<HTMLAnchorElement | null>(null);
  const active = activeItem(pathname);

  // Close on any route change the drawer didn't initiate — back/forward while
  // it's open. Adjusted during render off the previous pathname rather than in
  // an effect, so it never paints the stale open state.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  React.useEffect(() => {
    if (!open) return;

    // Lenis owns the document scroller (see app/smooth-scroll.tsx), and while
    // stopped it preventDefaults wheel and touchmove — that is what freezes the
    // page behind the drawer. The drawer itself carries data-lenis-prevent,
    // which Lenis checks *before* its stopped state, so it still scrolls.
    // overflow:hidden is only the fallback for a missing instance.
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    if (!lenis) document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    firstLinkRef.current?.focus();

    return () => {
      lenis?.start();
      if (!lenis) document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, lenis]);

  function close() {
    setOpen(false);
    btnRef.current?.focus();
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="mk-burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mk-mobile-nav"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className={`mk-burger-bars${open ? " is-open" : ""}`} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      {/* Sits under the sticky bar (z-index 49 vs 50) so the logo, CTA and the
          button that closes it stay visible and clickable while it's open.
          `inert` keeps the closed drawer out of tab order and the a11y tree
          without display:none, which would kill the transition. */}
      <div
        id="mk-mobile-nav"
        className={`mk-drawer${open ? " is-open" : ""}`}
        data-lenis-prevent
        inert={!open}
      >
        <nav className="mk-drawer-inner" aria-label="Site">
          {NAV_ITEMS.map((n, i) => (
            <Link
              key={n}
              ref={i === 0 ? firstLinkRef : undefined}
              className={`mk-drawer-link${n === active ? " is-active" : ""}`}
              href={navHref(n)}
              onClick={() => setOpen(false)}
              // Staggered entrance; collapsed to 0 when closing so the drawer
              // leaves in one piece.
              style={{ transitionDelay: open ? `${70 + i * 45}ms` : "0ms" }}
            >
              <span className="mk-drawer-i">{String(i + 1).padStart(2, "0")}</span>
              <span>{n}</span>
            </Link>
          ))}
          <Link
            className="sg-btn sg-btn--p mk-drawer-cta"
            href={MD.ctaHref}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${70 + NAV_ITEMS.length * 45}ms` : "0ms" }}
          >
            {MD.cta}
          </Link>
          <div className="mk-drawer-foot">{MD.footer.address}</div>
        </nav>
      </div>
    </>
  );
}
