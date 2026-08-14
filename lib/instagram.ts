// Instagram posts for the About-page mosaic, served through Behold
// (behold.so) — it re-hosts media on its CDN (behold.pictures, WebP), so
// image URLs never expire the way raw Instagram CDN links do.
//
// One-time setup:
//   1. behold.so → sign in → connect the @marked__digital Instagram account.
//   2. Create a feed, type "JSON".
//   3. Put its URL in .env.local (and the hosting env):
//        BEHOLD_FEED_URL=https://feeds.behold.so/…
//
// Until that variable exists (or if the fetch ever fails) getInstagramPosts
// returns [] and the mosaic simply renders without Instagram tiles — the
// page never breaks on a missing/expired feed.

export type IgPost = {
  id: string;
  permalink: string;
  // behold.pictures WebP, ~700px wide (their "medium" size)
  imageUrl: string;
  isVideo: boolean;
  caption: string;
};

// The slice of Behold's post shape we read (https://behold.so/docs/json-feeds/).
type BeholdSize = { mediaUrl?: string };
type BeholdPost = {
  id?: string | number;
  permalink?: string;
  mediaType?: string; // IMAGE | VIDEO | CAROUSEL_ALBUM
  isReel?: boolean;
  mediaUrl?: string;
  thumbnailUrl?: string; // video posts only
  prunedCaption?: string;
  caption?: string;
  sizes?: { small?: BeholdSize; medium?: BeholdSize; large?: BeholdSize; full?: BeholdSize };
};

/** Defensive mapping from a Behold feed payload to the mosaic's shape.
 *  Anything missing a permalink or a usable image is dropped. */
export function parseBeholdFeed(data: unknown, limit = 6): IgPost[] {
  const posts = Array.isArray((data as { posts?: unknown })?.posts) ? ((data as { posts: BeholdPost[] }).posts) : [];
  return posts
    .map((p): IgPost => {
      const isVideo = p.mediaType === "VIDEO";
      const imageUrl = p.sizes?.medium?.mediaUrl ?? p.sizes?.small?.mediaUrl ?? (isVideo ? p.thumbnailUrl : p.mediaUrl) ?? "";
      return {
        id: String(p.id ?? p.permalink ?? ""),
        permalink: typeof p.permalink === "string" ? p.permalink : "",
        imageUrl,
        isVideo,
        caption: (typeof p.prunedCaption === "string" && p.prunedCaption) || (typeof p.caption === "string" && p.caption) || "",
      };
    })
    .filter((p) => p.permalink && p.imageUrl)
    .slice(0, limit);
}

export async function getInstagramPosts(limit = 6): Promise<IgPost[]> {
  const url = process.env.BEHOLD_FEED_URL;
  if (!url) return [];
  try {
    // Refetched at most every 30 minutes — new posts appear on their own
    // without hammering the feed on every request.
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    return parseBeholdFeed(await res.json(), limit);
  } catch {
    return [];
  }
}
