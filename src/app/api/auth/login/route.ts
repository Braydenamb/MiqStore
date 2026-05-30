import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";

/**
 * POST /api/auth/login
 * Authenticate user with email/password.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return API_ERRORS.validation({
        email: !email ? ["Email wajib diisi"] : [],
        password: !password ? ["Password wajib diisi"] : [],
      });
    }

    // Mock authentication — in production, validate against database
    if (email === "admin@miqstore.com" && password === "admin123") {
      return apiSuccess(
        {
          user: {
            id: "usr_admin_001",
            name: "Super Admin",
            email: "admin@miqstore.com",
            role: "SUPER_ADMIN",
            membership: "DIAMOND",
          },
          token: "mock-admin-jwt-token",
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        { message: "Login berhasil" }
      );
    }

    if (password.length >= 8) {
      return apiSuccess(
        {
          user: {
            id: "usr_" + Date.now().toString(36),
            name: email.split("@")[0],
            email,
            role: "USER",
            membership: "BRONZE",
          },
          token: "mock-user-jwt-token",
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
        },
        { message: "Login berhasil" }
      );
    }

    return apiError("Email atau password salah", {
      status: 401,
      code: "INVALID_CREDENTIALS",
    });
  } catch {
    return API_ERRORS.internal();
  }
}
