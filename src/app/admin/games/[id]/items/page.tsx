import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import GameItemsClient from "./GameItemsClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GameItemsPage({ params }: Props) {
  const { id } = await params;

  const game = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      items: {
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        include: {
          _count: { select: { transactions: true } },
        },
      },
    },
  });

  if (!game) notFound();

  const activeCount = game.items.filter((i) => i.isActive).length;

  return (
    <GameItemsClient
      game={{
        id: game.id,
        name: game.name,
        slug: game.slug,
        image: game.image,
        categoryName: game.category?.name ?? "Unknown",
        totalItems: game.items.length,
        activeItems: activeCount,
      }}
      initialItems={game.items.map((item) => ({
        ...item,
        originalPrice: item.originalPrice ?? null,
        resellerPrice: item.resellerPrice ?? null,
        providerCode: item.providerCode ?? null,
        description: item.description ?? null,
        salesCount: item._count.transactions,
      }))}
    />
  );
}
// 
