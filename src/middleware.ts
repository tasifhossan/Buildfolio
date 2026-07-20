import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Protect all routes under /dashboard
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Run middleware on all paths except static assets and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
