"use client";

import { Save, Globe, CreditCard, Key, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings updated successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-extrabold font-heading text-[var(--color-navy)]">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your marketplace platform.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Navigation / Sections (Mock active state) */}
        <div className="xl:col-span-1 space-y-2">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-teal)]/10 text-[var(--color-navy)] font-bold rounded-xl transition-colors">
              <Globe className="w-5 h-5 text-[var(--color-teal)]" /> Website Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-navy)] font-medium rounded-xl transition-colors">
              <CreditCard className="w-5 h-5" /> Payment Gateways
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-navy)] font-medium rounded-xl transition-colors">
              <Key className="w-5 h-5" /> API & Reseller
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[var(--color-navy)] font-medium rounded-xl transition-colors">
              <SettingsIcon className="w-5 h-5" /> Advanced
            </button>
          </div>
        </div>

        {/* Content Area */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="xl:col-span-2"
        >
          <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              
              <div className="space-y-6">
                <h2 className="text-lg font-bold font-heading text-[var(--color-navy)] border-b border-gray-100 pb-2">General Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--color-navy)]">Store Name</Label>
                    <Input defaultValue="MiqStore" className="h-12 bg-gray-50 border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-[var(--color-navy)]">Support Email</Label>
                    <Input defaultValue="support@miqstore.com" type="email" className="h-12 bg-gray-50 border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-[var(--color-navy)]">Store Description (SEO)</Label>
                  <textarea 
                    defaultValue="Platform top up game tercepat, termurah, dan terpercaya."
                    className="w-full h-24 p-4 bg-gray-50 border border-gray-200 focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)] rounded-xl text-sm outline-none resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-bold font-heading text-[var(--color-navy)] border-b border-gray-100 pb-2">Appearance</h2>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="maintenance" className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)] focus:ring-[var(--color-teal)] accent-[var(--color-teal)] cursor-pointer" />
                  <label htmlFor="maintenance" className="text-sm font-bold text-[var(--color-navy)] cursor-pointer">
                    Enable Maintenance Mode
                  </label>
                </div>
                <p className="text-xs text-gray-500 -mt-2 ml-6">When active, only admins can access the store front.</p>
              </div>
              
            </div>

            <div className="p-6 sm:px-8 sm:py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <Button type="submit" className="bg-[var(--color-teal)] hover:bg-[var(--color-navy)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-teal)]/20 transition-all h-12 px-8">
                <Save className="w-5 h-5 mr-2" /> Save Settings
              </Button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
}
