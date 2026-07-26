/**
 * Domains that do NOT support wildcard subdomains — they only allow
 * wildcard subdomains on user-owned custom domains, not on their own
 * platform suffix. On these, we fall back to path-based URLs.
 */
const NO_WILDCARD_SUFFIXES = [".vercel.app", ".netlify.app", ".pages.dev"];

/**
 * Generates the public URL for a portfolio slug.
 *
 * - **Custom domain** (e.g. `buildfolio.com`):
 *   Returns subdomain-style → `https://slug.buildfolio.com`
 *
 * - **localhost** (dev):
 *   Returns subdomain-style → `http://slug.localhost:3000`
 *
 * - **Platform preview domain** (e.g. `project.vercel.app`):
 *   Falls back to path-based → `https://project.vercel.app/slug`
 *   because wildcard subdomains aren't available on these suffixes.
 */
export function getPortfolioUrl(slug: string): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const protocol = rootDomain.includes("localhost") ? "http" : "https";

  const isNoWildcardDomain = NO_WILDCARD_SUFFIXES.some((suffix) =>
    rootDomain.endsWith(suffix)
  );

  if (isNoWildcardDomain) {
    // Path-based fallback: https://project.vercel.app/slug
    return `${protocol}://${rootDomain}/${slug}`;
  }

  // Subdomain-based: https://slug.buildfolio.com or http://slug.localhost:3000
  return `${protocol}://${slug}.${rootDomain}`;
}
