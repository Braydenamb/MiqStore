"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Bell,
  BellOff,
  Globe,
  Shield,
  Trash2,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-8 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        value ? "bg-purple-600" : "bg-[hsl(var(--muted))]"
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm",
          value ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);
  const [promoNotif, setPromoNotif] = useState(true);
  const [language, setLanguage] = useState("id");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Pengaturan
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Kelola preferensi akun dan notifikasi
        </p>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-purple-400" />
              Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingRow
              label="Push Notification"
              description="Notifikasi untuk update transaksi"
            >
              <Toggle value={notifications} onChange={setNotifications} />
            </SettingRow>
            <Separator />
            <SettingRow
              label="Notifikasi Email"
              description="Kirim update via email"
            >
              <Toggle value={emailNotif} onChange={setEmailNotif} />
            </SettingRow>
            <Separator />
            <SettingRow
              label="Notifikasi WhatsApp"
              description="Kirim invoice via WhatsApp"
            >
              <Toggle value={whatsappNotif} onChange={setWhatsappNotif} />
            </SettingRow>
            <Separator />
            <SettingRow
              label="Promo & Diskon"
              description="Info promo terbaru"
            >
              <Toggle value={promoNotif} onChange={setPromoNotif} />
            </SettingRow>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-cyan-400" />
              Preferensi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingRow
              label="Bahasa"
              description="Bahasa tampilan aplikasi"
            >
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-40"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </Select>
            </SettingRow>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-400">
              <Shield className="h-4 w-4" />
              Zona Berbahaya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-red-500/20 p-4">
              <div>
                <p className="text-sm font-semibold">Hapus Akun</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Semua data akan dihapus permanen dan tidak bisa dikembalikan
                </p>
              </div>
              <Button
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 shrink-0"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Hapus Akun
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[hsl(var(--border))] p-4">
              <div>
                <p className="text-sm font-semibold">Keluar dari Semua Perangkat</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Logout dari semua sesi yang sedang aktif
                </p>
              </div>
              <Button variant="outline" className="shrink-0">
                <LogOut className="mr-1 h-3.5 w-3.5" />
                Logout Semua
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
