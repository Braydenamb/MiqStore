"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GameFilters {
  q?: string;
  categoryId?: string;
  status?: "active" | "inactive" | "all";
  providerId?: string;
  sort?: "name" | "newest" | "oldest" | "items";
  page?: number;
  pageSize?: number;
}

export interface GameFormData {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  isPopular: boolean;
  categoryId: string;
  providerId?: string;
  gameType?: string;
  publisher?: string;
  image?: string;
  banner?: string;
  gallery?: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function ensureDefaultCategory(): Promise<string> {
  let category = await prisma.category.findFirst({
    where: { slug: "mobile-games" },
  });

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: "Mobile Games",
        slug: "mobile-games",
        description: "Default category for games",
        isActive: true,
      },
    });
  }

  return category.id;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getGames(filters: GameFilters = {}) {
  try {
    const {
      q,
      categoryId,
      status = "all",
      providerId,
      sort = "newest",
      page = 1,
      pageSize = 20,
    } = filters;

    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { publisher: { contains: q, mode: "insensitive" } },
      ];
    }

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    if (providerId && providerId !== "all") {
      where.providerId = providerId;
    }

    const orderBy: Record<string, unknown> =
      sort === "name"
        ? { name: "asc" }
        : sort === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" };

    const [games, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          _count: {
            select: {
              items: true,
              transactions: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // For each game, count active items separately
    const gameIds = games.map((g) => g.id);
    const activeItemCounts = await prisma.productItem.groupBy({
      by: ["productId"],
      where: { productId: { in: gameIds }, isActive: true },
      _count: { id: true },
    });

    const activeCountMap = new Map(
      activeItemCounts.map((c) => [c.productId, c._count.id])
    );

    const enrichedGames = games.map((g) => ({
      ...g,
      activeItemCount: activeCountMap.get(g.id) ?? 0,
    }));

    return {
      success: true,
      data: enrichedGames,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg, data: [], total: 0, totalPages: 0 };
  }
}

export async function getGameById(id: string) {
  try {
    const game = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        items: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { items: true, transactions: true },
        },
      },
    });

    return { success: true, data: game };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function getGamesStats() {
  try {
    const [total, active, inactive, totalItems] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: false } }),
      prisma.productItem.count(),
    ]);

    return { success: true, data: { total, active, inactive, totalItems } };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export const getCategories = unstable_cache(
  async () => {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true },
      });
      return { success: true, data: categories };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: msg, data: [] as { id: string; name: string; slug: string }[] };
    }
  },
  ["admin-categories"],
  { revalidate: 60, tags: ["admin-categories"] }
);

export const getProviders = unstable_cache(
  async () => {
    try {
      const providers = await prisma.provider.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      });
      return { success: true, data: providers };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: msg, data: [] as { id: string; name: string; slug: string }[] };
    }
  },
  ["admin-providers"],
  { revalidate: 300, tags: ["admin-providers"] }  // Providers change rarely — 5 min cache
);

// ─── Write ────────────────────────────────────────────────────────────────────

export async function createGame(data: GameFormData) {
  try {
    const categoryId = data.categoryId || (await ensureDefaultCategory());

    const game = await prisma.product.create({
      data: {
        categoryId,
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        isActive: data.isActive,
        isPopular: data.isPopular,
        gameType: data.gameType || "mobile",
        publisher: data.publisher || null,
        image: data.image || null,
        banner: data.banner || null,
        gallery: data.gallery || [],
      },
    });

    revalidatePath("/admin/games");
    revalidatePath("/");
    revalidateTag("admin-categories", "default");
    return { success: true, data: game };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Slug sudah digunakan. Pilih slug yang berbeda.",
      };
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function updateGame(id: string, data: Partial<GameFormData>) {
  try {
    const game = await prisma.product.update({
      where: { id },
      data: {
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isPopular !== undefined && { isPopular: data.isPopular }),
        ...(data.gameType !== undefined && {
          gameType: data.gameType || "mobile",
        }),
        ...(data.publisher !== undefined && {
          publisher: data.publisher || null,
        }),
        ...(data.image !== undefined && { image: data.image || null }),
        ...(data.banner !== undefined && { banner: data.banner || null }),
        ...(data.gallery !== undefined && { gallery: data.gallery || [] }),
      },
    });

    revalidatePath("/admin/games");
    revalidatePath(`/games/${game.slug}`);
    revalidateTag("admin-categories", "default");
    return { success: true, data: game };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return {
        success: false,
        error: "Slug sudah digunakan. Pilih slug yang berbeda.",
      };
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function deleteGame(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/games");
    revalidatePath("/");
    revalidateTag("admin-categories", "default");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function toggleGameStatus(id: string, isActive: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isActive },
    });
    revalidatePath("/admin/games");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
