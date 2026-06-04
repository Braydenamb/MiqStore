"use client";

import { useState } from "react";
import { Save, Globe, CreditCard, Key, Settings as SettingsIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { saveAdminSettings } from "@/actions/admin-settings";
import { UploadZone } from "@/components/admin/UploadZone";

export default function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState("website");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const res = await saveAdminSettings(settings);
    
    if (res.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error(res.error || "Failed to update settings");
    }
    setIsLoading(false);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-extrabold font-heading text-[var(--color-navy)]">Store Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your marketplace platform.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Navigation / Sections */}
        <div className="xl:col-span-1 space-y-2">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-1">
            <button 
              onClick={() => setActiveTab("website")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${
                activeTab === "website" ? "bg-[var(--color-teal)]/10 text-[var(--color-navy)]" : "text-gray-500 hover:bg-gray-50 hover:text-[var(--color-navy)] font-medium"
              }`}
            >
              <Globe className={`w-5 h-5 ${activeTab === "website" ? "text-[var(--color-teal)]" : ""}`} /> Website Settings
            </button>
            <button 
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${
                activeTab === "media" ? "bg-[var(--color-teal)]/10 text-[var(--color-navy)]" : "text-gray-500 hover:bg-gray-50 hover:text-[var(--color-navy)] font-medium"
              }`}
            >
              <ImageIcon className={`w-5 h-5 ${activeTab === "media" ? "text-[var(--color-teal)]" : ""}`} /> Media & Assets
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
        <div className="xl:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              
              <AnimatePresence mode="wait">
                {activeTab === "website" && (
                  <motion.div 
                    key="website"
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold font-heading text-[var(--color-navy)] border-b border-gray-100 pb-2">General Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--color-navy)]">Store Name</Label>
                          <Input 
                            value={settings["store_name"] || "MiqStore"} 
                            onChange={(e) => updateSetting("store_name", e.target.value)}
                            className="h-12 bg-gray-50 border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[var(--color-navy)]">Support Email</Label>
                          <Input 
                            type="email"
                            value={settings["store_email"] || "support@miqstore.com"} 
                            onChange={(e) => updateSetting("store_email", e.target.value)} 
                            className="h-12 bg-gray-50 border-gray-200 focus:border-[var(--color-teal)] focus:ring-[var(--color-teal)] rounded-xl" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[var(--color-navy)]">Store Description (SEO)</Label>
                        <textarea 
                          value={settings["store_description"] || "Platform top up game tercepat, termurah, dan terpercaya."}
                          onChange={(e) => updateSetting("store_description", e.target.value)}
                          className="w-full h-24 p-4 bg-gray-50 border border-gray-200 focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)] rounded-xl text-sm outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-lg font-bold font-heading text-[var(--color-navy)] border-b border-gray-100 pb-2">Appearance</h2>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="maintenance"
                          checked={settings["maintenance_mode"] === "true"}
                          onChange={(e) => updateSetting("maintenance_mode", e.target.checked ? "true" : "false")}
                          className="w-4 h-4 rounded border-gray-300 text-[var(--color-teal)] focus:ring-[var(--color-teal)] accent-[var(--color-teal)] cursor-pointer" 
                        />
                        <label htmlFor="maintenance" className="text-sm font-bold text-[var(--color-navy)] cursor-pointer">
                          Enable Maintenance Mode
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 -mt-2 ml-6">When active, only admins can access the store front.</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "media" && (
                  <motion.div 
                    key="media"
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <h2 className="text-lg font-bold font-heading text-[var(--color-navy)] border-b border-gray-100 pb-2">Site Media & Assets</h2>
                      <p className="text-sm text-gray-500 mb-6">Manage global images like logos and banners. These are uploaded securely to Cloudinary.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <UploadZone 
                          label="Main Site Logo" 
                          folder="Assets"
                          recommendedAspect="Transparent PNG / 400x120px"
                          defaultValue={settings["site_logo"]}
                          onUpload={(publicId) => updateSetting("site_logo", publicId)}
                        />
                        
                        <UploadZone 
                          label="Auth Page Background" 
                          folder="Assets"
                          recommendedAspect="16:9 / 1920x1080px"
                          defaultValue={settings["auth_background"]}
                          onUpload={(publicId) => updateSetting("auth_background", publicId)}
                        />

                        <div className="md:col-span-2">
                          <UploadZone 
                            label="Hero Section Banner (Home)" 
                            folder="Assets"
                            recommendedAspect="16:9 / 1920x1080px"
                            defaultValue={settings["hero_banner"]}
                            onUpload={(publicId) => updateSetting("hero_banner", publicId)}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            <div className="p-6 sm:px-8 sm:py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end mt-4">
              <Button type="submit" disabled={isLoading} className="bg-[var(--color-teal)] hover:bg-[var(--color-navy)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-teal)]/20 transition-all h-12 px-8">
                {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                Save Settings
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
