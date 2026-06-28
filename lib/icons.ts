// Real brand logos for the Tech Stack, sourced from Simple Icons (CC0 icon
// data; trademarks belong to their owners — used here nominatively to denote
// the tools in our stack). Each icon is a single 24×24 SVG path.
//
// Note: several major vendors (AWS, Azure, OpenAI, Salesforce, Adobe, Amazon,
// Microsoft, Klaviyo, Ahrefs) have been removed from Simple Icons at the
// trademark owners' request, so those tools fall back to their monogram chip.
import {
  siClaude,
  siAda,
  siZapier,
  siMake,
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
} from "simple-icons";

// slug -> SVG path data (viewBox 0 0 24 24)
export const ICON_PATHS: Record<string, string> = {
  claude: siClaude.path,
  ada: siAda.path,
  zapier: siZapier.path,
  make: siMake.path,
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
};

export function iconPath(slug?: string): string | undefined {
  return slug ? ICON_PATHS[slug] : undefined;
}
