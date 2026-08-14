// Real brand logos for the Tech Stack, sourced from Simple Icons (CC0 icon
// data; trademarks belong to their owners — used here nominatively to denote
// the tools in our stack). Each icon is a single 24×24 SVG path.
//
// Note: several major vendors (AWS, Azure, OpenAI, Salesforce, Adobe, Amazon,
// Microsoft, Klaviyo, Ahrefs, LinkedIn, Walmart, VS Code) have been removed from
// Simple Icons at the trademark owners' request, so those tools fall back to
// their monogram chip.
import {
  siClaude,
  siAda,
  siZapier,
  siMake,
  siN8n,
  siShopify,
  siBigcommerce,
  siWoocommerce,
  siGooglecloud,
  siVercel,
  siGithub,
  siBitbucket,
  siGoogleanalytics,
  siGoogletagmanager,
  siGoogleads,
  siMeta,
  siTiktok,
  siPinterest,
  siReddit,
  siHubspot,
  siMailchimp,
  siSemrush,
  siWordpress,
  siZendesk,
  siSap,
  siSage,
  siIntuit,
  siStripe,
  siAdyen,
  siPaypal,
  siLighthouse,
  siHotjar,
  siCloudflare,
  siPostman,
  siDocker,
  siJira,
  siFigma,
  siContentful,
  siPrismic,
  siDrupal,
  siSanity,
  siGooglebigquery,
  siAirtable,
  siConfluence,
  siInstagram,
} from "simple-icons";

// slug -> SVG path data (viewBox 0 0 24 24)
export const ICON_PATHS: Record<string, string> = {
  claude: siClaude.path,
  ada: siAda.path,
  zapier: siZapier.path,
  make: siMake.path,
  n8n: siN8n.path,
  shopify: siShopify.path,
  bigcommerce: siBigcommerce.path,
  woocommerce: siWoocommerce.path,
  googlecloud: siGooglecloud.path,
  vercel: siVercel.path,
  github: siGithub.path,
  bitbucket: siBitbucket.path,
  googleanalytics: siGoogleanalytics.path,
  googletagmanager: siGoogletagmanager.path,
  googleads: siGoogleads.path,
  meta: siMeta.path,
  tiktok: siTiktok.path,
  pinterest: siPinterest.path,
  reddit: siReddit.path,
  hubspot: siHubspot.path,
  mailchimp: siMailchimp.path,
  semrush: siSemrush.path,
  wordpress: siWordpress.path,
  zendesk: siZendesk.path,
  sap: siSap.path,
  sage: siSage.path,
  intuit: siIntuit.path,
  stripe: siStripe.path,
  adyen: siAdyen.path,
  paypal: siPaypal.path,
  lighthouse: siLighthouse.path,
  hotjar: siHotjar.path,
  cloudflare: siCloudflare.path,
  postman: siPostman.path,
  docker: siDocker.path,
  jira: siJira.path,
  figma: siFigma.path,
  contentful: siContentful.path,
  prismic: siPrismic.path,
  drupal: siDrupal.path,
  sanity: siSanity.path,
  googlebigquery: siGooglebigquery.path,
  airtable: siAirtable.path,
  confluence: siConfluence.path,
  // Social glyphs for the site's own profiles (About page, footers).
  // Instagram comes from Simple Icons; LinkedIn was removed from Simple Icons
  // at the owner's request, so its ubiquitous 24×24 "in" mark is inlined here
  // (used nominatively to link to our own LinkedIn page).
  instagram: siInstagram.path,
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
};

export function iconPath(slug?: string): string | undefined {
  return slug ? ICON_PATHS[slug] : undefined;
}
