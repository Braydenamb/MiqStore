"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Lock,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "Miq User",
    email: "miq@email.com",
    phone: "081234567890",
  });
  const [isEditing, setIsEditing] = useState(false);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">
          Profil Saya
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Kelola informasi akun dan keamanan
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="relative inline-block">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-3xl font-bold text-white mx-auto">
                  MQ
                </div>
                <button
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-colors"
                  aria-label="Change avatar"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[hsl(var(--foreground))]">
                {form.name}
              </h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {form.email}
              </p>
              <Badge variant="glow" className="mt-3">
                ⭐ Gold Member
              </Badge>
              <Separator className="my-4" />
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Member sejak</span>
                  <span>Jan 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Total transaksi</span>
                  <span>47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--muted-foreground))]">Poin reward</span>
                  <span className="text-purple-400">1,250</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Informasi Pribadi</CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-1 h-3.5 w-3.5" /> Simpan
                    </>
                  ) : (
                    "Edit"
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                      <Input
                        id="profile-name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                      <Input
                        id="profile-email"
                        type="email"
                        value={form.email}
                        disabled
                        className="pl-10"
                      />
                    </div>
                    <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                      Email tidak dapat diubah
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">No. WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                      <Input
                        id="profile-phone"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-green-400" />
                  Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    <div>
                      <p className="text-sm font-semibold">Password</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Terakhir diubah 30 hari yang lalu
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ubah
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                    <div>
                      <p className="text-sm font-semibold">Two-Factor Auth</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Tidak aktif
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktifkan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
