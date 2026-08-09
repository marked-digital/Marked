// Booking page — the destination for every "Book a strategy call" CTA.
// Wraps Google Calendar's appointment scheduler in the site's chrome so the
// hand-off from the marketing pages doesn't feel like leaving the site.
//
// No hooks here, so this stays a server component; the nav/footer are rebuilt
// compact with the site's classes, the same way approach-page.tsx does it.

import Link from "next/link";
import { MD, C, navHref } from "@/lib/md";
import { MarkLogo } from "@/components/shared";

// Google Calendar appointment schedule. To repoint the booking flow, swap this
// one URL — take it from the scheduler's "Embed" snippet and keep ?gv=true,
// which is what renders the full booking view rather than the compact button.
const SCHEDULER_SRC =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0kSTy_7sMrXBaLtpAjC0zbmee-o26BC83l9mW3Xbpa83O3J_C0_2Rz6s2UeVs9wCA4OSrOIGCW?gv=true";

function Nav() {
  return (
    <header className="mk-topbar">
      <div className="sg-wrap mk-topbar-inner">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 19, fontWeight: 700, letterSpacing: "-0.03em" }}>
          <MarkLogo size={22} color={C.text} accent={C.accent} />
          <span>
            {MD.brand}
            <span style={{ color: C.accent }}>.</span>
          </span>
        </Link>
        <nav className="sg-nav-links">
          {MD.nav.map((n) => (
            <Link key={n} className="sg-navlink" href={navHref(n)}>
              {n}
            </Link>
          ))}
          <Link className="sg-navlink" href="/stack">
            Stack
          </Link>
        </nav>
        {/* Self-link — the bar has to look identical to every other page, so
            the CTA keeps its button treatment here too. */}
        <Link className="sg-btn sg-btn--p" href={MD.ctaHref} aria-current="page" style={{ padding: "9px 17px", fontSize: 14 }}>
          {MD.cta}
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  const f = MD.footer;
  return (
    <footer style={{ borderTop: `1px solid ${C.line}` }}>
      <div className="sg-wrap" style={{ paddingTop: 30, paddingBottom: 30, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, color: C.faint, fontSize: 13.5 }}>
        <span>
          © 2026 {MD.brandFull}. {f.address}.
        </span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}

export default function BookPage() {
  return (
    <div className="sg">
      <Nav />
      <section className="sg-wrap" style={{ paddingTop: 76, paddingBottom: 96 }}>
        <h2 style={{ fontSize: 15, fontWeight: 500, color: C.muted, letterSpacing: "0.04em", margin: 0 }}>BOOK A STRATEGY CALL</h2>
        <h1 className="sg-h2" style={{ fontWeight: 700, letterSpacing: "-0.03em", margin: "22px 0 0", lineHeight: 1.06, maxWidth: 720 }}>
          Thirty minutes. The fastest path to your next market.
        </h1>
        <p style={{ color: C.muted, fontSize: 17.5, lineHeight: 1.6, marginTop: 20, maxWidth: 560 }}>
          {MD.ctaBand.sub} Pick a time below and you&apos;ll get a calendar invite straight away.
        </p>

        <div className="bk-frame">
          <iframe
            src={SCHEDULER_SRC}
            title={`Book a strategy call with ${MD.brandFull}`}
            style={{ border: 0 }}
          />
        </div>

        <p style={{ color: C.faint, fontSize: 13.5, lineHeight: 1.6, marginTop: 20, maxWidth: 560 }}>
          Times shown in your local timezone. If nothing here works, email us and we&apos;ll find a slot.
        </p>
      </section>
      <Footer />
    </div>
  );
}
