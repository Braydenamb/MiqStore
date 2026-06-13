import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products
 * List all active products from the database with optional filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "12");
    const popular = searchParams.get("popular");

    const where: Record<string, unknown> = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { publisher: { contains: search, mode: "insensitive" } },
      ];
    }

    if (popular === "true") {
      where.isPopular = true;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: [
          { isPopular: "desc" },
          { order: "asc" },
          { name: "asc" },
        ],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.product.count({ where }),
    ]);

    const formatted = products.map((game) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      publisher: game.publisher,
      category: game.category?.name || "",
      image: game.image,
      color: game.color,
      popular: game.isPopular,
    }));

    const totalPages = Math.ceil(total / perPage);

    return apiSuccess(formatted, {
      meta: { page, perPage, total, totalPages },
    });
  } catch {
    return API_ERRORS.internal();
  }
}
