import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { edgeRedisGet } from "@/lib/edge-redis";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // ── Maintenance Mode Check ────────────────────────────────────────────────
    // Skip maintenance check for admin routes, maintenance page itself, API health, and static assets
    const isMaintenanceExempt =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/maintenance") ||
      pathname.startsWith("/api/health") ||
      pathname.startsWith("/api/webhook") ||
      pathname.startsWith("/_next");

    if (!isMaintenanceExempt) {
      // Admin users bypass maintenance mode
      const isAdmin = token?.role === "ADMIN" || token?.role === "SUPER_ADMIN";

      if (!isAdmin) {
        const maintenanceFlag = await edgeRedisGet("miqstore:maintenance_mode");
        if (maintenanceFlag === "true") {
          return NextResponse.redirect(new URL("/maintenance", req.url));
        }
      }
    }

    // ── Redirect logged-in users away from auth pages ─────────────────────────
    if (
      token &&
      (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ── Protect admin routes ──────────────────────────────────────────────────
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    const response = NextResponse.next();
    
    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        // Auth pages: always allow (so logged-in users get redirected, not blocked)
        if (pathname.startsWith("/auth/")) return true;
        // Maintenance page: always allow
        if (pathname.startsWith("/maintenance")) return true;
        // Public routes: allow without login
        if (pathname === "/" || pathname.startsWith("/games")) return true;
        // Dashboard and admin: require token
        return !!token;
      },
    },
  }
);

// Match all routes that need middleware processing
// (public routes included for maintenance mode enforcement)
export const config = {
  matcher: [
    "/",
    "/games/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
