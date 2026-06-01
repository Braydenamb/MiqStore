import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Redirect authenticated users away from auth pages
    if (
      token &&
      (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register"))
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We handle authorization logic above or let the pages handle it
    },
  }
);

// Protect dashboard and match auth pages to redirect logged in users
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
