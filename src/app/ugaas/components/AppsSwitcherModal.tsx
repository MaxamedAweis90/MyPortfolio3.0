"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutGrid,
  Globe,
  FolderKanban,
  Briefcase,
  User,
  Mail,
  ExternalLink,
  LayoutDashboard,
  Award,
  Inbox,
  FolderCode,
  GraduationCap,
  Database,
  Github,
  Plus,
  ArrowLeft,
  Check,
  Trash2,
  Link2,
  Image as ImageIcon,
  X,
  Sliders,
  MonitorSmartphone,
  History,
} from "lucide-react";
import { toast } from "react-toastify";

interface AppsSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CustomAppTile {
  id: string;
  name: string;
  category: "Showcase" | "Management" | "External";
  href: string;
  iconType: "favicon" | "image" | "builtin";
  imageUrl?: string;
  color?: string;
  isCustom?: boolean;
}

const defaultTiles = [
  // Public Showcase
  {
    name: "Public Home",
    category: "Showcase" as const,
    href: "/",
    icon: Globe,
    color: "#0B82EC",
    isExternal: true,
  },
  {
    name: "Projects Catalog",
    category: "Showcase" as const,
    href: "/work",
    icon: FolderKanban,
    color: "#3B82F6",
    isExternal: true,
  },
  {
    name: "Experience",
    category: "Showcase" as const,
    href: "/experience",
    icon: Briefcase,
    color: "#2DD4BF",
    isExternal: true,
  },
  {
    name: "Certifications",
    category: "Showcase" as const,
    href: "/experience#certifications",
    icon: Award,
    color: "#F59E0B",
    isExternal: true,
  },
  {
    name: "About Me",
    category: "Showcase" as const,
    href: "/about",
    icon: User,
    color: "#A855F7",
    isExternal: true,
  },
  {
    name: "Contact Form",
    category: "Showcase" as const,
    href: "/#contact",
    icon: Mail,
    color: "#EC4899",
    isExternal: true,
  },

  // CMS & Admin Features
  {
    name: "Overview",
    category: "Management" as const,
    href: "/ugaas",
    icon: LayoutDashboard,
    color: "#0B82EC",
  },
  {
    name: "Projects CMS",
    category: "Management" as const,
    href: "/ugaas/projects",
    icon: FolderCode,
    color: "#3B82F6",
  },
  {
    name: "Experience CMS",
    category: "Management" as const,
    href: "/ugaas/experience",
    icon: GraduationCap,
    color: "#2DD4BF",
  },
  {
    name: "Inquiries Inbox",
    category: "Management" as const,
    href: "/ugaas/inquiries",
    icon: Inbox,
    color: "#6366F1",
  },
  {
    name: "Active Sessions",
    category: "Management" as const,
    href: "/ugaas/settings",
    icon: MonitorSmartphone,
    color: "#10B981",
  },
  {
    name: "Audit Logs",
    category: "Management" as const,
    href: "/ugaas/logs",
    icon: History,
    color: "#F59E0B",
  },
  {
    name: "Console Settings",
    category: "Management" as const,
    href: "/ugaas/settings",
    icon: Sliders,
    color: "#8B5CF6",
  },

  // External / Utilities
  {
    name: "GitHub Repo",
    category: "External" as const,
    href: "https://github.com/MaxamedAweis90",
    icon: Github,
    color: "#E2E8F0",
    isExternal: true,
  },
  {
    name: "MongoDB Atlas",
    category: "External" as const,
    href: "https://cloud.mongodb.com",
    icon: Database,
    color: "#10B981",
    isExternal: true,
  },
];

export function AppsSwitcherModal({ isOpen, onClose }: AppsSwitcherModalProps) {
  const [filter, setFilter] = useState<"All" | "Showcase" | "Management">("All");
  const [customApps, setCustomApps] = useState<CustomAppTile[]>([]);
  const [isAddingMode, setIsAddingMode] = useState(false);

  // Form states for Add App
  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [iconMode, setIconMode] = useState<"favicon" | "image">("favicon");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [category, setCategory] = useState<"Showcase" | "Management" | "External">("External");

  // Load custom apps from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ugaas_custom_apps");
      if (saved) {
        setCustomApps(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const saveCustomApps = (newApps: CustomAppTile[]) => {
    setCustomApps(newApps);
    try {
      localStorage.setItem("ugaas_custom_apps", JSON.stringify(newApps));
    } catch {
      // ignore
    }
  };

  // Helper to extract domain for Google Favicon API
  const getDomain = (url: string) => {
    try {
      const formatted = url.startsWith("http") ? url : `https://${url}`;
      const parsed = new URL(formatted);
      return parsed.hostname;
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    const domain = getDomain(url);
    if (!domain) return "";
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  };

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !appUrl.trim()) {
      toast.warn("Please provide both an app name and URL.");
      return;
    }

    const formattedUrl =
      appUrl.startsWith("http") || appUrl.startsWith("/")
        ? appUrl.trim()
        : `https://${appUrl.trim()}`;

    const newApp: CustomAppTile = {
      id: Date.now().toString(),
      name: appName.trim(),
      category,
      href: formattedUrl,
      iconType: iconMode,
      imageUrl:
        iconMode === "favicon"
          ? getFaviconUrl(formattedUrl)
          : customImageUrl.trim() || getFaviconUrl(formattedUrl),
      color: "#0B82EC",
      isCustom: true,
    };

    const updated = [...customApps, newApp];
    saveCustomApps(updated);
    toast.success(`App "${appName}" added successfully!`);

    // Reset Form
    setAppName("");
    setAppUrl("");
    setCustomImageUrl("");
    setIsAddingMode(false);
  };

  const handleDeleteCustomApp = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = customApps.filter((a) => a.id !== id);
    saveCustomApps(updated);
    toast.success("App shortcut removed.");
  };

  // Combine default tiles and custom tiles
  const allTiles = [
    ...defaultTiles.map((t) => ({ ...t, isCustom: false })),
    ...customApps.map((c) => ({
      name: c.name,
      category: c.category,
      href: c.href,
      icon: null,
      imageUrl: c.imageUrl,
      color: c.color || "#0B82EC",
      isExternal: c.href.startsWith("http"),
      isCustom: true,
      id: c.id,
    })),
  ];

  const filteredTiles =
    filter === "All"
      ? allTiles
      : allTiles.filter(
          (t) =>
            t.category === filter ||
            (filter === "Showcase" && t.category === "External")
        );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />

          {/* Bottom Sliding Drawer Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-50 w-full max-w-2xl max-h-[85vh] flex flex-col rounded-t-[28px] border-t border-x border-borderSubtle bg-[#0E131D]/95 backdrop-blur-2xl shadow-2xl shadow-black/90 overflow-hidden"
          >
            {/* Top Drag Handle */}
            <div className="pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-borderSubtle hover:bg-[#0B82EC]/80 transition-colors cursor-grab" />
            </div>

            {/* Header */}
            <div className="px-5 sm:px-6 pb-3 border-b border-borderSubtle shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC] shadow-sm">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>Application Launcher</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#111622] text-[#2DD4BF] border border-[#2DD4BF]/30 font-bold">
                        Bottom Dock
                      </span>
                    </h3>
                    <p className="text-xs text-mutedText mt-0.5 flex items-center gap-1.5">
                      <span>
                        {isAddingMode
                          ? "Add a custom web application or tool shortcut."
                          : "Quick access to public showcase routes and CMS consoles."}
                      </span>
                      {!isAddingMode && (
                        <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-800/40">
                          Toggle: {typeof window !== "undefined" ? localStorage.getItem("ugaas_apps_shortcut") || "Ctrl+K" : "Ctrl+K"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isAddingMode && (
                    <Button
                      size="sm"
                      onClick={() => setIsAddingMode(true)}
                      className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs h-8 px-2.5 gap-1.5 font-bold shadow-md shadow-[#0B82EC]/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add App</span>
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-surface border border-borderSubtle text-mutedText hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Filter Tabs (when not adding) */}
              {!isAddingMode && (
                <div className="flex items-center gap-1.5 pt-3">
                  {(["All", "Showcase", "Management"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        filter === tab
                          ? "bg-[#0B82EC] text-white shadow-sm"
                          : "bg-[#111622] text-mutedText hover:text-white border border-borderSubtle"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
              {/* 1. ADD APP FORM VIEW */}
              {isAddingMode ? (
                <form onSubmit={handleAddApp} className="space-y-4">
                  <div className="space-y-3">
                    {/* App Name */}
                    <div className="space-y-1">
                      <Label htmlFor="app-name" className="text-xs font-semibold text-mutedText">
                        App / Tool Name *
                      </Label>
                      <Input
                        id="app-name"
                        required
                        placeholder="e.g. Vercel Dashboard, Figma, Linear"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* App Link or URL */}
                    <div className="space-y-1">
                      <Label htmlFor="app-url" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-[#0B82EC]" />
                        App Link or URL *
                      </Label>
                      <Input
                        id="app-url"
                        required
                        placeholder="https://vercel.com or /custom-route"
                        value={appUrl}
                        onChange={(e) => setAppUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* Icon Source Mode: Favicon or Custom Image */}
                    <div className="space-y-2 pt-1">
                      <Label className="text-xs font-semibold text-mutedText flex items-center justify-between">
                        <span>Icon Source</span>
                        <span className="text-[10px] text-[#2DD4BF]">Auto Favicon or Custom URL</span>
                      </Label>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setIconMode("favicon")}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            iconMode === "favicon"
                              ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white"
                              : "bg-[#111622] border-[#222938] text-mutedText hover:text-white"
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5 text-[#0B82EC]" />
                          <span>Website Favicon (Auto)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIconMode("image")}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            iconMode === "image"
                              ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white"
                              : "bg-[#111622] border-[#222938] text-mutedText hover:text-white"
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#2DD4BF]" />
                          <span>Custom Image URL</span>
                        </button>
                      </div>

                      {iconMode === "image" && (
                        <div className="space-y-1 pt-1">
                          <Input
                            placeholder="https://.../icon.png or /Hero3DMe.png"
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                            className="bg-[#111622] border-[#222938] text-white text-xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-mutedText">Category</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(["External", "Showcase", "Management"] as const).map((cat) => (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                              category === cat
                                ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white"
                                : "bg-[#111622] border-[#222938] text-mutedText hover:text-white"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Preview Tile */}
                    {appUrl && (
                      <div className="p-3 rounded-xl bg-[#111622] border border-[#0B82EC]/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#161C2C] border border-[#222938] flex items-center justify-center overflow-hidden shrink-0">
                            {iconMode === "favicon" ? (
                              <Image
                                src={getFaviconUrl(appUrl)}
                                alt="Favicon"
                                width={24}
                                height={24}
                                className="rounded"
                                onError={() => {}}
                              />
                            ) : customImageUrl ? (
                              <Image
                                src={customImageUrl}
                                alt="Custom Icon"
                                width={24}
                                height={24}
                                className="rounded object-cover"
                                onError={() => {}}
                              />
                            ) : (
                              <Globe className="w-5 h-5 text-[#0B82EC]" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              {appName || "App Name Preview"}
                            </p>
                            <p className="text-[10px] text-mutedText truncate max-w-[200px]">
                              {appUrl}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0E131D] text-[#2DD4BF] border border-[#2DD4BF]/20">
                          Live Preview
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-borderSubtle">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingMode(false)}
                      className="border-borderSubtle text-primaryText hover:text-white text-xs h-9"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                    </Button>

                    <Button
                      type="submit"
                      className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs h-9 font-bold gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Save App Shortcut
                    </Button>
                  </div>
                </form>
              ) : (
                /* 2. DENSE GRID VIEW */
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pb-2">
                  {filteredTiles.map((tile) => {
                    const Icon = (tile as any).icon;
                    const isCustom = tile.isCustom;
                    const tileId = (tile as any).id;

                    return (
                      <Link
                        key={tile.name + tile.href}
                        href={tile.href}
                        target={tile.isExternal ? "_blank" : undefined}
                        rel={tile.isExternal ? "noopener noreferrer" : undefined}
                        onClick={onClose}
                        className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-[#111622] border border-[#222938] hover:border-[#0B82EC]/60 hover:bg-[#161C2C] hover:shadow-lg hover:shadow-[#0B82EC]/10 hover:-translate-y-0.5 active:scale-95 transition-all group text-center cursor-pointer relative"
                      >
                        {/* Delete Button for Custom Tiles */}
                        {isCustom && tileId && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomApp(tileId, e)}
                            title="Remove App"
                            className="w-5 h-5 rounded-full bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-all z-10"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}

                        {/* External Indicator */}
                        {tile.isExternal && !isCustom && (
                          <ExternalLink className="w-2.5 h-2.5 text-mutedText/60 group-hover:text-mutedText absolute top-2 right-2 transition-colors" />
                        )}

                        {/* Icon Container */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-sm border border-borderSubtle/60 overflow-hidden"
                          style={{
                            backgroundColor: `${tile.color}15`,
                            color: tile.color,
                          }}
                        >
                          {(tile as any).imageUrl ? (
                            <Image
                              src={(tile as any).imageUrl}
                              alt={tile.name}
                              width={22}
                              height={22}
                              className="rounded object-contain"
                              onError={() => {}}
                            />
                          ) : Icon ? (
                            <Icon className="w-5 h-5" />
                          ) : (
                            <Globe className="w-5 h-5" />
                          )}
                        </div>

                        {/* Short Label */}
                        <span className="text-[11px] sm:text-xs font-bold text-gray-200 group-hover:text-white tracking-tight leading-tight line-clamp-1 w-full">
                          {tile.name}
                        </span>
                      </Link>
                    );
                  })}

                  {/* "+ Add App" Grid Tile shortcut */}
                  <button
                    type="button"
                    onClick={() => setIsAddingMode(true)}
                    className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-[#111622]/50 border border-dashed border-[#222938] hover:border-[#0B82EC] hover:bg-[#0B82EC]/10 transition-all group text-center cursor-pointer active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-[#0B82EC]/15 border border-[#0B82EC]/30 text-[#0B82EC] group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#0B82EC] group-hover:text-white tracking-tight leading-tight">
                      Add App
                    </span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
