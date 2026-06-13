"use server";

import { revalidatePath } from "next/cache";
import { Prisma, TransactionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { createAuditLog } from "@/lib/audit-log";

export async function getAdminOrders(
  page: number = 1,
  limit: number = 20,
  search: string = "",
  statusFilter: string = "all"
) {
  try {
    await requireAdmin();

    const skip = (page - 1) * limit;

    const whereCondition: Prisma.TransactionWhereInput = {};

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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function updateOrderStatus(dbId: string, newStatus: string) {
  try {
    const admin = await requireAdmin();

    const statusEnum = newStatus.toUpperCase() as TransactionStatus;

    const oldTx = await prisma.transaction.findUnique({
      where: { id: dbId },
      select: { status: true, invoiceId: true },
    });

    await prisma.transaction.update({
      where: { id: dbId },
      data: { status: statusEnum },
    });

    revalidatePath("/admin/orders");

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE_ORDER_STATUS",
      entity: "TRANSACTION",
      entityId: dbId,
      oldValues: { status: oldTx?.status, invoiceId: oldTx?.invoiceId },
      newValues: { status: statusEnum },
    });

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
