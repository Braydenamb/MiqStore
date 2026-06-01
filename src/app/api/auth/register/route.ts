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
    console.log("REGISTER ROUTE HIT");

    const body = await req.json();
    console.log("BODY:", body);

    const parsedData = registerSchema.safeParse(body);
    if (!parsedData.success) {
      console.log("VALIDATION FAILED");
      return NextResponse.json(
        { message: parsedData.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsedData.data;

    console.log("CHECKING USER");
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    console.log("USER CHECK DONE");

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    console.log("HASHING PASSWORD");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("CREATING USER");
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });
    console.log("USER CREATED", newUser.id);

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "Registration successful", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
