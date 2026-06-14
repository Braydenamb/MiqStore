"use server";

import prisma from "@/lib/prisma";
import { logger } from "@/lib/telemetry";
import type { PublicGame, GameDetail } from "@/lib/types";

export async function getPublicGames(): Promise<PublicGame[]> {
  try {
    const games = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        _count: {
          select: { items: true }
        }
      },
      orderBy: [
        { isPopular: 'desc' },
        { order: 'asc' },
        { name: 'asc' }
      ]
    });
    return games as unknown as PublicGame[];
  } catch (error) {
    logger.error("Failed to fetch public games", error);
    return [];
  }
}

export async function getPopularGames(): Promise<PublicGame[]> {
  try {
    const games = await prisma.product.findMany({
      where: {
        isActive: true,
        isPopular: true,
      },
      include: {
        category: true,
      },
      orderBy: [
        { order: 'asc' },
        { name: 'asc' }
      ],
      take: 8 // limit to top 8 popular games
    });
    return games as unknown as PublicGame[];
  } catch (error) {
    logger.error("Failed to fetch popular games", error);
    return [];
  }
}

export async function getGameDetails(slug: string): Promise<GameDetail | null> {
  try {
    const game = await prisma.product.findUnique({
      where: {
        slug: slug,
        isActive: true,
      },
      include: {
        category: true,
        items: {
          where: {
            isActive: true,
          },
          orderBy: [
            { order: 'asc' },
            { amount: 'asc' },
            { price: 'asc' }
          ]
        }
      }
    });
    return game as unknown as GameDetail;
  } catch (error) {
    logger.error(`Failed to fetch game details for slug ${slug}`, error);
    return null;
  }
}
