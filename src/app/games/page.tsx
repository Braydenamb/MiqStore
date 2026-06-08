import { Suspense } from "react";
import { getPublicGames } from "@/actions/public-games";
import { GamesClient } from "./GamesClient";

function GamesSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-[hsl(var(--primary))]/20 pb-6">
        <div>
          <div className="h-12 w-64 bg-gray-200/50 rounded-lg animate-pulse mb-4" />
          <div className="h-6 w-96 bg-gray-200/50 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-gray-200/50 rounded-full animate-pulse" />
          <div className="h-10 w-32 bg-gray-200/50 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-[20px] bg-white/50 border border-white p-4 h-[280px] flex flex-col relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent" />
            <div className="relative z-10 flex-1 flex flex-col items-center text-center pt-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 mb-4" />
              <div className="h-5 w-32 bg-gray-200 rounded-md mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded-md" />
            </div>
            <div className="relative z-10 mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="h-4 w-16 bg-gray-200 rounded-md" />
              <div className="h-8 w-20 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  const games = await getPublicGames();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] texture-overlay py-8 relative overflow-hidden">
      
      {/* Decorative Golden Dotted Side Decoration */}
      <div className="absolute left-4 top-20 bottom-20 w-8 border-l-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block" />
      <div className="absolute right-4 top-20 bottom-20 w-8 border-r-2 border-dotted border-[var(--color-gold)]/40 hidden lg:block" />

      <Suspense fallback={<GamesSkeleton />}>
        <GamesClient initialGames={games} />
      </Suspense>
    </div>
  );
}
