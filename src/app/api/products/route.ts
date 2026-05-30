import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { POPULAR_GAMES, CATEGORIES } from "@/lib/constants";

/**
 * GET /api/products
 * List all products with optional filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "12");
    const popular = searchParams.get("popular");

    let products = POPULAR_GAMES.map((game) => ({
      id: game.id,
      name: game.name,
      slug: game.slug,
      publisher: game.publisher,
      category: game.category,
      image: game.image,
      color: game.color,
      popular: game.popular,
    }));

    // Filter by category
    if (category) {
      products = products.filter((p) => p.category === category);
    }

    // Filter by search
    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.publisher.toLowerCase().includes(search)
      );
    }

    // Filter by popular
    if (popular === "true") {
      products = products.filter((p) => p.popular);
    }

    // Paginate
    const total = products.length;
    const totalPages = Math.ceil(total / perPage);
    const paginated = products.slice((page - 1) * perPage, page * perPage);

    return apiSuccess(paginated, {
      meta: { page, perPage, total, totalPages },
    });
  } catch {
    return API_ERRORS.internal();
  }
}
