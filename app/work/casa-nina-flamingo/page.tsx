import type { Metadata } from "next";
import CaseStudy from "@/components/case-study";
import { CASA_NINA } from "@/lib/casa-nina";

const DESCRIPTION =
  "How a Costa Rica villa that sleeps 14 went from another Airbnb listing to a premium site of its own in 45 days, built to be discovered and booked direct.";
const SOCIAL_TITLE = "Casa Nina Flamingo: from another listing to discovered and recommended";

export const metadata: Metadata = {
  title: "Casa Nina Flamingo: from listing to discovered",
  description: DESCRIPTION,
  alternates: { canonical: "/work/casa-nina-flamingo" },
  // Re-declares the layout's openGraph and twitter fields in case this Next
  // version replaces nested metadata objects instead of merging them.
  openGraph: {
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    url: "/work/casa-nina-flamingo",
    siteName: "Marked Digital",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
  },
};

export default function CasaNinaFlamingo() {
  return <CaseStudy data={CASA_NINA} />;
}
