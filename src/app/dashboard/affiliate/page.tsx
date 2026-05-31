"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Copy, 
  Check, 
  Megaphone, 
  TrendingUp,
  Wallet,
  Gift,
  Coins,
  ChevronRight,
  Share2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mocking User State
const MOCK_STATE = {
  referralCode: "MIQ-AB8F9X",
  totalInvites: 142,
  activeReferrals: 89,
  totalCommission: 1250000,
  tier: "PRO"
};

const RECENT_COMMISSIONS = [
  { id: 1, user: "JohnD**", game: "Mobile Legends", amount: "+Rp 1.500", date: "Hari ini, 14:30" },
  { id: 2, user: "Siti***", game: "Genshin Impact", amount: "+Rp 3.200", date: "Hari ini, 10:15" },
  { id: 3, user: "Budi***", game: "Valorant", amount: "+Rp 2.000", date: "Kemarin, 19:45" },
  { id: 4, user: "Ayu****", game: "Free Fire", amount: "+Rp 500", date: "Kemarin, 08:20" },
];

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://miqstore.com/ref/${MOCK_STATE.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          Creator & Affiliate <Badge variant="glow" className="bg-[var(--liquid-purple)]/10 text-[var(--liquid-purple)]">NEW</Badge>
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Ajak temanmu topup di MiqStore dan dapatkan komisi seumur hidup dari setiap transaksinya!
        </p>
      </motion.div>

      {/* Hero Stats Card */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black to-[hsl(var(--muted))]/30 border border-white/5 p-6 md:p-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="orb h-64 w-64 -top-32 -right-32 bg-[var(--liquid-purple)] opacity-20 blur-[80px]" />
            <div className="orb h-64 w-64 -bottom-32 -left-32 bg-[var(--liquid-cyan)] opacity-20 blur-[80px]" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* Total Earnings */}
            <div className="md:col-span-1 space-y-2 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[var(--liquid-purple)]/10 text-[var(--liquid-purple)] mb-4">
                <Wallet className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Total Komisi Didapat</p>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[var(--liquid-cyan)]">
                Rp {MOCK_STATE.totalCommission.toLocaleString('id-ID')}
              </h2>
              <div className="pt-2">
                <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12% bulan ini
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <Users className="h-5 w-5 text-[var(--liquid-cyan)] mb-2" />
                <p className="text-2xl font-bold">{MOCK_STATE.totalInvites}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Total Undangan</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <Coins className="h-5 w-5 text-[var(--liquid-amber)] mb-2" />
                <p className="text-2xl font-bold">{MOCK_STATE.activeReferrals}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Aktif Transaksi</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Link Generator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="h-full border-[hsl(var(--border))]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-[var(--liquid-purple)]" /> 
                Referral Link Kamu
              </CardTitle>
              <CardDescription>Bagikan link ini ke teman, grup Discord, atau sosial mediamu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="p-1 rounded-xl bg-gradient-to-r from-[var(--liquid-cyan)]/20 via-[var(--liquid-purple)]/20 to-transparent">
                <div className="flex bg-black/60 rounded-lg p-1 backdrop-blur-sm">
                  <Input 
                    readOnly 
                    value={referralLink} 
                    className="border-0 bg-transparent focus-visible:ring-0 font-mono text-sm text-[var(--liquid-cyan)]"
                  />
                  <Button 
                    onClick={handleCopy} 
                    className={cn(
                      "shrink-0 transition-all duration-300 w-32",
                      copied ? "bg-green-500 hover:bg-green-600 text-white" : "bg-[var(--liquid-purple)] hover:bg-[var(--liquid-purple)]/80 text-white"
                    )}
                  >
                    {copied ? <><Check className="mr-2 h-4 w-4" /> Tersalin</> : <><Copy className="mr-2 h-4 w-4" /> Salin Link</>}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-center space-y-2">
                  <div className="mx-auto h-8 w-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center font-bold text-sm">1</div>
                  <h4 className="text-sm font-semibold">Bagikan Link</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Sebarkan link unikmu ke teman-teman gamers.</p>
                </div>
                <div className="p-4 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-center space-y-2">
                  <div className="mx-auto h-8 w-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center font-bold text-sm">2</div>
                  <h4 className="text-sm font-semibold">Teman Topup</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Temanmu mendaftar & melakukan transaksi.</p>
                </div>
                <div className="p-4 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/20 text-center space-y-2">
                  <div className="mx-auto h-8 w-8 rounded-full bg-[var(--liquid-purple)]/20 text-[var(--liquid-purple)] flex items-center justify-center font-bold text-sm">3</div>
                  <h4 className="text-sm font-semibold text-[var(--liquid-purple)]">Dapat Komisi</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Kamu dapat 0.5% komisi seumur hidup!</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Recent Earnings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-400" /> Riwayat Komisi
                </span>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-[var(--liquid-cyan)] px-2">Lihat Semua</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_COMMISSIONS.map((comm) => (
                  <div key={comm.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--muted))] to-[hsl(var(--border))] flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{comm.user}</p>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))] truncate">{comm.game}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-green-400">{comm.amount}</p>
                      <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{comm.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[hsl(var(--border))]">
                <Button variant="outline" className="w-full gap-2 text-xs">
                  <Share2 className="h-4 w-4" /> Bagikan ke WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
