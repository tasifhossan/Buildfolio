/**
 * Generates the appropriate public URL for a portfolio using a subdomain style.
 * E.g., http://slug.localhost:3000 or https://slug.rootdomain.com
 */
export function getPortfolioUrl(slug: string): string {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const protocol = rootDomain.includes("localhost") ? "http" : "https";
  return `${protocol}://${slug}.${rootDomain}`;
}
