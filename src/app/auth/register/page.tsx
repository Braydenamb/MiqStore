"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      const errorMsg = "Password dan Konfirmasi Password tidak cocok.";
      setError(errorMsg);
      toast.error("Gagal mendaftar", { description: errorMsg });
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, you would post to /api/auth/register first, then signIn
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendaftar");
      }

      toast.success("Akun berhasil dibuat!", {
        description: "Menyiapkan dashboard untuk Anda...",
      });

      // Auto-login after successful registration
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Gagal login otomatis. Silakan login manual.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem. Silakan coba lagi.");
      toast.error("Pendaftaran Gagal", {
        description: err.message || "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Buat Akun Baru"
      subtitle="Gabung dan mulai top up favoritmu"
      footerText="Sudah punya akun?"
      footerLinkText="Masuk"
      footerLinkHref="/auth/login"
    >
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20 text-center animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}

          <AuthInput
            label="Username"
            id="username"
            type="text"
            placeholder="Username kamu"
            icon={<User className="h-4 w-4" />}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <AuthInput
            label="Email"
            id="email"
            type="email"
            placeholder="nama@email.com"
            icon={<Mail className="h-4 w-4" />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <AuthInput
            label="Password"
            id="password"
            type="password"
            placeholder="Min. 8 karakter"
            icon={<Lock className="h-4 w-4" />}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />

          <AuthInput
            label="Konfirmasi Password"
            id="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            icon={<Lock className="h-4 w-4" />}
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />

          <div className="flex items-start gap-2 pt-2 pb-1">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-sm border-[var(--color-navy)]/30 text-[var(--color-teal)] focus:ring-[var(--color-teal)] transition-colors hover:border-[var(--color-teal)] accent-[var(--color-teal)] cursor-pointer"
              required
            />
            <label htmlFor="agree-terms" className="text-[12px] font-medium text-[var(--color-navy)]/70 leading-relaxed cursor-pointer">
              Saya setuju dengan{" "}
              <a href="#" className="font-bold text-[var(--color-teal)] hover:text-[var(--color-gold)] transition-colors">
                Syarat & Ketentuan
              </a>{" "}
              serta{" "}
              <a href="#" className="font-bold text-[var(--color-teal)] hover:text-[var(--color-gold)] transition-colors">
                Kebijakan Privasi
              </a>.
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !agree}
            className="w-full h-12 rounded-xl bg-[var(--color-navy)] hover:bg-[var(--color-teal)] text-white font-bold text-[15px] transition-colors shadow-lg shadow-[var(--color-navy)]/20 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Daftar Sekarang <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
