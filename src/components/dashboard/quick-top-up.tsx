"use client";

import Link from "next/link";
import Image from "next/image";

const games = [
  { id: "mlbb", name: "Mobile Legends", image: "/images/Mobile_legends(1).jpg" },
  { id: "pubgm", name: "PUBG Mobile", image: "/images/pubgm.jpg" },
  { id: "valorant", name: "Valorant", image: "/images/Valorant_(1).jpg" },
  { id: "genshin", name: "Genshin Impact", image: "/images/genshin-impact-(1).jpg" },
];

export function QuickTopUp() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Top Up Game</h2>
        <Link
          href="/games"
          className="text-xs font-medium text-[hsl(var(--primary))] hover:underline"
        >
          Semua Game →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[hsl(var(--muted))] ring-1 ring-[hsl(var(--border))] group-active:scale-95 transition-transform">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-[hsl(var(--muted-foreground))] text-center leading-tight truncate w-full text-center group-hover:text-[hsl(var(--foreground))] transition-colors">
              {game.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
