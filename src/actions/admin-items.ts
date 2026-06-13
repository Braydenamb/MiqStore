"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { createAuditLog } from "@/lib/audit-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ItemFormData {
  gameId: string;
  name: string;
  description?: string;
  amount: number;
  price: number;
  originalPrice?: number;
  resellerPrice?: number;
  isActive: boolean;
  isPopular: boolean;
  order?: number;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getGameItems(
  gameId: string,
  filters: { status?: "all" | "active" | "inactive"; q?: string } = {}
) {
  try {
    await requireAdmin();
    const where: Record<string, unknown> = { productId: gameId };

    if (filters.status === "active") where.isActive = true;
    if (filters.status === "inactive") where.isActive = false;

    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: "insensitive" } },
        { description: { contains: filters.q, mode: "insensitive" } },
      ];
    }

    const items = await prisma.productItem.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: {
        _count: { select: { transactions: true } },
      },
    });

    return { success: true, data: items };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg, data: [] };
  }
}

// ─── Create / Update ──────────────────────────────────────────────────────────

export async function createItem(data: ItemFormData) {
  try {
    const admin = await requireAdmin();
    // Auto-set order to end of list
    const lastItem = await prisma.productItem.findFirst({
      where: { productId: data.gameId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const item = await prisma.productItem.create({
      data: {
        productId: data.gameId,
        name: data.name,
        description: data.description || null,
        amount: data.amount,
        price: data.price,
        originalPrice: data.originalPrice || null,
        resellerPrice: data.resellerPrice || null,
        isActive: data.isActive,
        isPopular: data.isPopular,
        order: data.order ?? (lastItem?.order ?? 0) + 1,
      },
    });

    revalidatePath(`/admin/games/${data.gameId}/items`);
    revalidatePath("/admin/games");

    await createAuditLog({
      adminId: admin.id,
      action: "CREATE_ITEM",
      entity: "PRODUCT_ITEM",
      entityId: item.id,
      newValues: { name: item.name, price: item.price, amount: item.amount },
    });

    return { success: true, data: item };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function updateItem(id: string, data: Partial<ItemFormData>) {
  try {
    const admin = await requireAdmin();

    const oldItem = await prisma.productItem.findUnique({
      where: { id },
      select: { name: true, price: true, amount: true, isActive: true },
    });

    const item = await prisma.productItem.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.originalPrice !== undefined && {
          originalPrice: data.originalPrice || null,
        }),
        ...(data.resellerPrice !== undefined && {
          resellerPrice: data.resellerPrice || null,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    revalidatePath(`/admin/games/${item.productId}/items`);

    await createAuditLog({
      adminId: admin.id,
      action: "UPDATE_ITEM",
      entity: "PRODUCT_ITEM",
      entityId: id,
      oldValues: oldItem as Prisma.InputJsonValue | null,
      newValues: { name: item.name, price: item.price, isActive: item.isActive },
    });

    return { success: true, data: item };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function deleteItem(id: string) {
  try {
    const admin = await requireAdmin();
    const oldItem = await prisma.productItem.findUnique({
      where: { id },
      select: { name: true, price: true, productId: true },
    });
    const item = await prisma.productItem.delete({ where: { id } });
    revalidatePath(`/admin/games/${item.productId}/items`);
    revalidatePath("/admin/games");

    await createAuditLog({
      adminId: admin.id,
      action: "DELETE_ITEM",
      entity: "PRODUCT_ITEM",
      entityId: id,
      oldValues: oldItem as Prisma.InputJsonValue | null,
    });

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

// ─── Bulk Operations ──────────────────────────────────────────────────────────

export async function bulkUpdateItemStatus(
  ids: string[],
  isActive: boolean,
  gameId: string
) {
  try {
    const admin = await requireAdmin();
    await prisma.productItem.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });

    revalidatePath(`/admin/games/${gameId}/items`);
    revalidatePath("/admin/games");

    await createAuditLog({
      adminId: admin.id,
      action: isActive ? "BULK_ACTIVATE_ITEMS" : "BULK_DEACTIVATE_ITEMS",
      entity: "PRODUCT_ITEM",
      entityId: gameId,
      newValues: { ids, isActive, count: ids.length },
    });

    return { success: true, updated: ids.length };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function bulkDeleteItems(ids: string[], gameId: string) {
  try {
    const admin = await requireAdmin();
    await prisma.productItem.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath(`/admin/games/${gameId}/items`);
    revalidatePath("/admin/games");

    await createAuditLog({
      adminId: admin.id,
      action: "BULK_DELETE_ITEMS",
      entity: "PRODUCT_ITEM",
      entityId: gameId,
      oldValues: { deletedIds: ids, count: ids.length },
    });

    return { success: true, deleted: ids.length };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function bulkAdjustPrice(
  ids: string[],
  percentageChange: number,
  gameId: string
) {
  try {
    const admin = await requireAdmin();
    // Fetch current prices
    const items = await prisma.productItem.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true, name: true },
    });

    const oldPrices = Object.fromEntries(items.map((i) => [i.id, { name: i.name, price: i.price }]));

    // Update each item with rounded new price
    await Promise.all(
      items.map((item) => {
        const newPrice = Math.round(item.price * (1 + percentageChange / 100));
        return prisma.productItem.update({
          where: { id: item.id },
          data: { price: Math.max(0, newPrice) },
        });
      })
    );

    revalidatePath(`/admin/games/${gameId}/items`);

    await createAuditLog({
      adminId: admin.id,
      action: "BULK_ADJUST_PRICE",
      entity: "PRODUCT_ITEM",
      entityId: gameId,
      oldValues: oldPrices,
      newValues: { percentageChange, affectedCount: ids.length },
    });

    return { success: true, updated: ids.length };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function reorderItems(
  gameId: string,
  orderedIds: string[]
) {
  try {
    const admin = await requireAdmin();
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.productItem.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath(`/admin/games/${gameId}/items`);

    await createAuditLog({
      adminId: admin.id,
      action: "REORDER_ITEMS",
      entity: "PRODUCT_ITEM",
      entityId: gameId,
      newValues: { orderedIds },
    });

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
