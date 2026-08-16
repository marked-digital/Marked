import type { MetadataRoute } from "next";

// Serves /sitemap.xml. Add a line when a route ships — the case-study list
// is short enough that hand-maintaining beats generating.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://marked-digital.com";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/book`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/approach`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/stack`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/work/ontario-education-online`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/work/roadpost`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  ];
}
