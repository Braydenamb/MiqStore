"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Key, 
  Copy, 
  Check, 
  Activity, 
  ShieldCheck, 
  BookOpen, 
  Terminal, 
  RefreshCcw,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ResellerPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    // Mock API call to our backend service
    await new Promise(r => setTimeout(r, 1000));
    setApiKey("miq_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          Reseller & B2B API <Badge variant="glow" className="bg-[var(--liquid-cyan)]/10 text-[var(--liquid-cyan)]">PRO</Badge>
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Integrasikan sistem top-up MiqStore langsung ke aplikasi atau website kamu.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: API Keys & Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* API Key Manager */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-[hsl(var(--border))]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-[var(--liquid-purple)]" /> 
                  Authentication
                </CardTitle>
                <CardDescription>
                  Generate API Key untuk mengakses endpoint B2B. Kunci ini memiliki akses penuh ke saldo MiqStore kamu.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!apiKey ? (
                  <div className="p-6 rounded-xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 flex flex-col items-center justify-center text-center">
                    <ShieldCheck className="h-8 w-8 text-[hsl(var(--muted-foreground))] mb-3" />
                    <h3 className="text-sm font-semibold mb-1">Belum ada API Key aktif</h3>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4 max-w-xs">
                      Pastikan API Key tidak dibagikan kepada siapapun. Kunci hanya akan ditampilkan satu kali.
                    </p>
                    <Button onClick={handleGenerateKey} disabled={isGenerating} className="bg-[var(--liquid-purple)] hover:bg-[var(--liquid-purple)]/90">
                      {isGenerating ? "Generating..." : "Generate API Key"}
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl border border-[var(--liquid-cyan)]/30 bg-[var(--liquid-cyan)]/5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--liquid-cyan)] flex items-center gap-2">
                          <Check className="h-4 w-4" /> API Key Berhasil Dibuat
                        </span>
                        <Badge variant="outline" className="text-[10px]">Aktif</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input readOnly value={apiKey} className="font-mono text-sm bg-black/50" />
                        <Button variant="outline" onClick={handleCopy} className="shrink-0 w-12">
                          {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-red-400 font-medium">
                        Simpan kunci ini sekarang. Kunci tidak akan ditampilkan lagi setelah Anda meninggalkan halaman ini!
                      </p>
                    </motion.div>
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* API Analytics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" /> 
                  Usage Analytics (7 Hari)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="space-y-1">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Total Requests</p>
                    <p className="text-2xl font-bold">1,245</p>
                  </div>
                  <div className="space-y-1 border-l border-[hsl(var(--border))] pl-4">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">99.8%</p>
                  </div>
                  <div className="space-y-1 border-l border-[hsl(var(--border))] pl-4">
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">Avg Latency</p>
                    <p className="text-2xl font-bold text-[var(--liquid-amber)]">245ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Documentation */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-[hsl(var(--muted))]/20 h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[var(--liquid-cyan)]" /> Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Authentication</h4>
                  <p className="text-sm">Gunakan header <code className="text-xs bg-black px-1 py-0.5 rounded text-[var(--liquid-cyan)]">x-api-key</code> pada setiap request.</p>
                </div>

                <Separator />

                <div className="space-y-4 font-mono text-[10px] sm:text-xs">
                  <div>
                    <p className="text-[hsl(var(--muted-foreground))] mb-1">// 1. Cek Saldo</p>
                    <div className="p-3 bg-black/40 rounded-lg overflow-x-auto border border-white/5 whitespace-pre">
                      <span className="text-[var(--liquid-cyan)]">curl</span> -X GET https://api.miqstore.com/v1/balance \<br/>
                      {'  '}-H <span className="text-[var(--liquid-amber)]">"x-api-key: {apiKey || "YOUR_API_KEY"}"</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[hsl(var(--muted-foreground))] mb-1">// 2. Buat Pesanan (Smart Routed to Best Provider)</p>
                    <div className="p-3 bg-black/40 rounded-lg overflow-x-auto border border-white/5 whitespace-pre">
                      <span className="text-[var(--liquid-cyan)]">curl</span> -X POST https://api.miqstore.com/v1/order \<br/>
                      {'  '}-H <span className="text-[var(--liquid-amber)]">"x-api-key: {apiKey || "YOUR_API_KEY"}"</span> \<br/>
                      {'  '}-H <span className="text-[var(--liquid-amber)]">"Content-Type: application/json"</span> \<br/>
                      {'  '}-d <span className="text-[var(--liquid-purple)]">'&#123;"game":"mlbb", "userId":"12345", "zoneId":"1234", "product":"86_dm"&#125;'</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-2 gap-2 text-xs h-8">
                  <Terminal className="h-3 w-3" /> Buka Full Dokumentasi API
                </Button>

              </CardContent>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
