import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Marked Digital exists: growth kept getting sold in pieces, so we built one team that runs international expansion, advertising, AI and the storefront as a single compounding system.",
};

export default function About() {
  return <AboutPage />;
}
