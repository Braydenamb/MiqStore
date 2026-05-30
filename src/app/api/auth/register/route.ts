import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { registerSchema } from "@/lib/validators";

/**
 * POST /api/auth/register
 * Register a new user account.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return API_ERRORS.validation(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
            k,
            v ?? [],
          ])
        )
      );
    }

    const { name, email, phone } = parsed.data;

    // Mock: check email uniqueness
    if (email === "admin@miqstore.com") {
      return API_ERRORS.validation({
        email: ["Email sudah terdaftar"],
      });
    }

    // Mock: create user
    const user = {
      id: "usr_" + Date.now().toString(36),
      name,
      email,
      phone: phone || null,
      role: "USER" as const,
      membership: "BRONZE" as const,
      rewardPoints: 0,
      referralCode: `MIQ${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(
      {
        user,
        token: "mock-jwt-" + user.id,
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        message: "Registrasi berhasil! Selamat datang di MiqStore.",
        status: 201,
      }
    );
  } catch {
    return API_ERRORS.internal();
  }
}
