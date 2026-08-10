import type { Metadata } from "next";
import OeoCaseStudy from "@/components/oeo-case-study";

export const metadata: Metadata = {
  title: "Ontario Education Online — from provincial to international",
  description:
    "How Ontario Education Online went from provincial course provider to international brand in seven months: +548% revenue, +618% orders, +1,400% sessions and +713% qualified leads, year over year.",
};

export default function OntarioEducationOnline() {
  return <OeoCaseStudy />;
}
