"use client";

// "Show all" for a long card grid: the case study brief
// (Objectives in components/case-study.tsx).
//
// Every card is in the server HTML. Cards past the first `first` carry
// data-more, and while the grid is collapsed one CSS rule hides them, so search
// engines and AI crawlers still read the whole list. The cards arrive as
// children, already rendered by the parent, so toggling re-renders only this
// wrapper and its button: React leaves the cards' DOM, and the scroll-reveal
// styles set on it, alone.

import React from "react";
import { useLenis } from "lenis/react";
import styles from "./show-all.module.css";

export default function ShowAll({
  id,
  first,
  className,
  children,
}: {
  /** The grid's id, which the button's aria-controls points at. */
  id: string;
  /** How many cards show while collapsed. The card after them takes focus
   *  when the grid expands, so it needs tabIndex={-1}. */
  first: number;
  /** The grid's own class. */
  className: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  // Set by the button, so nothing moves focus or scrolls on first render.
  const used = React.useRef(false);
  // Where the button sat on screen just before a collapse.
  const buttonTop = React.useRef<number | null>(null);
  // Lenis owns the scroll position while it runs (app/smooth-scroll.tsx), so
  // the collapse correction goes through it when it's there.
  const lenis = useLenis();
  const lenisRef = React.useRef(lenis);
  React.useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // Runs after the DOM changes and before paint.
  React.useLayoutEffect(() => {
    if (!used.current) return;
    if (open) {
      // The first card that was hidden takes focus where the button was,
      // without scrolling. :focus-visible keeps the ring to keyboard use.
      (gridRef.current?.children[first] as HTMLElement | undefined)?.focus({ preventScroll: true });
      return;
    }
    // Collapsing removes the cards above the button, which would leave the
    // reader below the section. Scroll by however far the button moved, in one
    // step (so reduced motion needs nothing extra), and keep focus on it.
    const button = buttonRef.current;
    if (!button) return;
    const moved = buttonTop.current === null ? 0 : button.getBoundingClientRect().top - buttonTop.current;
    if (moved) {
      const y = window.scrollY + moved;
      if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }
    button.focus({ preventScroll: true });
  }, [open, first]);

  return (
    <>
      <div ref={gridRef} id={id} className={`${className} ${styles.grid}`} data-collapsed={open ? undefined : ""}>
        {children}
      </div>
      <div className={styles.bar}>
        <button
          ref={buttonRef}
          type="button"
          className={`sg-btn sg-btn--g ${styles.toggle}`}
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            used.current = true;
            buttonTop.current = open && buttonRef.current ? buttonRef.current.getBoundingClientRect().top : null;
            setOpen(!open);
          }}
        >
          {open ? "Show less" : "Show all"}
        </button>
      </div>
    </>
  );
}
