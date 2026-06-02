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
        <div className="bg-white rounded-3xl shadow-[0_20px_40px_rgba(11,29,52,0.05)] border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-50 relative overflow-hidden">
            {/* Soft decorative blur */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-gold)]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[var(--color-teal)]/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-navy)] flex items-center justify-center mb-4 shadow-lg shadow-[var(--color-navy)]/20">
                <Gamepad2 className="w-8 h-8 text-[var(--color-gold)]" />
              </div>
              <h1 className="text-2xl font-extrabold font-heading text-[var(--color-navy)]">MiqAdmin Portal</h1>
              <p className="text-sm text-gray-500 mt-1">Masuk untuk mengelola MiqStore</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-6 bg-gray-50/30">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@miqstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl px-4"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">Password</Label>
                  <a href="#" className="text-xs font-bold text-[var(--color-teal)] hover:underline">Lupa Password?</a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-white border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl pl-4 pr-10"
                  />
                  <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Using native checkbox to avoid shadcn dependency issues */}
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)] focus:ring-[var(--color-teal)] accent-[var(--color-teal)] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-500 font-medium cursor-pointer">
                Ingat saya di perangkat ini
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-[var(--color-navy)] hover:bg-[var(--color-teal)] text-white font-bold text-base transition-all shadow-lg shadow-[var(--color-navy)]/20"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Autentikasi...</>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </form>

        </div>
        
        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          &copy; {new Date().getFullYear()} MiqStore. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
