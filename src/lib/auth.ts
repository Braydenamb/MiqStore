import { NextRequest } from "next/server";

/**
 * NextAuth Configuration
 *
 * When connecting to a real database, install next-auth and configure:
 *   import NextAuth from "next-auth";
 *   import { PrismaAdapter } from "@auth/prisma-adapter";
 *   import GoogleProvider from "next-auth/providers/google";
 *   import CredentialsProvider from "next-auth/providers/credentials";
 *
 * For now, this module provides mock auth helpers used across the app.
 */

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "RESELLER" | "ADMIN" | "SUPER_ADMIN";
  membership: "BRONZE" | "SILVER" | "GOLD" | "DIAMOND";
  avatar?: string;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

// Mock session for development
const MOCK_USER: SessionUser = {
  id: "usr_dev_001",
  name: "Miq User",
  email: "miq@email.com",
  role: "USER",
  membership: "GOLD",
  avatar: undefined,
};

const MOCK_ADMIN: SessionUser = {
  id: "usr_admin_001",
  name: "Super Admin",
  email: "admin@miqstore.com",
  role: "SUPER_ADMIN",
  membership: "DIAMOND",
};

/**
 * Get the current session from the request.
 * In production, this would verify a JWT or session cookie.
 */
export async function getSession(req?: NextRequest): Promise<Session | null> {
  // In development, return mock session
  // In production, verify JWT from cookie/header
  const authHeader = req?.headers.get("authorization");
  if (authHeader === "Bearer admin-token") {
    return { user: MOCK_ADMIN, expires: new Date(Date.now() + 86400000).toISOString() };
  }

  // For demo: always return a user session
  return { user: MOCK_USER, expires: new Date(Date.now() + 86400000).toISOString() };
}

/**
 * Get current session (server component / API route).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Check if user has a specific role.
 */
export function hasRole(user: SessionUser, roles: SessionUser["role"][]): boolean {
  return roles.includes(user.role);
}

/**
 * Check if user is admin.
 */
export function isAdmin(user: SessionUser): boolean {
  return hasRole(user, ["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Generate a mock JWT token (for development).
 */
export function generateToken(user: SessionUser): string {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}
