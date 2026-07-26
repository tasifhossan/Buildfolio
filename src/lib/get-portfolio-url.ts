/**
 * Domains that do NOT support wildcard subdomains.
 * On these we fall back to path-based URLs: rootDomain/slug
 *
 * - *.vercel.app / *.netlify.app / *.pages.dev  — platform preview domains
 * - localhost* — browsers don't resolve alice.localhost reliably
 */
const NO_WILDCARD_SUFFIXES = [
  ".vercel.app",
  ".netlify.app",
  ".pages.dev",
  "localhost",
];

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
 *  - Custom domain (e.g. `buildfolio.com`) → `https://slug.buildfolio.com`
 *  - Platform / localhost                  → `https://project.vercel.app/slug`
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

  const isNoWildcardDomain =
    isLocalhost ||
    NO_WILDCARD_SUFFIXES.some((suffix) => rootDomain.endsWith(suffix));

  if (isNoWildcardDomain) {
    // Path-based: https://project.vercel.app/slug  or  http://localhost:3000/slug
    return `${protocol}://${rootDomain}/${slug}`;
  }

  // Subdomain-based: https://slug.buildfolio.com
  return `${protocol}://${slug}.${rootDomain}`;
}

