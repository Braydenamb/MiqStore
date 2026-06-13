import { NextRequest } from "next/server";
import { apiSuccess, API_ERRORS } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/products/[slug]
 * Get a single product by slug with active items from the database.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: { select: { name: true, slug: true } },
        items: {
          where: { isActive: true },
          orderBy: [{ order: "asc" }, { price: "asc" }],
        },
      },
    });

    if (!product) {
      return API_ERRORS.notFound("Product");
    }

    const items = product.items.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
      price: item.price,
      originalPrice: item.originalPrice,
      isPopular: item.isPopular,
    }));

    return apiSuccess({
      id: product.id,
      name: product.name,
      slug: product.slug,
      publisher: product.publisher,
      description: product.description,
      image: product.image,
      banner: product.banner,
      gallery: product.gallery,
      color: product.color,
      category: product.category?.name || "",
      gameType: product.gameType,
      tags: product.tags,
      popular: product.isPopular,
      items,
    });
  } catch {
    return API_ERRORS.internal();
  }
}
