"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, Role } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getAdminUsers(
  page: number = 1,
  limit: number = 10,
  search: string = "",
  roleFilter: string = "all"
) {
  try {
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

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
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(id: string, newRole: string) {
  try {
    const roleEnum = newRole as Role;
    
    await prisma.user.update({
      where: { id },
      data: { role: roleEnum },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
