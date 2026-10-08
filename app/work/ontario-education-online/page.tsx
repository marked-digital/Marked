import type { Metadata } from "next";
import CaseStudy from "@/components/case-study";
import { OEO } from "@/lib/oeo";
import { getReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Ontario Education Online: from first search to enrolment",
  description:
    "How Marked built Ontario Education Online's path from first search to enrolment: +1,183% revenue year over year from January to September 2026, alongside +944% orders, +938% sessions and +1,026% qualified leads.",
  alternates: { canonical: "/work/ontario-education-online" },
};

// Rebuilt at most every 6 hours, like the homepage, so the reviews section
// that closes the page picks up new Google reviews (lib/reviews.ts).
export const revalidate = 21600;

export default async function OntarioEducationOnline() {
  const reviews = await getReviews();
  return <CaseStudy data={OEO} reviews={reviews} />;
}
