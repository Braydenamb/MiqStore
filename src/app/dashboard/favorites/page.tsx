"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Trash2,
  Gamepad2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { POPULAR_GAMES } from "@/lib/constants";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(POPULAR_GAMES.slice(0, 5));

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Game Favorit
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {favorites.length} game ditandai sebagai favorit
        </p>
      </motion.div>

      {favorites.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {favorites.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="card-hover overflow-hidden">
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: game.color }}
                />
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
                      style={{ backgroundColor: game.color + "20" }}
                    >
                      <Gamepad2
                        className="h-6 w-6"
                        style={{ color: game.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold truncate">
                        {game.name}
                      </h3>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        {game.publisher} • {game.category}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/games/${game.slug}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => removeFavorite(game.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="h-12 w-12 text-[hsl(var(--muted-foreground))] mb-4" />
          <h2 className="text-lg font-bold mb-2">Belum Ada Game Favorit</h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
            Tandai game favoritmu untuk akses cepat top up
          </p>
          <Button asChild>
            <Link href="/games">Jelajahi Game</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
