"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Shield,
  Crown,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const mockUsers = Array.from({ length: 30 }, (_, i) => ({
  id: `usr_${(i + 1).toString().padStart(3, "0")}`,
  name: [
    "Rizky Pratama", "Sarah Aulia", "Ahmad Fauzi", "Dewi Anggraini",
    "Budi Santoso", "Maya Indah", "Dimas Arya", "Lina Kusuma",
    "Rina Sari", "Fajar Nugroho",
  ][i % 10],
  email: [
    "rizky@email.com", "sarah@email.com", "ahmad@email.com", "dewi@email.com",
    "budi@email.com", "maya@email.com", "dimas@email.com", "lina@email.com",
    "rina@email.com", "fajar@email.com",
  ][i % 10],
  role: (["USER", "USER", "USER", "RESELLER", "ADMIN"] as const)[i % 5],
  membership: (["BRONZE", "SILVER", "GOLD", "DIAMOND", "GOLD"] as const)[i % 5],
  transactions: Math.floor(Math.random() * 100) + 1,
  isActive: i % 7 !== 0,
  joinDate: new Date(2026, 0, 1 + i).toLocaleDateString("id-ID"),
}));

const roleColors: Record<string, string> = {
  USER: "bg-slate-500/20 text-slate-400",
  RESELLER: "bg-cyan-500/20 text-cyan-400",
  ADMIN: "bg-purple-500/20 text-purple-400",
  SUPER_ADMIN: "bg-red-500/20 text-red-400",
};

const memberColors: Record<string, string> = {
  BRONZE: "text-amber-700",
  SILVER: "text-slate-400",
  GOLD: "text-amber-400",
  DIAMOND: "text-cyan-400",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold">Users</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            {mockUsers.length} user terdaftar
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Tambah User
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: mockUsers.length, color: "text-purple-400" },
          { label: "Reseller", value: mockUsers.filter((u) => u.role === "RESELLER").length, color: "text-cyan-400" },
          { label: "Admin", value: mockUsers.filter((u) => u.role === "ADMIN").length, color: "text-amber-400" },
          { label: "Aktif", value: mockUsers.filter((u) => u.isActive).length, color: "text-green-400" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <Select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="w-full sm:w-40"
        >
          <option value="all">Semua Role</option>
          <option value="USER">User</option>
          <option value="RESELLER">Reseller</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </div>

      {/* User Table */}
      <Card>
        <CardContent className="p-0">
          <div className="hidden sm:grid grid-cols-[1fr_100px_80px_80px_60px_40px] gap-4 border-b border-[hsl(var(--border))] px-4 py-3 text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase">
            <span>User</span>
            <span>Role</span>
            <span>Tier</span>
            <span>Transaksi</span>
            <span>Status</span>
            <span></span>
          </div>
          {paginated.map((user) => (
            <div
              key={user.id}
              className="grid sm:grid-cols-[1fr_100px_80px_80px_60px_40px] gap-2 sm:gap-4 items-center border-b border-[hsl(var(--border))] px-4 py-3 last:border-0 hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xs font-bold shrink-0">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold w-fit", roleColors[user.role])}>
                {user.role}
              </span>
              <span className={cn("text-xs font-medium", memberColors[user.membership])}>
                {user.membership}
              </span>
              <span className="text-xs">{user.transactions}</span>
              <div className={cn("h-2 w-2 rounded-full", user.isActive ? "bg-green-400" : "bg-red-400")} />
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
