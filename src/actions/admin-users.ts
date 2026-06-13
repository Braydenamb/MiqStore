"use server";

import { revalidatePath } from "next/cache";
import { Prisma, Role, MembershipTier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { createAuditLog } from "@/lib/audit-log";

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

    // Parallelize all queries — never run stats serially
    const [users, total, totalAll, resellerCount, adminCount, activeCount] = await Promise.all([
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
      prisma.user.count(),
      prisma.user.count({ where: { role: "RESELLER" } }),
      prisma.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      prisma.user.count({ where: { isActive: true } }),
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

    const stats = {
      total: totalAll,
      reseller: resellerCount,
      admin: adminCount,
      active: activeCount,
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
    const admin = await requireAdmin();

    const oldUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true, email: true },
    });

    const roleEnum = newRole as Role;
    
    await prisma.user.update({
      where: { id },
      data: { role: roleEnum },
    });

    revalidatePath("/admin/users");

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE_USER_ROLE",
      entity: "USER",
      entityId: id,
      oldValues: { role: oldUser?.role, email: oldUser?.email },
      newValues: { role: roleEnum },
    });

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function deleteUser(id: string) {
  try {
    const admin = await requireAdmin();

    const oldUser = await prisma.user.findUnique({
      where: { id },
      select: { email: true, role: true, name: true },
    });

    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE_USER",
      entity: "USER",
      entityId: id,
      oldValues: oldUser as Prisma.InputJsonValue | null,
    });

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function createUser(data: { name: string; email: string; role: string; membership: string }) {
  try {
    const admin = await requireAdmin();

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: data.role as Role,
        membership: data.membership as MembershipTier,
      }
    });
    revalidatePath("/admin/users");

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE_USER",
      entity: "USER",
      entityId: user.id,
      newValues: { name: data.name, email: data.email, role: data.role },
    });

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
