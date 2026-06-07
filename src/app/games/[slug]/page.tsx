import { getGameDetails } from "@/actions/public-games";
import { GameDetailClient } from "./GameDetailClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await getGameDetails(params.slug);
  
  if (!game) {
    return {
      title: "Game Not Found - MiqStore",
    };
  }

  return {
    title: `Top Up ${game.name} - MiqStore`,
    description: game.description || `Top up ${game.name} termurah dan terpercaya di MiqStore. Proses instan 1-5 menit.`,
    openGraph: {
      title: `Top Up ${game.name} - MiqStore`,
      description: game.description || `Top up ${game.name} termurah dan terpercaya di MiqStore. Proses instan 1-5 menit.`,
      images: [
        {
          url: game.image || "",
          width: 800,
          height: 600,
          alt: game.name,
        },
      ],
    },
  };
}

export default async function GameDetailPage({ params }: { params: { slug: string } }) {
  const game = await getGameDetails(params.slug);
  
  if (!game) {
    // GameDetailClient handles the not found UI gracefully
    return <GameDetailClient game={null} products={[]} />;
  }

  return <GameDetailClient game={game} products={game.items || []} />;
}
