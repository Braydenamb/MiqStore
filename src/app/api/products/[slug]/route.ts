import { NextRequest } from "next/server";
import { apiSuccess, apiError, API_ERRORS } from "@/lib/api-response";
import { POPULAR_GAMES } from "@/lib/constants";

/**
 * GET /api/products/[slug]
 * Get a single product by slug with items.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const game = POPULAR_GAMES.find((g) => g.slug === slug);

    if (!game) {
      return API_ERRORS.notFound("Product");
    }

    // Mock product items (denominations)
    const items = generateMockItems(game.slug);

    return apiSuccess({
      ...game,
      items,
    });
  } catch {
    return API_ERRORS.internal();
  }
}

function generateMockItems(slug: string) {
  const itemMaps: Record<string, { name: string; amount: number; price: number }[]> = {
    "mobile-legends": [
      { name: "86 Diamonds", amount: 86, price: 18000 },
      { name: "172 Diamonds", amount: 172, price: 35000 },
      { name: "257 Diamonds", amount: 257, price: 52000 },
      { name: "344 Diamonds", amount: 344, price: 68000 },
      { name: "429 Diamonds", amount: 429, price: 85000 },
      { name: "514 Diamonds", amount: 514, price: 100000 },
      { name: "706 Diamonds", amount: 706, price: 135000 },
      { name: "878 Diamonds", amount: 878, price: 168000 },
      { name: "2195 Diamonds", amount: 2195, price: 419000 },
      { name: "Twilight Pass", amount: 1, price: 150000 },
    ],
    "free-fire": [
      { name: "70 Diamonds", amount: 70, price: 15000 },
      { name: "140 Diamonds", amount: 140, price: 29000 },
      { name: "355 Diamonds", amount: 355, price: 65000 },
      { name: "720 Diamonds", amount: 720, price: 130000 },
      { name: "1450 Diamonds", amount: 1450, price: 259000 },
      { name: "Membership Mingguan", amount: 1, price: 29000 },
    ],
    "genshin-impact": [
      { name: "60 Genesis Crystal", amount: 60, price: 16000 },
      { name: "300 Genesis Crystal", amount: 300, price: 79000 },
      { name: "980 Genesis Crystal", amount: 980, price: 249000 },
      { name: "1980 Genesis Crystal", amount: 1980, price: 479000 },
      { name: "3280 Genesis Crystal", amount: 3280, price: 799000 },
      { name: "6480 Genesis Crystal", amount: 6480, price: 1599000 },
      { name: "Welkin Moon", amount: 1, price: 79000 },
      { name: "Battle Pass", amount: 1, price: 159000 },
    ],
    "valorant": [
      { name: "125 VP", amount: 125, price: 15000 },
      { name: "420 VP", amount: 420, price: 49000 },
      { name: "700 VP", amount: 700, price: 79000 },
      { name: "1375 VP", amount: 1375, price: 149000 },
      { name: "2400 VP", amount: 2400, price: 249000 },
      { name: "4000 VP", amount: 4000, price: 399000 },
      { name: "8150 VP", amount: 8150, price: 799000 },
    ],
    "pubg-mobile": [
      { name: "60 UC", amount: 60, price: 15000 },
      { name: "325 UC", amount: 325, price: 55000 },
      { name: "660 UC", amount: 660, price: 109000 },
      { name: "1800 UC", amount: 1800, price: 259000 },
      { name: "3850 UC", amount: 3850, price: 519000 },
      { name: "8100 UC", amount: 8100, price: 1039000 },
      { name: "Royal Pass", amount: 1, price: 159000 },
    ],
  };

  const items = itemMaps[slug] || [
    { name: "Small Pack", amount: 100, price: 15000 },
    { name: "Medium Pack", amount: 500, price: 65000 },
    { name: "Large Pack", amount: 1000, price: 120000 },
    { name: "Premium Pack", amount: 2500, price: 280000 },
  ];

  return items.map((item, i) => ({
    id: `item_${slug}_${i}`,
    ...item,
    originalPrice: Math.round(item.price * 1.1),
    isPopular: i === 3 || i === 6,
  }));
}
