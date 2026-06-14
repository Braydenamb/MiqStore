"use server";

import prisma from "@/lib/prisma";
import { logger } from "@/lib/telemetry";
import type { PublicGame, GameDetail } from "@/lib/types";
import { unstable_cache } from "next/cache";

import { ALLOWED_GAMES } from "@/lib/catalog-rules";

const getCachedPublicGames = unstable_cache(
  async () => {
    return await prisma.product.findMany({
      where: { 
        isActive: true,
        OR: ALLOWED_GAMES.map(name => ({
          name: { contains: name, mode: 'insensitive' }
        }))
      },
      include: {
        category: true,
        _count: { select: { items: true } }
      },
      orderBy: [
        { isPopular: 'desc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    });
  },
  ["public-games-all"],
  { tags: ["products"], revalidate: 300 } // 5 minutes
);

export async function getPublicGames(): Promise<PublicGame[]> {
  try {
    const games = await getCachedPublicGames();
    return games as unknown as PublicGame[];
  } catch (error) {
    logger.error("Failed to fetch public games", error);
    return [];
  }
}

const getCachedPopularGames = unstable_cache(
  async () => {
    return await prisma.product.findMany({
      where: { 
        isActive: true, 
        isPopular: true,
        OR: ALLOWED_GAMES.map(name => ({
          name: { contains: name, mode: 'insensitive' }
        }))
      },
      include: { category: true },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ],
      take: 8
    });
  },
  ["public-games-popular"],
  { tags: ["products"], revalidate: 300 }
);

export async function getPopularGames(): Promise<PublicGame[]> {
  try {
    const games = await getCachedPopularGames();
    return games as unknown as PublicGame[];
  } catch (error) {
    logger.error("Failed to fetch popular games", error);
    return [];
  }
}

const getCachedGameDetails = unstable_cache(
  async (slug: string) => {
    return await prisma.product.findFirst({
      where: { 
        slug: slug, 
        isActive: true,
        OR: ALLOWED_GAMES.map(name => ({
          name: { contains: name, mode: 'insensitive' }
        }))
      },
      include: {
        category: true,
        items: {
          where: { isActive: true },
          orderBy: [
            { order: 'asc' },
            { amount: 'asc' },
            { price: 'asc' }
          ]
        }
      }
    });
  },
  ["public-game-details"],
  { tags: ["products", "items"], revalidate: 60 } // 1 minute (prices change more often)
);

export async function getGameDetails(slug: string): Promise<GameDetail | null> {
  try {
    const game = await getCachedGameDetails(slug);
    return game as unknown as GameDetail;
  } catch (error) {
    logger.error(`Failed to fetch game details for slug ${slug}`, error);
    return null;
  }
}
