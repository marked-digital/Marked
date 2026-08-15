import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Marked Digital exists: other agencies didn't care about the business, or the numbers, the way we do. One team running international expansion, advertising, AI and the storefront as a single compounding system, accountable to revenue.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return <AboutPage />;
}
