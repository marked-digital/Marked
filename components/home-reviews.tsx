"use client";

// Homepage "In their words": client reviews from Marked's Google Business
// Profile (lib/reviews.ts, fetched in app/page.tsx). A scoreboard with Google's
// average and count sits beside a spotlight that shows one review at a time
// and steps through them on its own.
//
// Built for any number of reviews. All of them render into the server HTML, so
// crawlers and answer engines read every one. They're stacked in one grid cell,
// so the spotlight keeps the height of the longest and never jumps.
//
// Rotation follows the WAI-ARIA carousel pattern. It pauses while a mouse is
// over the spotlight, while it's off screen and while the tab is hidden. It
// stops once keyboard focus moves into it or someone steps through by hand,
// until they press play. Motion is opt-in: data-motion="on" goes on after
// hydration unless the visitor prefers reduced motion. Without it there's no
// rotation, count-up, slide-in or underline draw, and everything renders at
// rest (app/marked.css, "Reviews").

import React from "react";
import { C } from "@/lib/md";
import { iconPath } from "@/lib/icons";
import { useInView } from "@/components/shared";
import type { Review, ReviewFeed } from "@/lib/reviews";

/* ------------------------------------------------------------- helpers */

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

// False on the server and through hydration, so the HTML renders at rest.
function useMotionOK() {
  return React.useSyncExternalStore(subscribeReduce, () => !window.matchMedia(REDUCE).matches, () => false);
}

function usePageVisible() {
  return React.useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
}

// How long a review stays up while rotating: time to read it at an unhurried
// ~260 words a minute, plus a beat.
function readMs(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.min(20000, Math.max(7000, 3000 + words * 230));
}

// Longer reviews are set smaller, so one doesn't tower over the rest.
function quoteSize(text: string) {
  return text.length <= 160 ? "l" : text.length <= 320 ? "m" : "s";
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-09" or an ISO timestamp to "Sep 2026", read straight off the string so
// the server and the browser agree whatever their time zones.
function monthYear(date: string) {
  const m = /^(\d{4})-(\d{2})/.exec(date);
  const month = m ? MONTHS[Number(m[2]) - 1] : undefined;
  return m && month ? `${month} ${m[1]}` : "";
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = (w?: string) => (w ? Array.from(w)[0] : "");
  const letters = words.length > 1 ? first(words[0]) + first(words[words.length - 1]) : first(words[0]);
  return letters.toUpperCase();
}

/* ------------------------------------------------------------- pieces */

const STAR = "M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95z";
const STAR_STEP = 30; // one 24-unit star plus a 6-unit gap

// Five stars filled to `value`, partial stars included: a track and a fill
// clipped to the star shapes. Decorative; callers give the rating in words.
function Stars({ value, size, className }: { value: number; size: number; className?: string }) {
  const clip = "sg-rev-stars-" + React.useId().replace(/[^\w-]/g, "");
  const v = Math.max(0, Math.min(5, value));
  const fill = Math.floor(v) * STAR_STEP + (v % 1) * 24;
  return (
    <svg className={className} width={size * 6} height={size} viewBox="0 0 144 24" aria-hidden="true" focusable="false">
      <clipPath id={clip}>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={STAR} transform={`translate(${i * STAR_STEP} 0)`} />
        ))}
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect width="144" height="24" fill="rgba(255, 255, 255, 0.14)" />
        <rect className="sg-rev-starfill" width={fill} height="24" fill={C.accent} />
      </g>
    </svg>
  );
}

function GoogleMark({ size }: { size: number }) {
  return (
    <svg className="sg-rev-g" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={iconPath("google")} fill="currentColor" />
    </svg>
  );
}

function ControlIcon({ kind }: { kind: "prev" | "next" | "pause" | "play" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === "prev" && <path d="M15 5l-7 7 7 7" />}
      {kind === "next" && <path d="M9 5l7 7-7 7" />}
      {kind === "pause" && <path d="M9 6v12M15 6v12" />}
      {kind === "play" && <path d="M8.5 5.8v12.4L18 12z" fill="currentColor" />}
    </svg>
  );
}

// Google's average, counted up from zero the first time the scoreboard comes
// into view. The server HTML carries the real figure. The digits are hidden
// from screen readers, which get the rating as a sentence instead.
function RatingFigure({ value, run }: { value: number; run: boolean }) {
  const [shown, setShown] = React.useState(value);
  React.useEffect(() => {
    let raf = 0;
    if (!run) {
      // Motion switched off mid-count: settle on the real figure.
      raf = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(raf);
    }
    let start: number | undefined;
    const step = (t: number) => {
      start ??= t;
      const p = Math.min(1, (t - start) / 1300);
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return (
    <span className="sg-rev-big" aria-hidden="true">
      {shown.toFixed(1)}
    </span>
  );
}

function Avatar({ review }: { review: Review }) {
  if (review.photo) {
    // A plain img: Google serves reviewer photos from its own CDN, and
    // next/image would need each of its hosts allow-listed.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="sg-rev-avatar" src={review.photo} alt="" width={44} height={44} loading="lazy" referrerPolicy="no-referrer" />;
  }
  return (
    <span className="sg-rev-avatar" aria-hidden="true">
      {initials(review.author)}
    </span>
  );
}

// The review word for word, with its highlight phrase (if any) in a <mark>.
function QuoteText({ review }: { review: Review }) {
  const { text, highlight } = review;
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="sg-rev-mark">{highlight}</mark>
      {text.slice(at + highlight.length)}
    </>
  );
}

/* ------------------------------------------------------------- section */

export default function Reviews({ feed }: { feed: ReviewFeed }) {
  const { reviews } = feed;
  const n = reviews.length;
  const motionOK = useMotionOK();
  const pageVisible = usePageVisible();
  const [gridRef, seen] = useInView<HTMLDivElement>({ threshold: 0.2 });
  const spotRef = React.useRef<HTMLDivElement | null>(null);
  const swipeFrom = React.useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = React.useState(0);
  const [stopped, setStopped] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [onScreen, setOnScreen] = React.useState(false);

  // Rotation only runs while the spotlight is on screen.
  React.useEffect(() => {
    const el = spotRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!n) return null;

  const cur = Math.min(active, n - 1);
  const rotating = n > 1 && motionOK && !stopped;
  const playing = rotating && onScreen && !hovered && pageVisible;
  const go = (to: number) => setActive(((to % n) + n) % n);
  // Stepping through by hand stops the rotation.
  const step = (by: number) => {
    setStopped(true);
    go(cur + by);
  };
  const pad = (k: number) => String(k).padStart(2, "0");
  const plural = feed.count === 1 ? "review" : "reviews";

  return (
    <section
      id="reviews"
      className="sg-wrap sg-rev"
      data-motion={motionOK ? "on" : undefined}
      style={{ paddingTop: 4, paddingBottom: 72, scrollMarginTop: 96 }}
    >
      <div className="sg-sec-head">
        <h2 style={{ fontSize: 15, fontWeight: 500, color: C.accent, letterSpacing: "0.04em", margin: 0 }}>IN THEIR WORDS</h2>
        <p style={{ color: C.faint, fontSize: 14, margin: 0 }}>Straight from Google. Unedited.</p>
      </div>

      <div ref={gridRef} className={"sg-rev-grid" + (seen ? " is-in" : "")}>
        <div className="sg-rev-score">
          <div className="sg-rev-label">
            <GoogleMark size={15} />
            Google rating
          </div>
          <RatingFigure value={feed.rating} run={seen && motionOK} />
          <Stars value={feed.rating} size={26} className="sg-rev-stars" />
          <p className="sg-rev-basis">
            <span className="sg-sr">{`Rated ${feed.rating.toFixed(1)} out of 5. `}</span>
            {`Based on ${feed.count} Google ${plural}`}
          </p>
          <div className="sg-rev-actions">
            {feed.writeReviewUrl && (
              <a className="sg-btn sg-btn--g sg-rev-btn" href={feed.writeReviewUrl} target="_blank" rel="noopener">
                Leave a review
                <span className="sg-sr"> (opens in a new tab)</span>
              </a>
            )}
            <a className="sg-btn sg-btn--g sg-rev-btn" href={feed.profileUrl} target="_blank" rel="noopener">
              Read on Google
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
              <span className="sg-sr"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <div
          ref={spotRef}
          className="sg-rev-spot"
          role="region"
          aria-roledescription="carousel"
          aria-label="Client reviews"
          onKeyDown={(e) => {
            if (n < 2 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            step(e.key === "ArrowRight" ? 1 : -1);
          }}
          onFocus={(e) => {
            // Keyboard focus arriving from outside stops the rotation. A mouse
            // click on a control decides for itself.
            if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
            if (e.target.matches(":focus-visible")) setStopped(true);
          }}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") setHovered(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") setHovered(false);
          }}
        >
          <svg className="sg-rev-glyph" width="44" height="34" viewBox="0 0 44 34" aria-hidden="true" focusable="false">
            <path
              d="M0 34V20.4C0 9.2 6.1 2.2 18.2 0l1.9 4.6C13.4 6.6 10.1 10.6 9.9 16.2H18V34H0zm24 0V20.4C24 9.2 30.1 2.2 42.2 0l1.9 4.6c-6.7 2-10 6-10.2 11.6H42V34H24z"
              fill="currentColor"
            />
          </svg>

          <div
            className="sg-rev-slides"
            aria-live={rotating ? "off" : "polite"}
            onPointerDown={(e) => {
              swipeFrom.current = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const from = swipeFrom.current;
              swipeFrom.current = null;
              if (!from || n < 2) return;
              const dx = e.clientX - from.x;
              const dy = e.clientY - from.y;
              if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              swipeFrom.current = null;
            }}
          >
            {reviews.map((r, i) => {
              const when = monthYear(r.date);
              return (
                <figure
                  key={r.id}
                  className={"sg-rev-slide" + (i === cur ? " is-on" : "") + (i === cur && seen ? " is-drawn" : "")}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${n}`}
                >
                  <blockquote className={`sg-rev-quote sg-rev-quote--${quoteSize(r.text)}`}>
                    <p>
                      <QuoteText review={r} />
                    </p>
                  </blockquote>
                  <figcaption className="sg-rev-by">
                    <Avatar review={r} />
                    <span className="sg-rev-who">
                      <span className="sg-rev-name">{r.author}</span>
                      <span className="sg-rev-meta">
                        <Stars value={r.rating} size={13} />
                        <span className="sg-sr">{`Rated ${r.rating} out of 5. `}</span>
                        {when && <time dateTime={r.date}>{when}</time>}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {n > 1 && (
            <div className="sg-rev-ctrl">
              <span className="sg-rev-count" aria-hidden="true">
                <b>{pad(cur + 1)}</b> / {pad(n)}
              </span>
              {/* While rotating, the bar times the current review; otherwise it
                  shows how far through the reviews you are. */}
              <span className="sg-rev-track" aria-hidden="true">
                <span
                  key={rotating ? cur : "at-rest"}
                  className={"sg-rev-fill" + (rotating ? " is-timed" : "")}
                  style={
                    rotating
                      ? { animationDuration: `${readMs(reviews[cur].text)}ms`, animationPlayState: playing ? "running" : "paused" }
                      : { transform: `scaleX(${(cur + 1) / n})` }
                  }
                  onAnimationEnd={(e) => {
                    if (e.animationName === "sg-rev-prog") go(cur + 1);
                  }}
                />
              </span>
              <span className="sg-rev-btns">
                {motionOK && (
                  <button
                    type="button"
                    className="sg-rev-nav"
                    onClick={() => setStopped(!stopped)}
                    aria-label={stopped ? "Start rotating reviews" : "Stop rotating reviews"}
                  >
                    <ControlIcon kind={stopped ? "play" : "pause"} />
                  </button>
                )}
                <button type="button" className="sg-rev-nav" onClick={() => step(-1)} aria-label="Previous review">
                  <ControlIcon kind="prev" />
                </button>
                <button type="button" className="sg-rev-nav" onClick={() => step(1)} aria-label="Next review">
                  <ControlIcon kind="next" />
                </button>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
