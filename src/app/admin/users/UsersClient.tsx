"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAdminUsers, updateUserRole, deleteUser, createUser } from "@/actions/admin-users";

const roleColors: Record<string, string> = {
  USER: "bg-slate-500/20 text-slate-300",
  RESELLER: "bg-cyan-500/20 text-cyan-300",
  ADMIN: "bg-purple-500/20 text-purple-300",
  SUPER_ADMIN: "bg-red-500/20 text-red-300",
};

const memberColors: Record<string, string> = {
  BRONZE: "text-amber-500",
  SILVER: "text-slate-300",
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "USER", membership: "BRONZE" });

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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success("User deleted successfully");
      setUsers(users.filter(u => u.id !== userId));
      setTotal(prev => prev - 1);
    } else {
      toast.error(result.error || "Failed to delete user");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsLoading(true);
    const result = await createUser(newUser);
    if (result.success) {
      toast.success("User created successfully");
      setIsAddModalOpen(false);
      setNewUser({ name: "", email: "", role: "USER", membership: "BRONZE" });
      setPage(1); // Reset page to trigger fetch
    } else {
      toast.error(result.error || "Failed to create user");
    }
    setIsLoading(false);
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
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            {stats.total} user terdaftar
          </p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-[hsl(var(--primary-foreground))] font-bold rounded-xl h-10 px-4 shadow-[0_0_15px_rgba(165,180,252,0.3)] transition-all"
        >
          <UserPlus className="h-4 w-4" />
          Tambah User
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, color: "text-purple-400" },
          { label: "Reseller", value: stats.reseller, color: "text-cyan-400" },
          { label: "Admin", value: stats.admin, color: "text-amber-400" },
          { label: "Aktif", value: stats.active, color: "text-green-400" },
        ].map((stat) => (
          <Card key={stat.label} className="glass-card border-[hsl(var(--border))] rounded-2xl">
            <CardContent className="p-4 text-center bg-transparent">
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 glass-card p-4 rounded-2xl border border-[hsl(var(--border))]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
          <Input
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-slate-900/50 border-[hsl(var(--border))] rounded-xl focus:border-[hsl(var(--primary))] text-[hsl(var(--foreground))]"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none h-10 px-4 pr-10 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl font-bold text-sm outline-none cursor-pointer focus:border-[hsl(var(--primary))] w-full text-[hsl(var(--foreground))]"
          >
            <option value="all" className="bg-slate-900">Semua Role</option>
            <option value="USER" className="bg-slate-900">User</option>
            <option value="RESELLER" className="bg-slate-900">Reseller</option>
            <option value="ADMIN" className="bg-slate-900">Admin</option>
            <option value="SUPER_ADMIN" className="bg-slate-900">Super Admin</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <Card className="glass-card border-[hsl(var(--border))] rounded-2xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[hsl(var(--primary))] animate-spin" />
          </div>
        )}
        <CardContent className="p-0 bg-transparent">
          <div className="hidden sm:grid grid-cols-[1fr_120px_80px_80px_60px_40px] gap-4 border-b border-[hsl(var(--border))] bg-slate-900/50 px-6 py-4 text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase">
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
              className="grid sm:grid-cols-[1fr_120px_80px_80px_60px_40px] gap-2 sm:gap-4 items-center border-b border-[hsl(var(--border))] px-6 py-4 last:border-0 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--foreground))] to-[hsl(var(--primary))] text-slate-950 text-xs font-bold shrink-0">
                  {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">{user.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] font-mono truncate">{user.email}</p>
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
                  <option value="USER" className="bg-slate-900 text-[hsl(var(--foreground))]">USER</option>
                  <option value="RESELLER" className="bg-slate-900 text-[hsl(var(--foreground))]">RESELLER</option>
                  <option value="ADMIN" className="bg-slate-900 text-[hsl(var(--foreground))]">ADMIN</option>
                  {user.role === "SUPER_ADMIN" && <option value="SUPER_ADMIN" className="bg-slate-900 text-[hsl(var(--foreground))]">SUPER_ADMIN</option>}
                </select>
              </div>

              <span className={cn("text-xs font-bold", memberColors[user.membership])}>
                {user.membership}
              </span>
              <span className="text-xs font-bold text-[hsl(var(--foreground))]">{user.transactions}</span>
              <div className={cn("h-2.5 w-2.5 rounded-full", user.isActive ? "bg-green-500" : "bg-red-500")} title={user.isActive ? "Active" : "Inactive"} />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDeleteUser(user.id)}
                disabled={user.role === "SUPER_ADMIN"}
                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {users.length === 0 && !isLoading && (
            <div className="px-6 py-12 text-center text-[hsl(var(--muted-foreground))]">
              Tidak ada user yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 glass-card border border-[hsl(var(--border))] rounded-2xl">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Halaman <span className="font-bold text-[hsl(var(--foreground))]">{page}</span> dari <span className="font-bold text-[hsl(var(--foreground))]">{totalPages}</span> ({total} users)
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page <= 1} 
              onClick={() => setPage(page - 1)}
              className="h-9 px-3 rounded-xl border-[hsl(var(--border))] bg-slate-900/50 hover:bg-slate-800 text-[hsl(var(--muted-foreground))]"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page >= totalPages} 
              onClick={() => setPage(page + 1)}
              className="h-9 px-3 rounded-xl border-[hsl(var(--border))] bg-slate-900/50 hover:bg-slate-800 text-[hsl(var(--muted-foreground))]"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md glass-card border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))] bg-slate-900/50">
                <h3 className="font-bold text-lg text-[hsl(var(--foreground))]">Tambah User Baru</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)} className="h-8 w-8 rounded-full text-[hsl(var(--muted-foreground))] hover:text-white">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleCreateUser} className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[hsl(var(--muted-foreground))]">Nama</label>
                  <Input 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="bg-slate-900/50 border-[hsl(var(--border))] rounded-xl focus-visible:ring-[hsl(var(--primary))] text-[hsl(var(--foreground))]"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[hsl(var(--muted-foreground))]">Email</label>
                  <Input 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="bg-slate-900/50 border-[hsl(var(--border))] rounded-xl focus-visible:ring-[hsl(var(--primary))] text-[hsl(var(--foreground))]"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[hsl(var(--muted-foreground))]">Role</label>
                    <select 
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl text-sm font-bold outline-none focus:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] cursor-pointer"
                    >
                      <option value="USER" className="bg-slate-900">USER</option>
                      <option value="RESELLER" className="bg-slate-900">RESELLER</option>
                      <option value="ADMIN" className="bg-slate-900">ADMIN</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[hsl(var(--muted-foreground))]">Membership</label>
                    <select 
                      value={newUser.membership}
                      onChange={(e) => setNewUser({...newUser, membership: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-900/50 border border-[hsl(var(--border))] rounded-xl text-sm font-bold outline-none focus:border-[hsl(var(--primary))] text-[hsl(var(--foreground))] cursor-pointer"
                    >
                      <option value="BRONZE" className="bg-slate-900">BRONZE</option>
                      <option value="SILVER" className="bg-slate-900">SILVER</option>
                      <option value="GOLD" className="bg-slate-900">GOLD</option>
                      <option value="DIAMOND" className="bg-slate-900">DIAMOND</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading} className="rounded-xl bg-[hsl(var(--primary))] text-slate-950 hover:bg-[hsl(var(--primary))]/90 font-bold">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Simpan
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
