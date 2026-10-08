// Client reviews for the "In their words" section, from Marked's Google
// Business Profile. Rendered by components/home-reviews.tsx; fetched by each
// page that shows it: the homepage (app/page.tsx) and the Ontario Education
// Online case study (app/work/ontario-education-online/page.tsx).
//
// Two sources, one shape (ReviewFeed):
//
//   1. Live, from the Google Business Profile API, once Google approves API
//      access and these are set in the hosting env. Never in the repo, which
//      is public:
//        GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN
//        GBP_LOCATION (optional): "accounts/…/locations/…", which skips
//          looking up the profile's account and location
//      Those pages rebuild at most every 6 hours (`revalidate` in each), and
//      each rebuild fetches a fresh access token and the reviews, so visitors
//      never wait on Google.
//   2. The reviews below, copied verbatim from the profile. They're used until
//      the API is set up, and whenever a live fetch fails, so the section
//      never breaks.
//
// Reviews are shown exactly as written, newest first, with Google's own
// average and count. Don't edit, trim or filter them: a hand-picked subset
// shown as "our reviews" misleads, and rewording one misquotes a client.

export type Review = {
  id: string;
  author: string;
  /** The reviewer's Google profile photo, when the API provides one. */
  photo?: string;
  /** 1 to 5. */
  rating: number;
  text: string;
  /** ISO date, or a bare "yyyy-mm" when only the month is known. */
  date: string;
  /** An exact phrase from `text` that the spotlight underlines. */
  highlight?: string;
};

export type ReviewFeed = {
  /** Google's average rating, 0 to 5. */
  rating: number;
  /** Every review on the profile, including rating-only ones. */
  count: number;
  /** The reviews with text, newest first. */
  reviews: Review[];
  profileUrl: string;
  /** The profile's "Get more reviews" link. Without it, no "Leave a review"
   *  button is shown. */
  writeReviewUrl?: string;
  source: "google" | "manual";
};

const PROFILE_URL = "https://share.google/2McZBB8CTbEXyW4y0";
const WRITE_REVIEW_URL: string | undefined = undefined;

// Phrases to underline in the spotlight, by reviewer. Each applies only while
// the phrase appears word for word in that person's review, so if a review
// changes on Google it loses its underline instead of being misquoted.
const HIGHLIGHTS: Record<string, string> = {
  "Andrew Ramos": "his results speak for themselves",
  "Adam Moroney": "a massive jump in revenue",
};

// Copied verbatim from the Google Business Profile on 5 Oct 2026, newest
// first. Google showed only relative dates ("2 weeks ago", "5 weeks ago"), so
// just the month is recorded. The live feed replaces these once it's set up.
const MANUAL_REVIEWS: Review[] = [
  {
    id: "andrew-ramos",
    author: "Andrew Ramos",
    rating: 5,
    date: "2026-09",
    text: "Mark is exceptional. A-list player. Incredible to work with and his results speak for themselves. Thank you for all you've done for us Mark.",
  },
  {
    id: "adam-moroney",
    author: "Adam Moroney",
    rating: 5,
    date: "2026-08",
    text: "Mark has been the 🔑 to our continued growth. Since he jumped on board with us we have seen a massive jump in revenue. His expertise, his attentiveness and the fact that he ACTUALLY cares about how he spends your money really stands out.",
  },
];

function withHighlight(review: Review): Review {
  const phrase = HIGHLIGHTS[review.author];
  return phrase && review.text.includes(phrase) ? { ...review, highlight: phrase } : review;
}

function manualFeed(): ReviewFeed {
  const reviews = MANUAL_REVIEWS.map(withHighlight);
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
  return {
    rating: Math.round(average * 10) / 10,
    count: reviews.length,
    reviews,
    profileUrl: PROFILE_URL,
    writeReviewUrl: WRITE_REVIEW_URL,
    source: "manual",
  };
}

/* ------------------------------------------------- Business Profile API */

// The slices of the API responses this file reads.
type GbpReview = {
  reviewId?: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating?: string; // ONE … FIVE
  comment?: string;
  createTime?: string;
};
type GbpReviewsPage = {
  reviews?: GbpReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
};

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

// Google wraps machine-translated reviews as
// "(Translated by Google) … (Original) …". Show what the reviewer wrote.
function originalText(comment: string) {
  const match = /\(Original\)\s*([\s\S]+)$/.exec(comment);
  return (match ? match[1] : comment).trim();
}

async function accessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`token request failed (${res.status})`);
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("token response had no access token");
  return data.access_token;
}

async function getJson<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`${new URL(url).pathname} failed (${res.status})`);
  return (await res.json()) as T;
}

// "accounts/…/locations/…" for Marked's profile: GBP_LOCATION when it's set,
// otherwise the first location titled like Marked, otherwise the first one.
async function findLocation(token: string) {
  if (process.env.GBP_LOCATION) return process.env.GBP_LOCATION;
  const { accounts = [] } = await getJson<{ accounts?: { name: string }[] }>(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    token
  );
  let first = "";
  for (const account of accounts) {
    const { locations = [] } = await getJson<{ locations?: { name: string; title?: string }[] }>(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title&pageSize=100`,
      token
    );
    for (const location of locations) {
      const path = `${account.name}/${location.name}`;
      if (/marked/i.test(location.title ?? "")) return path;
      first ||= path;
    }
  }
  if (!first) throw new Error("no Business Profile location on this account");
  return first;
}

async function liveFeed(): Promise<ReviewFeed | null> {
  const { GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN } = process.env;
  if (!GBP_CLIENT_ID || !GBP_CLIENT_SECRET || !GBP_REFRESH_TOKEN) return null;

  const token = await accessToken(GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_REFRESH_TOKEN);
  const location = await findLocation(token);
  const reviews: Review[] = [];
  let rating = 0;
  let count = 0;
  let pageToken = "";
  // Newest first, up to four pages of 50.
  for (let page = 0; page < 4; page++) {
    const query = new URLSearchParams({ pageSize: "50", orderBy: "updateTime desc" });
    if (pageToken) query.set("pageToken", pageToken);
    const data = await getJson<GbpReviewsPage>(`https://mybusiness.googleapis.com/v4/${location}/reviews?${query}`, token);
    rating = data.averageRating ?? rating;
    count = data.totalReviewCount ?? count;
    for (const r of data.reviews ?? []) {
      const stars = STARS[r.starRating ?? ""];
      const text = r.comment ? originalText(r.comment) : "";
      // Rating-only reviews count toward the average, but have nothing to quote.
      if (!stars || !text) continue;
      const author = r.reviewer?.isAnonymous ? "A Google user" : r.reviewer?.displayName || "A Google user";
      reviews.push(
        withHighlight({
          id: r.reviewId ?? `${author}-${r.createTime}`,
          author,
          photo: r.reviewer?.profilePhotoUrl,
          rating: stars,
          text,
          date: r.createTime ?? "",
        })
      );
    }
    pageToken = data.nextPageToken ?? "";
    if (!pageToken) break;
  }
  if (!count) return null;
  return {
    rating: Math.round(rating * 10) / 10,
    count,
    reviews,
    profileUrl: PROFILE_URL,
    writeReviewUrl: WRITE_REVIEW_URL,
    source: "google",
  };
}

/** The reviews to show: live from Google when the API is set up and
 *  answering, otherwise the copies above. Never throws. */
export async function getReviews(): Promise<ReviewFeed> {
  try {
    const live = await liveFeed();
    if (live) return live;
  } catch (err) {
    console.error("[reviews] live Google reviews unavailable, using the copied ones:", err instanceof Error ? err.message : err);
  }
  return manualFeed();
}
