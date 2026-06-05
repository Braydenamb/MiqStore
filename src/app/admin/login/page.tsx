"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gamepad2, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Silakan isi email dan password");
      return;
    }

    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      toast.success("Login berhasil! Mengalihkan...");
      router.push("/admin");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[hsl(var(--card))] rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-[hsl(var(--border))] overflow-hidden">
          
          {/* Header */}
          <div className="p-8 text-center border-b border-[hsl(var(--border))] relative overflow-hidden">
            {/* Soft decorative blur */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-gold)]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[hsl(var(--primary))]/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[hsl(var(--secondary))] flex items-center justify-center mb-4 shadow-lg shadow-[hsl(var(--foreground))]/20">
                <Gamepad2 className="w-8 h-8 text-[var(--color-gold)]" />
              </div>
              <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">MiqAdmin Portal</h1>
              <p className="text-sm text-[hsl(var(--foreground))]/60 mt-1">Masuk untuk mengelola MiqStore</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6 bg-[hsl(var(--secondary))]/30">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-[hsl(var(--foreground))] uppercase tracking-wider">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@miqstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-[hsl(var(--secondary))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-xl px-4"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-[hsl(var(--foreground))] uppercase tracking-wider">Password</Label>
                  <a href="#" className="text-xs font-bold text-[hsl(var(--primary))] hover:underline">Lupa Password?</a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-[hsl(var(--secondary))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-xl pl-4 pr-10"
                  />
                  <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--foreground))]/40" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Using native checkbox to avoid shadcn dependency issues */}
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-[hsl(var(--foreground))]/60 font-medium cursor-pointer">
                Ingat saya di perangkat ini
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold text-base transition-all shadow-lg shadow-[hsl(var(--primary))]/20"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Autentikasi...</>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>

        </div>
        
        <p className="text-center text-xs text-[hsl(var(--foreground))]/40 font-medium mt-6">
          &copy; {new Date().getFullYear()} MiqStore. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
