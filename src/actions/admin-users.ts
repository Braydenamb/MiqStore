"use server";

import { revalidatePath } from "next/cache";
import { Prisma, Role, MembershipTier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function getAdminUsers(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  roleFilter: string = "all"
) {
  try {
    await requireAdmin();

    const skip = (page - 1) * limit;

    const whereCondition: Prisma.UserWhereInput = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (roleFilter !== "all") {
      whereCondition.role = roleFilter as Role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          _count: {
            select: { transactions: true }
          }
        }
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    const mappedUsers = users.map((u) => ({
      id: u.id,
      name: u.name || "User",
      email: u.email || "-",
      role: u.role,
      membership: u.membership,
      transactions: u._count.transactions,
      isActive: u.isActive,
      joinDate: new Date(u.createdAt).toLocaleDateString("id-ID"),
    }));

    // Generate stats
    const stats = {
      total: await prisma.user.count(),
      reseller: await prisma.user.count({ where: { role: "RESELLER" } }),
      admin: await prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      active: await prisma.user.count({ where: { isActive: true } }),
    };

    return { 
      success: true, 
      data: { 
        users: mappedUsers, 
        total, 
        totalPages: Math.ceil(total / limit),
        stats
      } 
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function updateUserRole(id: string, newRole: string) {
  try {
    await requireAdmin();

    const roleEnum = newRole as Role;
    
    await prisma.user.update({
      where: { id },
      data: { role: roleEnum },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function deleteUser(id: string) {
  try {
    await requireAdmin();

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function createUser(data: { name: string; email: string; role: string; membership: string }) {
  try {
    await requireAdmin();

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role as Role,
        membership: data.membership as MembershipTier,
      }
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
