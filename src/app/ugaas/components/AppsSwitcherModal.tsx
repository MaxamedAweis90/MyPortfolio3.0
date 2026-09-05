"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LayoutGrid,
  Globe,
  Plus,
  ArrowLeft,
  Check,
  Trash2,
  Edit3,
  X,
  Sliders,
  Settings,
  FolderPlus,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

interface AppsSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AppItem {
  id: string;
  name: string;
  url: string;
  category: string;
  iconType: "favicon" | "image";
  imageUrl?: string;
  color?: string;
}

const DEFAULT_CATEGORIES = ["General", "Cloud & Dev", "Social & Links"];

const DEFAULT_APPS: AppItem[] = [
  {
    id: "app-whatsapp",
    name: "WhatsApp Web",
    url: "https://web.whatsapp.com",
    category: "Social & Links",
    iconType: "favicon",
    color: "#25D366",
  },
  {
    id: "app-vercel",
    name: "Vercel Dashboard",
    url: "https://vercel.com",
    category: "Cloud & Dev",
    iconType: "favicon",
    color: "#FFFFFF",
  },
  {
    id: "app-github",
    name: "GitHub",
    url: "https://github.com",
    category: "Cloud & Dev",
    iconType: "favicon",
    color: "#E2E8F0",
  },
  {
    id: "app-mongodb",
    name: "MongoDB Atlas",
    url: "https://cloud.mongodb.com",
    category: "Cloud & Dev",
    iconType: "favicon",
    color: "#10B981",
  },
  {
    id: "app-ugaas",
    name: "Ugaas CMS Overview",
    url: "/ugaas",
    category: "General",
    iconType: "favicon",
    color: "#0B82EC",
  },
  {
    id: "app-portfolio",
    name: "Portfolio Live",
    url: "/",
    category: "General",
    iconType: "favicon",
    color: "#3B82F6",
  },
];

// Extract domain safely for Favicon loading
function getDomain(url: string) {
  try {
    const formatted = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(formatted);
    return parsed.hostname;
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string) {
  const domain = getDomain(url);
  if (!domain || domain.startsWith("/")) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

// Resilient Favicon Image component
function AppFavicon({
  url,
  imageUrl,
  name,
  size = 24,
}: {
  url: string;
  imageUrl?: string;
  name: string;
  size?: number;
}) {
  const [hasError, setHasError] = useState(false);

  let src = imageUrl;
  if (!src) {
    src = getFaviconUrl(url);
  }

  if (hasError || !src) {
    return (
      <Globe style={{ width: size, height: size }} className="text-[#0B82EC]" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className="rounded object-contain shrink-0"
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}

export function AppsSwitcherModal({ isOpen, onClose }: AppsSwitcherModalProps) {
  // Modal Views: "grid" | "add" | "settings" | "edit"
  const [currentView, setCurrentView] = useState<
    "grid" | "add" | "settings" | "edit"
  >("grid");

  // Search & Filter Category (default is "All")
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Categories & Apps State
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [apps, setApps] = useState<AppItem[]>(DEFAULT_APPS);

  // Form states for Add / Edit
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appName, setAppName] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [appCategory, setAppCategory] = useState("General");
  const [iconMode, setIconMode] = useState<"favicon" | "image">("favicon");
  const [customImageUrl, setCustomImageUrl] = useState("");

  // New Category input in Settings / Add mode
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isAddingNewCatInline, setIsAddingNewCatInline] = useState(false);

  // 1. Dynamic Light / Dark mode detection
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const domTheme = document.documentElement.getAttribute("data-theme");
      return (
        savedTheme === "dark" ||
        savedTheme === "mytheme" ||
        domTheme === "mytheme" ||
        domTheme === "dark"
      );
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const domTheme = document.documentElement.getAttribute("data-theme");
      const isDark =
        savedTheme === "dark" ||
        savedTheme === "mytheme" ||
        domTheme === "mytheme" ||
        domTheme === "dark";
      setIsDarkMode(isDark);
    };

    updateTheme();
    window.addEventListener("theme_changed", updateTheme);
    window.addEventListener("storage", updateTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-theme" ||
            mutation.attributeName === "class")
        ) {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => {
      window.removeEventListener("theme_changed", updateTheme);
      window.removeEventListener("storage", updateTheme);
      observer.disconnect();
    };
  }, []);

  // 2. Load custom apps & categories from localStorage
  useEffect(() => {
    try {
      const savedApps = localStorage.getItem("ugaas_apps_list_v2");
      const savedCats = localStorage.getItem("ugaas_apps_categories_v2");

      if (savedApps) {
        setApps(JSON.parse(savedApps));
      } else {
        localStorage.setItem(
          "ugaas_apps_list_v2",
          JSON.stringify(DEFAULT_APPS),
        );
      }

      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      } else {
        localStorage.setItem(
          "ugaas_apps_categories_v2",
          JSON.stringify(DEFAULT_CATEGORIES),
        );
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

  // Persist helpers
  const saveApps = (newApps: AppItem[]) => {
    setApps(newApps);
    try {
      localStorage.setItem("ugaas_apps_list_v2", JSON.stringify(newApps));
    } catch {
      // ignore
    }
  };

  const saveCategories = (newCats: string[]) => {
    setCategories(newCats);
    try {
      localStorage.setItem("ugaas_apps_categories_v2", JSON.stringify(newCats));
    } catch {
      // ignore
    }
  };

  // Add new Category
  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase() === "all") {
      toast.warn('"All" is reserved.');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      toast.info(`Category "${trimmed}" already exists.`);
      setNewCategoryInput("");
      return;
    }

    const updated = [...categories, trimmed];
    saveCategories(updated);
    setAppCategory(trimmed);
    setNewCategoryInput("");
    setIsAddingNewCatInline(false);
    toast.success(`Category "${trimmed}" created!`);
  };

  // Delete Category
  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      toast.warn("At least one category is required.");
      return;
    }
    const updatedCats = categories.filter((c) => c !== catToDelete);
    saveCategories(updatedCats);

    const fallbackCategory = updatedCats[0];
    const updatedApps = apps.map((a) =>
      a.category === catToDelete ? { ...a, category: fallbackCategory } : a,
    );
    saveApps(updatedApps);

    if (activeFilter === catToDelete) {
      setActiveFilter("All");
    }
    toast.success(`Category "${catToDelete}" removed.`);
  };

  // Open Edit App mode
  const handleStartEdit = (app: AppItem) => {
    setEditingAppId(app.id);
    setAppName(app.name);
    setAppUrl(app.url);
    setAppCategory(app.category || categories[0] || "General");
    setIconMode(app.iconType || "favicon");
    setCustomImageUrl(app.imageUrl || "");
    setCurrentView("edit");
  };

  // Open Add App mode
  const handleStartAdd = () => {
    setEditingAppId(null);
    setAppName("");
    setAppUrl("");
    setAppCategory(categories[0] || "General");
    setIconMode("favicon");
    setCustomImageUrl("");
    setCurrentView("add");
  };

  // Save App (both Add and Edit)
  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !appUrl.trim()) {
      toast.warn("Please provide both an app name and URL.");
      return;
    }

    const formattedUrl =
      appUrl.startsWith("http") || appUrl.startsWith("/")
        ? appUrl.trim()
        : `https://${appUrl.trim()}`;

    const iconUrl =
      iconMode === "image" && customImageUrl.trim()
        ? customImageUrl.trim()
        : getFaviconUrl(formattedUrl);

    if (currentView === "edit" && editingAppId) {
      const updated = apps.map((a) =>
        a.id === editingAppId
          ? {
              ...a,
              name: appName.trim(),
              url: formattedUrl,
              category: appCategory,
              iconType: iconMode,
              imageUrl: iconUrl,
            }
          : a,
      );
      saveApps(updated);
      toast.success(`App "${appName.trim()}" updated!`);
    } else {
      const newApp: AppItem = {
        id: `app-${Date.now()}`,
        name: appName.trim(),
        url: formattedUrl,
        category: appCategory,
        iconType: iconMode,
        imageUrl: iconUrl,
        color: "#0B82EC",
      };
      saveApps([...apps, newApp]);
      toast.success(`App "${appName.trim()}" added!`);
    }

    setCurrentView("grid");
  };

  // Delete App
  const handleDeleteApp = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updated = apps.filter((a) => a.id !== id);
    saveApps(updated);
    toast.success("App removed.");
  };

  // Reset to default apps
  const handleResetDefaults = () => {
    if (confirm("Reset application dock to default apps?")) {
      saveApps(DEFAULT_APPS);
      saveCategories(DEFAULT_CATEGORIES);
      setActiveFilter("All");
      setSearchQuery("");
      toast.info("Reset to default real apps.");
    }
  };

  // Filter apps based on category and search query
  const filteredApps = useMemo(() => {
    return apps.filter((a) => {
      const matchesCategory =
        activeFilter === "All" || a.category === activeFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [apps, activeFilter, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 sm:pb-6 pointer-events-auto">
          {/* Backdrop with 70% dark tone and blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={`fixed inset-0 backdrop-blur-md z-40 cursor-pointer ${
              isDarkMode ? "bg-black/60" : "bg-slate-900/40"
            }`}
          />

          {/* FIXED BOTTOM-POSITIONED MODAL WINDOW (Sliding from bottom like Windows menu) */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className={`relative z-50 w-full max-w-3xl h-[650px] max-h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-3xl border shadow-2xl overflow-hidden transition-colors duration-200 ${
              isDarkMode
                ? "bg-[#0B0F17]/70 backdrop-blur-2xl border-white/10 text-slate-100 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)]"
                : "bg-white/70 backdrop-blur-2xl border-slate-200/90 text-slate-900 shadow-[0_30px_90px_-20px_rgba(15,23,42,0.22)]"
            }`}
          >
            {/* 1. FIXED TOP MENU & HEADER (COVERS ENTIRE TOP WITH INTEGRATED GRIP) */}
            <div
              className={`shrink-0 border-b backdrop-blur-xl px-5 sm:px-6 pt-2 pb-4 space-y-3 z-20 transition-colors duration-200 rounded-t-[28px] sm:rounded-t-3xl ${
                isDarkMode
                  ? "border-white/10 bg-[#0B0F17]/90"
                  : "border-slate-200/80 bg-white/95 shadow-xs"
              }`}
            >
              {/* Top Windows-style Drag/Grip Handle */}
              <div className="pt-1 pb-1 flex justify-center shrink-0">
                <div
                  className={`w-12 h-1.5 rounded-full transition-colors cursor-grab ${
                    isDarkMode
                      ? "bg-white/15 hover:bg-[#0B82EC]"
                      : "bg-slate-300 hover:bg-[#0B82EC]"
                  }`}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC] shadow-sm shrink-0">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-base sm:text-lg font-extrabold tracking-tight truncate ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        Applications & Shortcuts
                      </h3>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#0B82EC]/15 text-[#0B82EC] border border-[#0B82EC]/30 shrink-0">
                        {apps.length} Apps
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        isDarkMode ? "text-mutedText" : "text-slate-500"
                      }`}
                    >
                      {currentView === "settings"
                        ? "Manage custom categories and edit your application links."
                        : currentView === "add" || currentView === "edit"
                          ? "Configure app title, destination URL, and custom icon."
                          : "Quick access hub for work apps, developer consoles, and personal links."}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {currentView === "grid" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleStartAdd}
                        className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs h-8 px-3 gap-1.5 font-bold shadow-md shadow-[#0B82EC]/20 active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add App</span>
                      </Button>

                      <button
                        type="button"
                        onClick={() => setCurrentView("settings")}
                        title="Open Categories & App Settings"
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          isDarkMode
                            ? "bg-white/5 hover:bg-white/10 border-white/10 text-mutedText hover:text-white"
                            : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentView("grid")}
                      className={`text-xs h-8 px-3 gap-1.5 ${
                        isDarkMode
                          ? "border-white/15 text-primaryText hover:text-white"
                          : "border-slate-300 text-slate-700 hover:text-slate-900 bg-white"
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </Button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      isDarkMode
                        ? "bg-white/5 hover:bg-white/10 border-white/10 text-mutedText hover:text-white"
                        : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* FIXED SUB-MENU: Search bar & Category tabs (Only visible in Grid mode) */}
              {currentView === "grid" && (
                <div className="space-y-3 pt-1">
                  {/* Search Input */}
                  <div className="relative">
                    <Search
                      className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                        isDarkMode ? "text-mutedText" : "text-slate-400"
                      }`}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search apps by title, URL or category..."
                      className={`w-full h-8 pl-8 pr-3 text-xs border rounded-xl focus:outline-none focus:border-[#0B82EC] focus:ring-1 focus:ring-[#0B82EC]/50 transition-all ${
                        isDarkMode
                          ? "bg-black/40 border-white/10 text-white placeholder:text-mutedText/60"
                          : "bg-slate-100/90 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${
                          isDarkMode
                            ? "text-mutedText hover:text-white"
                            : "text-slate-400 hover:text-slate-700"
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Fixed Category Tabs Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                    {/* "All" tab */}
                    <button
                      type="button"
                      onClick={() => setActiveFilter("All")}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                        activeFilter === "All"
                          ? "bg-[#0B82EC] text-white shadow-md shadow-[#0B82EC]/30 font-bold"
                          : isDarkMode
                            ? "bg-white/5 text-mutedText hover:text-white hover:bg-white/10 border border-white/5"
                            : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
                      }`}
                    >
                      All ({apps.length})
                    </button>

                    {/* Dynamic categories (No Showcase / Management) */}
                    {categories.map((cat) => {
                      const count = apps.filter(
                        (a) => a.category === cat,
                      ).length;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveFilter(cat)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                            activeFilter === cat
                              ? "bg-[#0B82EC] text-white shadow-md shadow-[#0B82EC]/30 font-bold"
                              : isDarkMode
                                ? "bg-white/5 text-mutedText hover:text-white hover:bg-white/10 border border-white/5"
                                : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
                          }`}
                        >
                          {cat} {count > 0 ? `(${count})` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. SCROLLABLE CONTENT BODY (Scrolls smoothly when many apps exist) */}
            <div
              className={`flex-1 overflow-y-auto px-5 sm:px-6 py-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full ${
                isDarkMode
                  ? "[&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
                  : "[&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
              }`}
            >
              {/* VIEW A: ADD / EDIT APP FORM */}
              {currentView === "add" || currentView === "edit" ? (
                <form
                  onSubmit={handleSaveApp}
                  className="space-y-4 max-w-xl mx-auto py-2"
                >
                  <div
                    className={`space-y-4 border rounded-2xl p-5 ${
                      isDarkMode
                        ? "bg-black/30 border-white/10"
                        : "bg-slate-50/90 border-slate-200"
                    }`}
                  >
                    {/* App Name */}
                    <div>
                      <Label
                        className={`text-xs font-bold ${
                          isDarkMode ? "text-primaryText" : "text-slate-800"
                        }`}
                      >
                        App Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="e.g. WhatsApp Web, Vercel Dashboard, Notion"
                        className={`mt-1.5 text-xs h-9 focus:border-[#0B82EC] ${
                          isDarkMode
                            ? "bg-black/40 border-white/10 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                        required
                      />
                    </div>

                    {/* App URL */}
                    <div>
                      <Label
                        className={`text-xs font-bold ${
                          isDarkMode ? "text-primaryText" : "text-slate-800"
                        }`}
                      >
                        Link / Destination URL{" "}
                        <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        value={appUrl}
                        onChange={(e) => setAppUrl(e.target.value)}
                        placeholder="https://web.whatsapp.com or /ugaas"
                        className={`mt-1.5 text-xs h-9 focus:border-[#0B82EC] ${
                          isDarkMode
                            ? "bg-black/40 border-white/10 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                        required
                      />
                    </div>

                    {/* Category Selector with Inline Category Creator */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <Label
                          className={`text-xs font-bold ${
                            isDarkMode ? "text-primaryText" : "text-slate-800"
                          }`}
                        >
                          Category
                        </Label>
                        <button
                          type="button"
                          onClick={() =>
                            setIsAddingNewCatInline(!isAddingNewCatInline)
                          }
                          className="text-[11px] text-[#0B82EC] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <FolderPlus className="w-3 h-3" />
                          <span>+ New Category</span>
                        </button>
                      </div>

                      {isAddingNewCatInline && (
                        <div
                          className={`flex items-center gap-2 mb-2.5 p-2 rounded-xl border ${
                            isDarkMode
                              ? "bg-black/50 border-white/10"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <Input
                            value={newCategoryInput}
                            onChange={(e) =>
                              setNewCategoryInput(e.target.value)
                            }
                            placeholder="Type new category name..."
                            className={`text-xs h-8 ${
                              isDarkMode
                                ? "bg-black/60 border-white/10 text-white"
                                : "bg-slate-50 border-slate-300 text-slate-900"
                            }`}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleAddCategory}
                            className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs h-8 px-3 shrink-0 font-bold"
                          >
                            Add
                          </Button>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setAppCategory(cat)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              appCategory === cat
                                ? "bg-[#0B82EC]/20 border-[#0B82EC] text-[#0B82EC] font-bold shadow-xs"
                                : isDarkMode
                                  ? "bg-white/5 border-white/10 text-mutedText hover:text-white"
                                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Icon Source Picker */}
                    <div>
                      <Label
                        className={`text-xs font-bold mb-1.5 block ${
                          isDarkMode ? "text-primaryText" : "text-slate-800"
                        }`}
                      >
                        Icon Source
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setIconMode("favicon")}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            iconMode === "favicon"
                              ? "bg-[#0B82EC]/15 border-[#0B82EC] text-[#0B82EC] font-bold"
                              : isDarkMode
                                ? "bg-white/5 border-white/10 text-mutedText hover:text-white"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#0B82EC]" />
                          <span>Auto Favicon</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIconMode("image")}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            iconMode === "image"
                              ? "bg-[#0B82EC]/15 border-[#0B82EC] text-[#0B82EC] font-bold"
                              : isDarkMode
                                ? "bg-white/5 border-white/10 text-mutedText hover:text-white"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5 text-[#2DD4BF]" />
                          <span>Custom Image URL</span>
                        </button>
                      </div>

                      {iconMode === "image" && (
                        <Input
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://example.com/icon.png"
                          className={`mt-2 text-xs h-9 ${
                            isDarkMode
                              ? "bg-black/40 border-white/10 text-white"
                              : "bg-white border-slate-300 text-slate-900"
                          }`}
                        />
                      )}
                    </div>

                    {/* Live Preview Card */}
                    {appUrl && (
                      <div
                        className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                          isDarkMode
                            ? "bg-black/50 border-[#0B82EC]/40"
                            : "bg-blue-50/60 border-[#0B82EC]/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden shrink-0 shadow-sm ${
                              isDarkMode
                                ? "bg-[#161C2C] border-white/10"
                                : "bg-white border-slate-200"
                            }`}
                          >
                            <AppFavicon
                              url={appUrl}
                              imageUrl={
                                iconMode === "image"
                                  ? customImageUrl
                                  : undefined
                              }
                              name={appName || "Preview"}
                              size={22}
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-bold truncate ${
                                isDarkMode ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {appName || "App Name Preview"}
                            </p>
                            <p
                              className={`text-[10px] truncate max-w-[240px] ${
                                isDarkMode ? "text-mutedText" : "text-slate-500"
                              }`}
                            >
                              {appUrl}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#0B82EC]/15 text-[#0B82EC] border border-[#0B82EC]/30 shrink-0 font-bold">
                          {appCategory}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentView("grid")}
                      className={`text-xs h-9 ${
                        isDarkMode
                          ? "border-white/15 text-primaryText hover:text-white"
                          : "border-slate-300 text-slate-700 hover:text-slate-900 bg-white"
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Cancel
                    </Button>

                    <Button
                      type="submit"
                      className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs h-9 font-bold gap-1.5 shadow-md shadow-[#0B82EC]/30"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>
                        {currentView === "edit" ? "Save Changes" : "Save App"}
                      </span>
                    </Button>
                  </div>
                </form>
              ) : currentView === "settings" ? (
                /* VIEW B: SETTINGS & CATEGORIES MANAGEMENT */
                <div className="space-y-6 max-w-2xl mx-auto py-2">
                  {/* Category Management Card */}
                  <div
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkMode
                        ? "bg-black/30 border-white/10"
                        : "bg-slate-50/90 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4
                          className={`text-sm font-bold flex items-center gap-2 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          <FolderPlus className="w-4 h-4 text-[#0B82EC]" />
                          <span>Custom Categories</span>
                        </h4>
                        <p
                          className={`text-[11px] ${
                            isDarkMode ? "text-mutedText" : "text-slate-500"
                          }`}
                        >
                          Create, reorder, and remove categories for organizing
                          apps.
                        </p>
                      </div>
                    </div>

                    {/* Add Category Input */}
                    <div className="flex items-center gap-2">
                      <Input
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                        placeholder="Add new category (e.g. Work, Social, AI)..."
                        className={`text-xs h-9 focus:border-[#0B82EC] ${
                          isDarkMode
                            ? "bg-black/40 border-white/10 text-white"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                      />
                      <Button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs h-9 px-3.5 shrink-0 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add
                      </Button>
                    </div>

                    {/* Existing Categories List */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {categories.map((cat) => {
                        const count = apps.filter(
                          (a) => a.category === cat,
                        ).length;
                        return (
                          <div
                            key={cat}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                              isDarkMode
                                ? "bg-white/5 border-white/10 text-gray-200"
                                : "bg-white border-slate-200 text-slate-800 shadow-xs"
                            }`}
                          >
                            <span>{cat}</span>
                            <span
                              className={`text-[10px] font-mono ${
                                isDarkMode ? "text-mutedText" : "text-slate-400"
                              }`}
                            >
                              ({count})
                            </span>
                            {categories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat)}
                                title={`Delete ${cat} category`}
                                className="text-mutedText hover:text-red-500 transition-colors ml-1 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* App Management List */}
                  <div
                    className={`p-5 rounded-2xl border space-y-4 ${
                      isDarkMode
                        ? "bg-black/30 border-white/10"
                        : "bg-slate-50/90 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4
                          className={`text-sm font-bold flex items-center gap-2 ${
                            isDarkMode ? "text-white" : "text-slate-900"
                          }`}
                        >
                          <Sliders className="w-4 h-4 text-[#2DD4BF]" />
                          <span>Manage Apps ({apps.length})</span>
                        </h4>
                        <p
                          className={`text-[11px] ${
                            isDarkMode ? "text-mutedText" : "text-slate-500"
                          }`}
                        >
                          Edit details, reassign categories, or delete
                          shortcuts.
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResetDefaults}
                        className={`text-xs h-7 px-2.5 gap-1.5 ${
                          isDarkMode
                            ? "border-white/10 text-mutedText hover:text-white"
                            : "border-slate-300 text-slate-600 hover:text-slate-900 bg-white"
                        }`}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Defaults</span>
                      </Button>
                    </div>

                    <div
                      className={`divide-y ${
                        isDarkMode ? "divide-white/5" : "divide-slate-200"
                      }`}
                    >
                      {apps.map((app) => (
                        <div
                          key={app.id}
                          className="py-3 flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl border flex items-center justify-center overflow-hidden shrink-0 ${
                                isDarkMode
                                  ? "bg-black/40 border-white/10"
                                  : "bg-white border-slate-200 shadow-xs"
                              }`}
                            >
                              <AppFavicon
                                url={app.url}
                                imageUrl={app.imageUrl}
                                name={app.name}
                                size={18}
                              />
                            </div>
                            <div className="min-w-0">
                              <p
                                className={`text-xs font-bold truncate ${
                                  isDarkMode ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {app.name}
                              </p>
                              <p
                                className={`text-[10px] truncate max-w-[240px] ${
                                  isDarkMode
                                    ? "text-mutedText"
                                    : "text-slate-500"
                                }`}
                              >
                                {app.url}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                                isDarkMode
                                  ? "bg-white/5 text-mutedText border-white/10"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {app.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(app)}
                              title="Edit app"
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                                isDarkMode
                                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-mutedText hover:text-[#0B82EC]"
                                  : "bg-white hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-[#0B82EC]"
                              }`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteApp(app.id)}
                              title="Delete app"
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                                isDarkMode
                                  ? "bg-white/5 hover:bg-white/10 border-white/10 text-mutedText hover:text-red-400"
                                  : "bg-white hover:bg-red-50 border-slate-200 text-slate-600 hover:text-red-500"
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW C: MODERN APP GRID (SCROLLABLE) */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 pb-2">
                  {filteredApps.map((tile) => {
                    const isExternal =
                      tile.url.startsWith("http") ||
                      tile.url.startsWith("https");

                    return (
                      <div
                        key={tile.id}
                        className={`relative flex flex-col items-center justify-between p-4 rounded-2xl border hover:-translate-y-1 transition-all duration-200 group text-center cursor-pointer ${
                          isDarkMode
                            ? "bg-white/[0.03] border-white/[0.06] hover:border-[#0B82EC]/50 hover:bg-[#0B82EC]/[0.08] hover:shadow-xl hover:shadow-[#0B82EC]/15"
                            : "bg-slate-50/70 border-slate-200/80 hover:border-[#0B82EC]/60 hover:bg-blue-50/80 hover:shadow-lg hover:shadow-blue-500/10"
                        }`}
                      >
                        {/* Quick Edit & Delete Hover Actions */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStartEdit(tile);
                            }}
                            title="Edit app"
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                              isDarkMode
                                ? "bg-black/60 text-mutedText hover:text-[#0B82EC] border-white/10"
                                : "bg-white text-slate-500 hover:text-[#0B82EC] border-slate-200 shadow-xs"
                            }`}
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteApp(tile.id, e)}
                            title="Delete app"
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                              isDarkMode
                                ? "bg-black/60 text-mutedText hover:text-red-400 border-white/10"
                                : "bg-white text-slate-500 hover:text-red-500 border-slate-200 shadow-xs"
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Main App Link */}
                        <Link
                          href={tile.url}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          onClick={onClose}
                          className="w-full flex flex-col items-center justify-center"
                        >
                          {/* Premium Icon Container */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 border shadow-md group-hover:scale-110 group-hover:border-[#0B82EC]/40 transition-all duration-200 overflow-hidden ${
                              isDarkMode
                                ? "bg-black/40 border-white/10"
                                : "bg-white border-slate-200 shadow-sm"
                            }`}
                            style={{
                              borderColor: `${tile.color || "#0B82EC"}40`,
                            }}
                          >
                            <AppFavicon
                              url={tile.url}
                              imageUrl={tile.imageUrl}
                              name={tile.name}
                              size={26}
                            />
                          </div>

                          {/* App Title */}
                          <span
                            className={`text-xs sm:text-sm font-bold tracking-tight leading-tight line-clamp-1 w-full ${
                              isDarkMode
                                ? "text-slate-100 group-hover:text-white"
                                : "text-slate-800 group-hover:text-[#0B82EC]"
                            }`}
                          >
                            {tile.name}
                          </span>

                          {/* Category Subtitle */}
                          <span
                            className={`text-[10px] mt-1 line-clamp-1 font-medium ${
                              isDarkMode
                                ? "text-mutedText/75"
                                : "text-slate-500"
                            }`}
                          >
                            {tile.category}
                          </span>
                        </Link>
                      </div>
                    );
                  })}

                  {/* "+ Add App" Shortcut Card inside Grid */}
                  <button
                    type="button"
                    onClick={handleStartAdd}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed transition-all duration-200 group text-center cursor-pointer min-h-[120px] active:scale-95 ${
                      isDarkMode
                        ? "bg-white/[0.015] border-white/15 hover:border-[#0B82EC] hover:bg-[#0B82EC]/10"
                        : "bg-slate-50/50 border-slate-300 hover:border-[#0B82EC] hover:bg-blue-50/60"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 bg-[#0B82EC]/15 border border-[#0B82EC]/30 text-[#0B82EC] group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#0B82EC] group-hover:underline tracking-tight leading-tight">
                      Add App
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        isDarkMode ? "text-mutedText/60" : "text-slate-400"
                      }`}
                    >
                      New shortcut
                    </span>
                  </button>
                </div>
              )}

              {/* Empty Search / Filter State */}
              {currentView === "grid" && filteredApps.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <div
                    className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto ${
                      isDarkMode
                        ? "bg-white/5 border-white/10 text-mutedText"
                        : "bg-slate-100 border-slate-200 text-slate-400"
                    }`}
                  >
                    <Search className="w-5 h-5" />
                  </div>
                  <p
                    className={`text-sm font-bold ${
                      isDarkMode ? "text-white" : "text-slate-800"
                    }`}
                  >
                    No apps found
                  </p>
                  <p
                    className={`text-xs max-w-xs mx-auto ${
                      isDarkMode ? "text-mutedText" : "text-slate-500"
                    }`}
                  >
                    {searchQuery
                      ? `No apps matching "${searchQuery}" in ${activeFilter}.`
                      : `No apps currently assigned to ${activeFilter}.`}
                  </p>
                  <Button
                    size="sm"
                    onClick={handleStartAdd}
                    className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs h-8 px-3 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add App to{" "}
                    {activeFilter}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AppsSwitcherModal;
