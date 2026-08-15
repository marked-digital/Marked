// The link-preview card (og:image) for every route — what Facebook, WhatsApp,
// iMessage, LinkedIn and Instagram DMs render when someone shares a
// marked-digital.com URL. Generated at build time from the same brand tokens
// the site uses (lib/md.ts), so a palette or tagline change re-renders the
// card on the next deploy. twitter-image.tsx re-exports this for the
// twitter:image tag.
//
// Fonts: Plus Jakarta Sans statics live in assets/fonts (SIL OFL) — Satori
// can't read the woff2 files next/font downloads, so the TTFs are vendored.

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { C, MD } from "@/lib/md";

export const alt = `${MD.brand}. ${MD.hero.h1[0]} ${MD.hero.h1[1]}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [bold, extraBold] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/PlusJakartaSans-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/PlusJakartaSans-ExtraBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: C.bg,
          fontFamily: "Jakarta",
        }}
      >
        {/* The mark — same geometry as MarkLogo (components/shared.tsx),
            inlined because Satori needs bare SVG markup. */}
        <svg width={190} height={190} viewBox="0 0 32 32" fill="none">
          <rect x="1.2" y="1.2" width="29.6" height="29.6" rx="7" stroke="rgba(243,245,242,0.4)" strokeWidth="1.6" />
          <path d="M8 22V10l8 8 8-8v12" stroke={C.accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="16" cy="24.5" r="1.7" fill={C.accent} />
        </svg>
        <div style={{ display: "flex", marginTop: 34, fontSize: 118, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: C.text }}>
          {MD.brand}
          <span style={{ color: C.accent }}>.</span>
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 45, fontWeight: 700, color: C.text }}>
          {`${MD.hero.h1[0]} `}
          {/* The tagline drops the sentence period here — the card mirrors
              the brand lockup, not the hero heading. */}
          <span style={{ color: C.accent }}>{MD.hero.h1[1].replace(/\.$/, "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: bold, weight: 700, style: "normal" },
        { name: "Jakarta", data: extraBold, weight: 800, style: "normal" },
      ],
    }
  );
}
