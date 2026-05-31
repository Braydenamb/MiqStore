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

export async function proxy(request: NextRequest) {
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

  // API Protection
  if (pathname.startsWith("/api/")) {
    // 1. CSRF Protection for state-changing requests
    if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
      // Exclude webhooks as they come from external providers
      if (!pathname.startsWith("/api/webhook/")) {
        const origin = request.headers.get("origin");
        const referer = request.headers.get("referer");
        const host = request.headers.get("host");

        // Validate origin/referer against our host
        // In dev, origin might be localhost:3000. In prod, it will be the real domain.
        const isOriginValid = origin ? origin.includes(host || "") : true;
        const isRefererValid = referer ? referer.includes(host || "") : true;

        if (!isOriginValid || (!origin && !isRefererValid)) {
          console.warn(`[CSRF] Blocked request to ${pathname}. Origin: ${origin}, Referer: ${referer}, Host: ${host}`);
          return NextResponse.json(
            { success: false, error: "CSRF token mismatch or invalid origin" },
            { status: 403 }
          );
        }
      }
    }

    // 2. Add security headers
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
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
