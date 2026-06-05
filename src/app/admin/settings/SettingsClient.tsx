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
      <div className="bg-[hsl(var(--card))] p-6 rounded-3xl shadow-sm border border-[hsl(var(--border))]">
        <h1 className="text-2xl font-extrabold font-heading text-[hsl(var(--foreground))]">Store Settings</h1>
        <p className="text-sm text-[hsl(var(--foreground))]/60 mt-1">Configure your marketplace platform.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Navigation / Sections */}
        <div className="xl:col-span-1 space-y-2">
          <div className="bg-[hsl(var(--card))] rounded-3xl p-4 shadow-sm border border-[hsl(var(--border))] space-y-1">
            <button 
              onClick={() => setActiveTab("website")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${
                activeTab === "website" ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))]/60 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] font-medium"
              }`}
            >
              <Globe className={`w-5 h-5 ${activeTab === "website" ? "text-[hsl(var(--primary))]" : ""}`} /> Website Settings
            </button>
            <button 
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${
                activeTab === "media" ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--foreground))]" : "text-[hsl(var(--foreground))]/60 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] font-medium"
              }`}
            >
              <ImageIcon className={`w-5 h-5 ${activeTab === "media" ? "text-[hsl(var(--primary))]" : ""}`} /> Media & Assets
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[hsl(var(--foreground))]/60 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] font-medium rounded-xl transition-colors">
              <CreditCard className="w-5 h-5" /> Payment Gateways
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[hsl(var(--foreground))]/60 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] font-medium rounded-xl transition-colors">
              <Key className="w-5 h-5" /> API & Reseller
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-[hsl(var(--foreground))]/60 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))] font-medium rounded-xl transition-colors">
              <SettingsIcon className="w-5 h-5" /> Advanced
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="xl:col-span-2">
          <form onSubmit={handleSave} className="bg-[hsl(var(--card))] rounded-3xl shadow-sm border border-[hsl(var(--border))] overflow-hidden">
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
                      <h2 className="text-lg font-bold font-heading text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2">General Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[hsl(var(--foreground))]">Store Name</Label>
                          <Input 
                            value={settings["store_name"] || "MiqStore"} 
                            onChange={(e) => updateSetting("store_name", e.target.value)}
                            className="h-12 bg-[hsl(var(--secondary))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-xl" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-[hsl(var(--foreground))]">Support Email</Label>
                          <Input 
                            type="email"
                            value={settings["store_email"] || "support@miqstore.com"} 
                            onChange={(e) => updateSetting("store_email", e.target.value)} 
                            className="h-12 bg-[hsl(var(--secondary))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-xl" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-[hsl(var(--foreground))]">Store Description (SEO)</Label>
                        <textarea 
                          value={settings["store_description"] || "Platform top up game tercepat, termurah, dan terpercaya."}
                          onChange={(e) => updateSetting("store_description", e.target.value)}
                          className="w-full h-24 p-4 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] rounded-xl text-sm outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h2 className="text-lg font-bold font-heading text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2">Appearance</h2>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="maintenance"
                          checked={settings["maintenance_mode"] === "true"}
                          onChange={(e) => updateSetting("maintenance_mode", e.target.checked ? "true" : "false")}
                          className="w-4 h-4 rounded border-[hsl(var(--border))] bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] accent-[hsl(var(--primary))] cursor-pointer" 
                        />
                        <label htmlFor="maintenance" className="text-sm font-bold text-[hsl(var(--foreground))] cursor-pointer">
                          Enable Maintenance Mode
                        </label>
                      </div>
                      <p className="text-xs text-[hsl(var(--foreground))]/50 -mt-2 ml-6">When active, only admins can access the store front.</p>
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
                      <h2 className="text-lg font-bold font-heading text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))] pb-2">Site Media & Assets</h2>
                      <p className="text-sm text-[hsl(var(--foreground))]/60 mb-6">Manage global images like logos and banners. These are uploaded securely to Cloudinary.</p>
                      
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

            <div className="p-6 sm:px-8 sm:py-6 bg-[hsl(var(--secondary))]/30 border-t border-[hsl(var(--border))] flex justify-end mt-4">
              <Button type="submit" disabled={isLoading} className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--secondary))] text-white font-bold rounded-xl shadow-lg shadow-[hsl(var(--primary))]/20 transition-all h-12 px-8">
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
