import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./marked.css";
import "lenis/dist/lenis.css";
import SmoothScroll from "./smooth-scroll";

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
      </body>
    </html>
  );
}
