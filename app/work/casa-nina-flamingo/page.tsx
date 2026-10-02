import type { Metadata } from "next";
import CaseStudy from "@/components/case-study";
import { CASA_NINA } from "@/lib/casa-nina";

const DESCRIPTION =
  "How Casa Nina Flamingo, a Costa Rica villa that sleeps 14, went from an email link to a direct-booking vacation rental website in 58 days.";
const SOCIAL_TITLE = "Casa Nina Flamingo: from an email link to direct booking";

export const metadata: Metadata = {
  title: "Casa Nina Flamingo: built for direct booking",
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
