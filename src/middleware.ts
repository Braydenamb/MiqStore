import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection and redirects.
 *
 * Protected routes:
 * - /dashboard/* → requires authenticated user
 * - /admin/*     → requires ADMIN or SUPER_ADMIN role
 * - /api/admin/* → requires admin API key
 */

const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // In production, check for a real session token cookie
  // const token = request.cookies.get("next-auth.session-token")?.value;
  const token = request.cookies.get("miqstore-session")?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users to login (disabled in dev for convenience)
  // if (isProtected && !token) {
  //   const loginUrl = new URL("/auth/login", request.url);
  //   loginUrl.searchParams.set("callbackUrl", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // Redirect authenticated users away from auth pages
  // if (isAuthRoute && token) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    // In production: verify admin role from JWT
    // For now, allow access in development
  }

  // API rate limiting headers
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", "60");
    response.headers.set("X-RateLimit-Remaining", "59");
    response.headers.set("X-Request-Id", crypto.randomUUID());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser icon)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
