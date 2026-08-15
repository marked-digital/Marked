import type { Metadata } from "next";
import CaseStudy from "@/components/case-study";
import { OEO } from "@/lib/oeo";

export const metadata: Metadata = {
  title: "Ontario Education Online: from provincial to international",
  description:
    "How Ontario Education Online went from provincial course provider to international brand in seven months: +548% revenue, +618% orders, +1,400% sessions and +713% qualified leads, year over year.",
  alternates: { canonical: "/work/ontario-education-online" },
};

export default function OntarioEducationOnline() {
  return <CaseStudy data={OEO} />;
}
