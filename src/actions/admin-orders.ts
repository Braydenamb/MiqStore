"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, TransactionStatus } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getAdminOrders(
  page: number = 1,
  limit: number = 20,
  search: string = "",
  statusFilter: string = "all"
) {
  try {
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        { invoiceId: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { product: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (statusFilter !== "all") {
      whereCondition.status = statusFilter.toUpperCase() as TransactionStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereCondition,
        include: {
          user: { select: { id: true, name: true, email: true } },
          product: { select: { name: true } },
          productItem: { select: { name: true } },
          payment: { select: { method: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: whereCondition }),
    ]);

    const mappedOrders = orders.map((tx) => ({
      id: tx.invoiceId,
      dbId: tx.id,
      user: tx.user?.name || tx.user?.email || "Unknown User",
      userId: tx.user?.id || "-",
      game: tx.product.name,
      product: tx.productItem.name,
      payment: tx.payment?.method || "Unknown",
      total: tx.total,
      status: tx.status.toLowerCase(),
      date: new Date(tx.createdAt).toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return { success: true, data: { orders: mappedOrders, total, totalPages: Math.ceil(total / limit) } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatus(dbId: string, newStatus: string) {
  try {
    const statusEnum = newStatus.toUpperCase() as TransactionStatus;
    
    await prisma.transaction.update({
      where: { id: dbId },
      data: { status: statusEnum },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
