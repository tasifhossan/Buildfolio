/**
 * Platform preview domains that do NOT support wildcard subdomains.
 * On these we fall back to path-based URLs: rootDomain/slug
 *
 * Once a real custom domain is configured, subdomain routing kicks in
 * automatically — no code changes needed.
 */
const NO_WILDCARD_SUFFIXES = [".vercel.app", ".netlify.app", ".pages.dev"];

/**
 * Generates the public URL for a portfolio slug.
 *
 * Resolution order for the root domain:
 *  1. `NEXT_PUBLIC_ROOT_DOMAIN` env var (set explicitly in Vercel / .env)
 *  2. `window.location.host` — detected at runtime when called from a
 *     client component (e.g. the dashboard "View Site" button)
 *  3. Hard fallback: `"localhost:3000"`
 *
 * URL style:
 *  - localhost / custom domain → subdomain: `http://slug.localhost:3000`
 *                                            `https://slug.buildfolio.com`
 *  - Platform preview domain  → path-based: `https://project.vercel.app/slug`
 */
export function getPortfolioUrl(slug: string): string {
  // 1. Prefer the explicitly configured root domain
  // 2. Fall back to the actual current hostname (works in client components)
  // 3. Last-resort fallback for SSR/build contexts
  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    (typeof window !== "undefined" ? window.location.host : "localhost:3000");

  const isLocalhost = rootDomain.startsWith("localhost");
  const protocol = isLocalhost ? "http" : "https";

  const isNoWildcardDomain = NO_WILDCARD_SUFFIXES.some((suffix) =>
    rootDomain.endsWith(suffix)
  );

  if (isNoWildcardDomain) {
    // Path-based fallback: https://project.vercel.app/slug
    return `${protocol}://${rootDomain}/${slug}`;
  }

  // Subdomain-based: http://slug.localhost:3000  or  https://slug.buildfolio.com
  return `${protocol}://${slug}.${rootDomain}`;
}
