"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/3 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/8 blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Glitch-style 404 */}
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative mb-6"
        >
          <div className="text-[120px] sm:text-[160px] font-extrabold leading-none gradient-text">
            404
          </div>
        </motion.div>

        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 border border-purple-500/30">
            <Gamepad2 className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))] mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
          Sepertinya kamu nyasar ke dunia yang salah. Halaman yang kamu cari
          tidak ada atau sudah dipindahkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-1 h-4 w-4" />
              Ke Beranda
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/games">
              <Search className="mr-1 h-4 w-4" />
              Cari Game
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
