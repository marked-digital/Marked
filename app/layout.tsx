import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./marked.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "./smooth-scroll";

// GA4 measurement ID. Lives here so the tag covers every route in the app.
const GA_ID = "G-EPKJQ7RZ90";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Marked. | Make your mark in any market",
    template: "Marked. | %s",
  },
  description:
    "Marked Digital is the growth partner for e-commerce brands going global — international expansion, AI-run advertising, and conversion-built sites, operated as one compounding system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
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
