import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Server-side auth guard that verifies the current user is an admin.
 * Throws an error if the user is not authenticated or lacks admin role.
 * Use in all admin server actions.
 */
export async function requireAdmin(): Promise<{ id: string; email: string; role: string }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: not authenticated");
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new Error("Forbidden: admin role required");
  }

  return {
    id: session.user.id,
    email: session.user.email || "",
    role,
  };
}
