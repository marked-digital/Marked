# Custom platform logos

Drop brand logos here as **SVG** files. They're picked up automatically — no
code changes needed — on both the Tech Stack page tiles and the homepage
"Embedded in your workflow" cluster.

## How it works

Each platform in `lib/md.ts` resolves its glyph in this order:

1. **`/public/logos/<localLogo>.svg`** — a file in this folder (highest priority)
2. **Simple Icons** built-in vector (for platforms with an `icon` slug)
3. **Monogram chip** — the colored letters, as a final fallback

So adding a file here is all it takes; if the file is missing we silently fall
back, with no broken-image flash.

## Filenames to drop in

These platforms have no Simple Icons logo (their marks were removed at the
trademark owners' request) and currently show a monogram. Add a matching file
to replace it:

| Platform           | File to add               |
| ------------------ | ------------------------- |
| OpenAI             | `openai.svg`              |
| Adobe Commerce     | `adobe-commerce.svg`      |
| Amazon Marketplace | `amazon.svg`              |
| Amazon Ads         | `amazon-ads.svg`          |
| AWS                | `aws.svg`                 |
| Microsoft Azure    | `azure.svg`               |
| Microsoft Ads      | `microsoft-ads.svg`       |
| Klaviyo            | `klaviyo.svg`             |
| Salesforce         | `salesforce.svg`          |
| Ahrefs             | `ahrefs.svg`              |
| Screaming Frog     | `screaming-frog.svg`      |

## Notes / tips

- **Want to override a logo that already has one?** Add a `localLogo: "<slug>"`
  field to that tool in `lib/md.ts` and drop `<slug>.svg` here — the custom file
  wins over the built-in vector.
- For the **canvas cluster**, give the SVG an explicit `viewBox` (and ideally
  `width`/`height`) so it rasterizes crisply when drawn. Square artboards look
  best — they're scaled into a circular chip.
- These logos render full-color (not tinted), so use each brand's official
  colored mark. Prefer official press-kit / brand-guideline SVGs.
