import type { Metadata } from "next";
import CaseStudy from "@/components/case-study";
import { OEO } from "@/lib/oeo";

export const metadata: Metadata = {
  title: "Ontario Education Online: from first search to enrolment",
  description:
    "How Marked built Ontario Education Online's path from first search to enrolment: +1,183% revenue year over year from January to September 2026, alongside +944% orders, +938% sessions and +1,026% qualified leads.",
  alternates: { canonical: "/work/ontario-education-online" },
};

export default function OntarioEducationOnline() {
  return <CaseStudy data={OEO} />;
}
