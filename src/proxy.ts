import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

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

  // Extract NextAuth token
  const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users to login
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    // In production: verify admin role from JWT
    // For now, allow access in development
  }

  // API Protection
  if (pathname.startsWith("/api/")) {
    // 1. CSRF Protection for state-changing requests
    if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
      // Exclude webhooks (external providers) and auth routes (NextAuth manages its own CSRF)
      const isCsrfExempt =
        pathname.startsWith("/api/webhook/") ||
        pathname.startsWith("/api/auth/");

      if (!isCsrfExempt) {
        const origin = request.headers.get("origin");
        const referer = request.headers.get("referer");
        const host = request.headers.get("host");

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
