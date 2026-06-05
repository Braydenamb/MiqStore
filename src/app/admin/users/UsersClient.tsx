"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAdminUsers, updateUserRole } from "@/actions/admin-users";

const roleColors: Record<string, string> = {
  USER: "bg-slate-500/20 text-slate-700",
  RESELLER: "bg-cyan-500/20 text-cyan-700",
  ADMIN: "bg-purple-500/20 text-purple-700",
  SUPER_ADMIN: "bg-red-500/20 text-red-700",
};

const memberColors: Record<string, string> = {
  BRONZE: "text-amber-700",
  SILVER: "text-slate-400",
  GOLD: "text-amber-400",
  DIAMOND: "text-cyan-400",
};

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  membership: string;
  transactions: number;
  isActive: boolean;
  joinDate: string;
};

type StatsData = {
  total: number;
  reseller: number;
  admin: number;
  active: number;
};

export default function UsersClient({ initialData }: { initialData: { users: UserData[], total: number, totalPages: number, stats: StatsData } }) {
  const [users, setUsers] = useState<UserData[]>(initialData.users);
  const [total, setTotal] = useState(initialData.total);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [stats, setStats] = useState(initialData.stats);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const perPage = 10;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data
  useEffect(() => {
    if (page === 1 && debouncedSearch === "" && roleFilter === "all" && users === initialData.users) return;

    const fetchData = async () => {
      setIsLoading(true);
      const result = await getAdminUsers(page, perPage, debouncedSearch, roleFilter);
      if (result.success && result.data) {
        setUsers(result.data.users);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
        setStats(result.data.stats);
      } else {
        toast.error("Gagal memuat pengguna");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [debouncedSearch, roleFilter, page]);

  // Reset page to 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    // Optimistic UI update
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      toast.success(`Role pengguna diubah menjadi ${newRole}`);
      // re-fetch to update stats if necessary, or we can just let it be.
    } else {
      toast.error(result.error || "Gagal mengubah role");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-[hsl(var(--foreground))]">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} user terdaftar
          </p>
        </div>
        <Button className="gap-2 bg-[hsl(var(--secondary))] text-white hover:bg-[hsl(var(--primary))] font-bold rounded-xl h-10 px-4">
          <UserPlus className="h-4 w-4" />
          Tambah User
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-purple-600" },
          { label: "Reseller", value: stats.reseller, color: "text-cyan-600" },
          { label: "Admin", value: stats.admin, color: "text-amber-600" },
          { label: "Aktif", value: stats.active, color: "text-green-600" },
        ].map((stat) => (
          <Card key={stat.label} className="border-gray-100 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-gray-50 border-gray-200 rounded-xl focus:border-[hsl(var(--primary))]"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none h-10 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none cursor-pointer focus:border-[hsl(var(--primary))] w-full"
          >
            <option value="all">Semua Role</option>
            <option value="USER">User</option>
            <option value="RESELLER">Reseller</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[hsl(var(--primary))] animate-spin" />
          </div>
        )}
        <CardContent className="p-0">
          <div className="hidden sm:grid grid-cols-[1fr_120px_80px_80px_60px_40px] gap-4 border-b border-gray-50 bg-gray-50/50 px-6 py-4 text-xs font-bold text-gray-500 uppercase">
            <span>User</span>
            <span>Role</span>
            <span>Tier</span>
            <span>Transaksi</span>
            <span>Status</span>
            <span></span>
          </div>
          {users.map((user) => (
            <div
              key={user.id}
              className="grid sm:grid-cols-[1fr_120px_80px_80px_60px_40px] gap-2 sm:gap-4 items-center border-b border-gray-50 px-6 py-4 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--foreground))] to-[hsl(var(--primary))] text-white text-xs font-bold shrink-0">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 font-mono truncate">{user.email}</p>
                </div>
              </div>
              
              <div className="w-fit">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={user.role === "SUPER_ADMIN"}
                  className={cn(
                    "appearance-none rounded-lg px-2 py-1 text-[10px] font-bold cursor-pointer outline-none",
                    roleColors[user.role] || roleColors.USER
                  )}
                >
                  <option value="USER">USER</option>
                  <option value="RESELLER">RESELLER</option>
                  <option value="ADMIN">ADMIN</option>
                  {user.role === "SUPER_ADMIN" && <option value="SUPER_ADMIN">SUPER_ADMIN</option>}
                </select>
              </div>

              <span className={cn("text-xs font-bold", memberColors[user.membership])}>
                {user.membership}
              </span>
              <span className="text-xs font-bold text-gray-700">{user.transactions}</span>
              <div className={cn("h-2.5 w-2.5 rounded-full", user.isActive ? "bg-green-500" : "bg-red-500")} title={user.isActive ? "Active" : "Inactive"} />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[hsl(var(--foreground))] rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {users.length === 0 && !isLoading && (
            <div className="px-6 py-12 text-center text-gray-500">
              Tidak ada user yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-sm text-gray-500">
            Halaman <span className="font-bold text-[hsl(var(--foreground))]">{page}</span> dari <span className="font-bold text-[hsl(var(--foreground))]">{totalPages}</span> ({total} users)
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              className="h-9 px-3 rounded-xl border-gray-200 hover:bg-gray-50 text-[hsl(var(--foreground))]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)}
              className="h-9 px-3 rounded-xl border-gray-200 hover:bg-gray-50 text-[hsl(var(--foreground))]"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
