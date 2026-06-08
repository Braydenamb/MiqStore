import { getGames, getGamesStats, getCategories, getProviders } from "@/actions/admin-games";
import GamesClient from "./GamesClient";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const [gamesResult, statsResult, categoriesResult, providersResult] =
    await Promise.all([
      getGames({ pageSize: 50 }),
      getGamesStats(),
      getCategories(),
      getProviders(),
    ]);

  return (
    <GamesClient
      initialGames={gamesResult.data ?? []}
      stats={statsResult.data ?? { total: 0, active: 0, inactive: 0, totalItems: 0 }}
      categories={categoriesResult.data ?? []}
      providers={providersResult.data ?? []}
    />
  );
}
// 
