import HomeSignal from "@/components/home-signal";
import { getReviews } from "@/lib/reviews";

// Rebuilt at most every 6 hours, so the reviews section picks up new Google
// reviews (lib/reviews.ts) without fetching them on every visit.
export const revalidate = 21600;

export default async function Home() {
  const reviews = await getReviews();
  return <HomeSignal reviews={reviews} />;
}
