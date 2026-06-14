import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/telemetry";
import { authLimiter, getClientIP, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rateLimitKey = getClientIP(req);
    const rlResult = await authLimiter.check(rateLimitKey);
    if (!rlResult.allowed) {
      return rateLimitResponse(rlResult, authLimiter);
    }

    const body = await req.json();

    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    logger.info("New user registered", { email: userWithoutPassword.email, userId: userWithoutPassword.id });

    return NextResponse.json(
      { message: "Registration successful", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Register error", { error: error instanceof Error ? error.stack : error });
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
