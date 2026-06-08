"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ItemFormData {
  gameId: string;
  name: string;
  description?: string;
  amount: number;
  price: number;
  originalPrice?: number;
  resellerPrice?: number;
  providerCode?: string;
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
    const where: Record<string, unknown> = { productId: gameId };

    if (filters.status === "active") where.isActive = true;
    if (filters.status === "inactive") where.isActive = false;

    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: "insensitive" } },
        { providerCode: { contains: filters.q, mode: "insensitive" } },
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
        providerCode: data.providerCode || null,
        isActive: data.isActive,
        isPopular: data.isPopular,
        order: data.order ?? (lastItem?.order ?? 0) + 1,
      },
    });

    revalidatePath(`/admin/games/${data.gameId}/items`);
    revalidatePath("/admin/games");
    return { success: true, data: item };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function updateItem(id: string, data: Partial<ItemFormData>) {
  try {
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
        ...(data.providerCode !== undefined && {
          providerCode: data.providerCode || null,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    revalidatePath(`/admin/games/${item.productId}/items`);
    return { success: true, data: item };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function deleteItem(id: string) {
  try {
    const item = await prisma.productItem.delete({ where: { id } });
    revalidatePath(`/admin/games/${item.productId}/items`);
    revalidatePath("/admin/games");
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
    await prisma.productItem.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });

    revalidatePath(`/admin/games/${gameId}/items`);
    revalidatePath("/admin/games");
    return { success: true, updated: ids.length };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function bulkDeleteItems(ids: string[], gameId: string) {
  try {
    await prisma.productItem.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath(`/admin/games/${gameId}/items`);
    revalidatePath("/admin/games");
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
    // Fetch current prices
    const items = await prisma.productItem.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true },
    });

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
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.productItem.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath(`/admin/games/${gameId}/items`);
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
