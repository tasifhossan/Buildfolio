import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // 1. Get host and determine subdomain
  const host = req.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  let subdomain = "";
  if (host.endsWith(rootDomain)) {
    if (host === rootDomain) {
      subdomain = "";
    } else {
      subdomain = host.slice(0, -(rootDomain.length + 1));
    }
  } else if (host.endsWith("localhost:3000")) {
    if (host === "localhost:3000") {
      subdomain = "";
    } else {
      subdomain = host.slice(0, -("localhost:3000".length + 1));
    }
  }

  // Redirect /dashboard and /login on any non-root subdomain to the root domain equivalent
  const isDashboardOrLogin =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/") ||
    pathname === "/login" || pathname.startsWith("/login/");

  if (subdomain && subdomain !== "www" && isDashboardOrLogin) {
    const redirectUrl = nextUrl.clone();
    const [domainHost, domainPort] = rootDomain.split(":");
    redirectUrl.hostname = domainHost === "localhost" ? "localhost." : domainHost;
    redirectUrl.port = domainPort || "";
    const redirectTarget = redirectUrl.toString();
    return new Response(null, {
      status: 307,
      headers: {
        Location: redirectTarget,
      },
    });
  }

  // 2. Skip subdomain rewrite for reserved app routes
  const reservedPaths = ["/api", "/signup", "/login", "/dashboard"];
  const isReserved = reservedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // 3. If subdomain exists and is not 'www' or empty, and is not a reserved path, rewrite request internally to /[subdomain]
  if (subdomain && subdomain !== "www" && !isReserved) {
    return NextResponse.rewrite(new URL(`/${subdomain}${pathname}${nextUrl.search}`, req.url));
  }

  // 3. Otherwise, check for normal routing logic: protect all routes under /dashboard
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all paths except static assets, API routes and files with extensions
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
