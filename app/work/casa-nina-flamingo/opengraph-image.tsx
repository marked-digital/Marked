// This page declares its own openGraph block, and nested metadata objects
// replace the layout's rather than merge with it, so the root card
// (app/opengraph-image.tsx) wouldn't reach this route. Re-exporting it here
// puts the same og:image back on this segment.
export { default, alt, size, contentType } from "../../opengraph-image";
