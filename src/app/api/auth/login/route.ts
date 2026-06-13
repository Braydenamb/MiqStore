import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { authLimiter, getClientIP, rateLimitResponse } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

/**
 * POST /api/auth/login
 * Authenticate user with email/password via real DB validation.
 * Rate limited: 10 req/min per IP.
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limit to prevent brute force
    const ip = getClientIP(req);
    const rateResult = await authLimiter.check(ip);
    if (!rateResult.allowed) {
      return rateLimitResponse(rateResult, authLimiter);
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return API_ERRORS.validation({
        email: parsed.error.flatten().fieldErrors.email ?? [],
        password: parsed.error.flatten().fieldErrors.password ?? [],
      });
    }

    const { email, password } = parsed.data;

    // Look up user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        membership: true,
        isActive: true,
      },
    });

    if (!user || !user.password) {
      return apiError("Email atau password salah", {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });
    }

    if (!user.isActive) {
      return apiError("Akun Anda telah dinonaktifkan", {
        status: 403,
        code: "ACCOUNT_DISABLED",
      });
    }

    // Verify password against hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return apiError("Email atau password salah", {
        status: 401,
        code: "INVALID_CREDENTIALS",
      });
    }

    return apiSuccess(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          membership: user.membership,
        },
      },
      { message: "Login berhasil" }
    );
  } catch {
    return API_ERRORS.internal();
  }
}
