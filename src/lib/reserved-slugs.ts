export const RESERVED_SLUGS = new Set<string>([
  "api",
  "signup",
  "login",
  "dashboard",
  "logout",
  "admin",
  "www",
  "help",
  "about",
  "contact",
  "blog",
  "pricing",
  "settings",
  "static",
  "public",
  "assets",
  "favicon",
  "robots",
  "sitemap",
  "mail",
  "ftp",
  "support",
  "terms",
  "privacy",
  "docs",
  "app",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.trim().toLowerCase());
}
