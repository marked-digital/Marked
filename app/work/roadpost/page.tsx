import type { Metadata } from "next";
import CaseStudy from "@/components/case-study";
import { ROADPOST } from "@/lib/roadpost";

export const metadata: Metadata = {
  title: "Roadpost: a record year in every channel",
  description:
    "How Roadpost reached a record $20.9M in FY24 e-commerce revenue, up 118% year over year: $8M on Amazon USA, double-digit growth on every web storefront, and ZOLEO past 100,000 subscribers ahead of plan.",
  alternates: { canonical: "/work/roadpost" },
};

export default function Roadpost() {
  return <CaseStudy data={ROADPOST} />;
}
