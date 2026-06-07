"use server";

import prisma from "@/lib/prisma";

export async function getPublicGames() {
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
    return games;
  } catch (error) {
    console.error("Failed to fetch public games:", error);
    return [];
  }
}

export async function getPopularGames() {
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
    return games;
  } catch (error) {
    console.error("Failed to fetch popular games:", error);
    return [];
  }
}
