import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validation
    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: parsedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedData.data;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Persist to Database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Optional: you can generate a referral code here
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });

    // We don't want to return the password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "Registration successful", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
