// The one site footer — every page renders this (home, stack, approach, work
// case studies, book, about), replacing the per-page one-liners that had
// quietly drifted apart. Styles live in the "site footer (.ftr)" section of
// marked.css.
//
// It sizes against its own width (CSS container queries + cqw units), not the
// viewport, so the same component works full-bleed on normal pages and inside
// the About page's half-width narrative pane without a special variant.
//
// Anatomy: one evenly-distributed grid — brand + one-liner + socials in the
// first (wider) column, the MD.footer link columns filling the rest (same
// 1.4fr/1fr rhythm the old home footer used) — then the legal bar. All
// content is data-driven from lib/md.ts — edit there, not here.

import Link from "next/link";
import { MD, C } from "@/lib/md";
import { iconPath } from "@/lib/icons";
import { MarkLogo } from "@/components/shared";

// Social profiles with glyphs, single-sourced from the footer's Connect
// column so a URL change there lands everywhere. Icon slugs resolve via
// lib/icons.ts. (The About page's "follow the work in public" row imports
// this too.)
export const SOCIALS = (["LinkedIn", "Instagram", "GitHub"] as const).flatMap((label) => {
  const items = MD.footer.cols.find((c) => c.h === "Connect")?.items ?? [];
  const item = items.find((i): i is { label: string; href: string } => typeof i !== "string" && i.label === label);
  return item ? [{ label, href: item.href, path: iconPath(label.toLowerCase()) }] : [];
});

export default function SiteFooter() {
  return (
    <footer className="ftr">
      <div className="ftr-inner">
        <div className="ftr-top">
          <div className="ftr-brand">
            <Link href="/" className="ftr-logo">
              <MarkLogo size={24} color={C.text} accent={C.accent} />
              <span>
                {MD.brand}
                <span style={{ color: C.accent }}>.</span>
              </span>
            </Link>
            <p className="ftr-line">The growth partner for e-commerce brands going global.</p>
            <div className="ftr-social">
              {SOCIALS.map((s) => (
                <a key={s.label} className="ftr-social-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  {s.path && (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
          {/* display: contents — the nav stays a landmark while its three
              columns sit directly in the .ftr-top grid next to the brand. */}
          <nav className="ftr-cols" aria-label="Footer">
            {MD.footer.cols.map((col) => (
              <div key={col.h}>
                <div className="ftr-h">{col.h}</div>
                {col.items.map((it) => {
                  const label = typeof it === "string" ? it : it.label;
                  const href = typeof it === "string" ? "#" : it.href;
                  const external = href.startsWith("http");
                  return (
                    <a key={label} className="ftr-link" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {label}
                    </a>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      </div>
      <div className="ftr-bar">
        <span>
          © 2026 {MD.brandFull}. {MD.footer.address}.
        </span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
