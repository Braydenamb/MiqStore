"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Gamepad2,
  CheckCircle2,
  XCircle,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UploadZone } from "@/components/admin/UploadZone";

const mockGames = [
  { id: 1, name: "Mobile Legends", slug: "mobile-legends", products: 24, status: "active", image: "/images/ml.jpg" },
  { id: 2, name: "Free Fire", slug: "free-fire", products: 18, status: "active", image: "/images/ff.jpg" },
  { id: 3, name: "Valorant", slug: "valorant", products: 12, status: "active", image: "/images/valo.jpg" },
  { id: 4, name: "Genshin Impact", slug: "genshin-impact", products: 8, status: "inactive", image: "/images/genshin.jpg" },
  { id: 5, name: "PUBG Mobile", slug: "pubg-mobile", products: 15, status: "active", image: "/images/pubg.jpg" },
];

export default function AdminProducts() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-[var(--color-navy)]">Products Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage games, top-up nominals, and pricing.</p>
        </div>
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[var(--color-navy)] hover:bg-[var(--color-teal)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-navy)]/20 transition-all h-12 px-6"
        >
          {isAdding ? "Cancel" : <><Plus className="w-5 h-5 mr-2" /> Add New Game</>}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-lg font-bold font-heading text-[var(--color-navy)] mb-6">Create New Game</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-navy)]">Game Name</label>
                    <Input placeholder="e.g. Mobile Legends" className="h-12 bg-gray-50 border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-navy)]">Slug (URL)</label>
                    <Input placeholder="e.g. mobile-legends" className="h-12 bg-gray-50 border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--color-navy)]">Description</label>
                    <textarea 
                      placeholder="Short description for the game page..."
                      className="w-full h-24 p-4 bg-gray-50 border border-gray-200 focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)] rounded-xl text-sm outline-none resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <input type="checkbox" id="activeStatus" className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)] focus:ring-[var(--color-teal)] accent-[var(--color-teal)] cursor-pointer" defaultChecked />
                    <label htmlFor="activeStatus" className="text-sm font-bold text-[var(--color-navy)] cursor-pointer">Set as Active</label>
                  </div>
                </div>

                <div className="space-y-6">
                  <UploadZone label="Game Banner" recommendedAspect="16:9 / 1920x1080px" />
                  <UploadZone label="Square Icon (Optional)" recommendedAspect="1:1 / 512x512px" />
                  
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-[var(--color-teal)] hover:bg-[var(--color-navy)] text-white font-bold rounded-xl h-12 px-8 w-full sm:w-auto">
                      Save Game
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search games..." className="h-10 pl-10 bg-white border-gray-200 rounded-xl w-full" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="rounded-xl font-bold bg-white w-full sm:w-auto">Filter: All</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Game</th>
                <th className="px-6 py-4 whitespace-nowrap">Slug</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Items</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {mockGames.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                        {game.image ? (
                          <img src={game.image} alt={game.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = ""; e.currentTarget.classList.add("hidden"); }} />
                        ) : null}
                        <Gamepad2 className="w-6 h-6 text-gray-400 absolute -z-10" />
                      </div>
                      <span className="font-bold text-[var(--color-navy)] text-base group-hover:text-[var(--color-teal)] transition-colors">{game.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                    /{game.slug}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-teal)]/10 text-[var(--color-teal)] font-bold">
                      {game.products}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {game.status === "active" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 font-bold">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 px-3 py-1 font-bold">
                        <XCircle className="w-3 h-3 mr-1" /> Inactive
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[var(--color-navy)] rounded-lg md:hidden">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500 bg-gray-50/30">
          Showing 1 to 5 of 24 entries
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg" disabled>Prev</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg bg-[var(--color-navy)] text-white border-[var(--color-navy)]">1</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg">2</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
