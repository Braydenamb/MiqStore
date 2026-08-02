import { prisma } from "@/lib/prisma";

export const GUEST_USER_ID = "guest-user-account-id";

/**
 * Ensures a fallback system guest user exists in the database for non-authenticated checkouts.
 */
export async function getOrCreateGuestUser() {
  const existing = await prisma.user.findUnique({
    where: { id: GUEST_USER_ID },
  });

  if (existing) return existing;

  return await prisma.user.create({
    data: {
      id: GUEST_USER_ID,
      email: "guest@miqstore.online",
      name: "Guest Customer",
      role: "USER",
      isActive: true,
    },
  });
}
