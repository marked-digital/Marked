import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./marked.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "./smooth-scroll";
import CurtainTransition from "./curtain-transition";
import { MD } from "@/lib/md";

// GA4 measurement ID. Lives here so the tag covers every route in the app.
const GA_ID = "G-EPKJQ7RZ90";

// Structured data (schema.org JSON-LD) — how search engines and answer
// engines learn what Marked Digital *is*: an organization, its founder, its
// services, its profiles. Site-wide facts only; everything derives from
// lib/md.ts so the schema can't drift from the site copy. Rendered as a
// script tag in <body> per the Next JSON-LD guide, with `<` escaped against
// XSS injection through stringified content.
const SITE = "https://marked-digital.com";
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: MD.brandFull,
      url: SITE,
      logo: `${SITE}/icon.png`,
      slogan: `${MD.hero.h1[0]} ${MD.hero.h1[1]}`,
      description:
        "Marked Digital: the growth partner for ecommerce brands going global. Expansion, paid media, tech stacks, web builds and SEO/AEO as one compounding system.",
      founder: { "@type": "Person", name: "Mark Youash", jobTitle: "Managing Director" },
      address: { "@type": "PostalAddress", addressLocality: "Toronto", addressCountry: "CA" },
      // Social profiles, straight from the footer's Connect column.
      sameAs: (MD.footer.cols.find((c) => c.h === "Connect")?.items ?? [])
        .map((i) => (typeof i === "string" ? null : i.href))
        .filter(Boolean),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: MD.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.desc },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: MD.brandFull,
      publisher: { "@id": `${SITE}/#org` },
    },
  ],
};

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  // Resolves relative metadata (og:image, canonical) to absolute URLs —
  // scrapers like Facebook's reject relative image paths.
  metadataBase: new URL("https://marked-digital.com"),
  title: {
    default: "Marked. | Make your mark in any market",
    template: "Marked. | %s",
  },
  description:
    "Marked Digital: the growth partner for ecommerce brands going global. Expansion, paid media, tech stacks, web builds and SEO/AEO as one compounding system.",
  // Home's canonical. Every other page sets its own in its metadata block —
  // this inherited value only reaches routes that don't override it.
  alternates: { canonical: "/" },
  // The link-preview card itself comes from app/opengraph-image.tsx /
  // twitter-image.tsx (file conventions); these set the surrounding fields.
  openGraph: {
    siteName: "Marked Digital",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }} />
        <SmoothScroll>{children}</SmoothScroll>
        {/* Curtain interstitial for clicks to the destination pages (/book,
            /about — see CURTAIN_ROUTES) — lives at the root so it can
            intercept their links on every page and persist across the route
            change it covers. */}
        <CurtainTransition />
        {/* Google tag (gtag.js). next/script's default "afterInteractive"
            strategy loads these once the page is interactive — it handles the
            async loading the raw snippet does by hand. The inline half needs an
            id so Next can track it. */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
        </Script>
      </body>
    </html>
  );
}
