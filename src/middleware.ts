import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect auth pages from logged in users
    if (
      token &&
      (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      // If user is not admin (or super_admin), redirect them
      if (token?.role !== "ADMIN" && token?.role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true if user is trying to access auth pages so they aren't blocked from logging in
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;
        if (pathname.startsWith("/auth/")) return true;
        
        // For /dashboard and /admin, require token
        return !!token;
      },
    },
  }
);

// Protect dashboard, admin, and match auth pages to redirect logged in users
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register"
  ],
};
