"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Home,
  Briefcase,
  User,
  Clock,
  BookOpen,
  Image as ImageIcon,
  Send,
  Cpu,
  Layers,
  Terminal,
  CornerDownLeft,
  X,
  Compass,
} from "lucide-react";

interface RouteItem {
  id: string;
  title: string;
  path: string;
  description: string;
  keywords: string[];
  icon: React.ComponentType<{ className?: string }>;
  isSecret?: boolean;
}

// Available Public Routes & Entrypoints (Only /ugaas is suggested for administrative access)
const AVAILABLE_ROUTES: RouteItem[] = [
  {
    id: "home",
    title: "Home",
    path: "/",
    description: "Main portfolio landing page & overview",
    keywords: ["home", "main", "landing", "hero", "intro", "root"],
    icon: Home,
  },
  {
    id: "work",
    title: "Projects & Work",
    path: "/work",
    description: "Production web, mobile applications & case studies",
    keywords: ["projects", "work", "portfolio", "apps", "code", "showcase"],
    icon: Briefcase,
  },
  {
    id: "about",
    title: "About Mohamed",
    path: "/about",
    description: "Biography, background, developer story & ethos",
    keywords: ["about", "bio", "developer", "profile", "story", "me"],
    icon: User,
  },
  {
    id: "experience",
    title: "Experience & Timeline",
    path: "/experience",
    description: "Professional career history, employment & roles",
    keywords: ["experience", "career", "history", "jobs", "timeline", "resume"],
    icon: Clock,
  },
  {
    id: "blog",
    title: "Blog & Engineering Notes",
    path: "/blog",
    description: "Technical articles, guides & architectural insights",
    keywords: ["blog", "articles", "posts", "writing", "news", "insights"],
    icon: BookOpen,
  },
  {
    id: "gallery",
    title: "Gallery & Certificates",
    path: "/Gallery",
    description: "Visual achievements, certificates & milestones",
    keywords: ["gallery", "photos", "certificates", "media", "awards"],
    icon: ImageIcon,
  },
  {
    id: "skills",
    title: "Skills & Tech Stack",
    path: "/#skills",
    description: "Core languages, frontend, backend & cloud tools",
    keywords: ["skills", "tech", "stack", "tools", "languages", "technologies"],
    icon: Cpu,
  },
  {
    id: "services",
    title: "Services & Capabilities",
    path: "/#services",
    description: "Full-stack development, mobile apps & UI/UX engineering",
    keywords: [
      "services",
      "offerings",
      "solutions",
      "freelance",
      "capabilities",
    ],
    icon: Layers,
  },
  {
    id: "contact",
    title: "Contact & Inquiries",
    path: "/#contact",
    description: "Send direct project messages, inquiries & connect",
    keywords: ["contact", "message", "email", "inquiries", "hire", "touch"],
    icon: Send,
  },
  {
    id: "ugaas",
    title: "Ugaas Management Terminal",
    path: "/ugaas",
    description: "Administrative console gateway & CMS management portal",
    keywords: [
      "ugaas",
      "admin",
      "cms",
      "management",
      "terminal",
      "login",
      "portal",
      "system",
    ],
    icon: Terminal,
    isSecret: true,
  },
];

export default function RouteCommandPalette() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sync theme with document & localStorage
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window === "undefined") return;
      const domTheme = document.documentElement.getAttribute("data-theme");
      const savedTheme = localStorage.getItem("theme");
      const isLight = domTheme === "light" || savedTheme === "light";
      setIsDarkMode(!isLight);
    };

    checkTheme();
    window.addEventListener("theme_changed", checkTheme);
    window.addEventListener("storage", checkTheme);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.removeEventListener("theme_changed", checkTheme);
      window.removeEventListener("storage", checkTheme);
      observer.disconnect();
    };
  }, []);

  // Global Keyboard Shortcuts (Ctrl+P, Right Ctrl+P, Cmd+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrMeta = e.ctrlKey || e.metaKey || e.code === "ControlRight";
      if (isCtrlOrMeta && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setQuery("");
            setSelectedIndex(0);
          }
          return !prev;
        });
        return;
      }

      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter & rank routes based on query (prefix matches & exact matches prioritized)
  const isTyping = query.trim().length > 0;

  const filteredRoutes = useMemo(() => {
    const trimmed = query.trim().toLowerCase().replace(/^\/+/, "");
    if (!trimmed) {
      return [];
    }

    const scored = AVAILABLE_ROUTES.map((item) => {
      const cleanPath = item.path
        .toLowerCase()
        .replace(/^\/+/, "")
        .replace(/^#/, "");
      const cleanTitle = item.title.toLowerCase();
      const id = item.id.toLowerCase();
      const titleWords = cleanTitle.split(/[\s&/_\-#]+/);
      const descWords = item.description.toLowerCase().split(/[\s&/_\-#]+/);

      let score = 0;

      // 1. Exact match on path, title, or id
      if (cleanPath === trimmed || cleanTitle === trimmed || id === trimmed) {
        score = 1000;
      }
      // 2. Path starts with query (e.g. typing "ab" -> "/about")
      else if (cleanPath.startsWith(trimmed)) {
        score = 600 + Math.max(0, 50 - cleanPath.length);
      }
      // 3. ID starts with query
      else if (id.startsWith(trimmed)) {
        score = 550 + Math.max(0, 50 - id.length);
      }
      // 4. Title starts with query (e.g. "About Mohamed")
      else if (cleanTitle.startsWith(trimmed)) {
        score = 500 + Math.max(0, 50 - cleanTitle.length);
      }
      // 5. Any word in the title starts with query (e.g. "Work" in "Projects & Work")
      else if (titleWords.some((w) => w.startsWith(trimmed))) {
        score = 400;
      }
      // 6. Any keyword starts with query (e.g. "apps" -> "Projects & Work")
      else if (item.keywords.some((k) => k.toLowerCase().startsWith(trimmed))) {
        score = 300;
      }
      // 7. Path contains query
      else if (cleanPath.includes(trimmed)) {
        score = 150;
      }
      // 8. Title contains query
      else if (cleanTitle.includes(trimmed)) {
        score = 100;
      }
      // 9. Any keyword contains query
      else if (item.keywords.some((k) => k.toLowerCase().includes(trimmed))) {
        score = 60;
      }
      // 10. Description words start with query
      else if (descWords.some((w) => w.startsWith(trimmed))) {
        score = 30;
      }
      // 11. Description contains query
      else if (item.description.toLowerCase().includes(trimmed)) {
        score = 10;
      }

      return { item, score };
    });

    return scored
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [query]);

  // Ensure selectedIndex is always within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredRoutes]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selectedElement = listRef.current.children[
      selectedIndex
    ] as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Navigate to route
  const handleNavigate = (targetPath: string) => {
    setIsOpen(false);
    setQuery("");

    if (targetPath.startsWith("/#")) {
      // In-page hash jump on home page
      if (pathname === "/") {
        const hash = targetPath.replace("/#", "#");
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }

    router.push(targetPath);
  };

  // Keyboard navigation within the palette
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredRoutes.length === 0) return;
      setSelectedIndex((prev) => (prev + 1) % filteredRoutes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredRoutes.length === 0) return;
      setSelectedIndex((prev) =>
        prev === 0 ? filteredRoutes.length - 1 : prev - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredRoutes.length > 0 && filteredRoutes[selectedIndex]) {
        handleNavigate(filteredRoutes[selectedIndex].path);
      } else if (query.trim()) {
        // Direct route navigation for custom input (e.g. /ugaas or custom URL)
        const customPath = query.trim().startsWith("/")
          ? query.trim()
          : `/${query.trim()}`;
        handleNavigate(customPath);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 font-sans">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* VS Code Quick Open Centered Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`w-full max-w-xl relative z-10 rounded-2xl overflow-hidden shadow-2xl border transition-all duration-200 ${
              isDarkMode
                ? "bg-[#0D1117]/95 border-[#30363D] text-slate-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]"
                : "bg-white/95 border-slate-200 text-slate-900 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)]"
            }`}
          >
            {/* Header Search Input */}
            <div
              className={`p-3.5 sm:p-4 flex items-center gap-3 transition-colors ${
                isTyping ? "border-b" : ""
              } ${
                isDarkMode
                  ? "border-[#30363D] bg-[#161B22]/90"
                  : "border-slate-200 bg-slate-50/90"
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 flex items-center justify-center transition-colors ${
                  isDarkMode
                    ? "bg-[#21262D] text-[#58A6FF]"
                    : "bg-blue-50 text-[#0969DA] border border-blue-100"
                }`}
              >
                <Search className="w-4 h-4" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type a route name (e.g. work, about, blog) ..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className={`flex-1 !bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm sm:text-base font-medium shadow-none ${
                  isDarkMode
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className={`p-1.5 rounded-md transition-colors ${
                    isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                  }`}
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 shrink-0">
                <kbd
                  className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${
                    isDarkMode
                      ? "bg-[#21262D] border-[#30363D] text-slate-300"
                      : "bg-white border-slate-200 text-slate-600 shadow-xs"
                  }`}
                >
                  ESC
                </kbd>
              </div>
            </div>

            {/* When user has typed: Show suggestions list */}
            {isTyping && (
              <>
                {/* List Header Bar */}
                <div
                  className={`px-4 py-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider select-none border-b ${
                    isDarkMode
                      ? "bg-[#0D1117] border-[#21262D] text-slate-400"
                      : "bg-slate-50 border-slate-200 text-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Compass
                      className={`w-3.5 h-3.5 ${
                        isDarkMode ? "text-[#2DD4BF]" : "text-teal-600"
                      }`}
                    />
                    <span className="font-semibold">Matching Routes</span>
                  </div>
                  <span className="font-semibold">
                    {filteredRoutes.length}{" "}
                    {filteredRoutes.length === 1 ? "match" : "matches"}
                  </span>
                </div>

                {/* Route Suggestions List */}
                <div
                  ref={listRef}
                  className="max-h-[340px] overflow-y-auto p-2 space-y-1 custom-scrollbar"
                >
                  {filteredRoutes.map((route, index) => {
                    const isSelected = index === selectedIndex;
                    const IconComponent = route.icon;

                    return (
                      <button
                        key={route.id}
                        type="button"
                        onClick={() => handleNavigate(route.path)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 transition-all duration-150 relative cursor-pointer ${
                          isSelected
                            ? isDarkMode
                              ? "bg-[#21262D] text-white shadow-sm"
                              : "bg-slate-100 text-slate-900 shadow-xs border border-slate-200/80"
                            : isDarkMode
                              ? "text-slate-300 hover:bg-[#161B22]"
                              : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {/* Active Left Pill Indicator */}
                        {isSelected && (
                          <motion.div
                            layoutId="activeIndicator"
                            className={`absolute left-1.5 top-2.5 bottom-2.5 w-1 rounded-full ${
                              isDarkMode ? "bg-[#2DD4BF]" : "bg-teal-600"
                            }`}
                          />
                        )}

                        <div className="flex items-center gap-3 min-w-0 pl-2">
                          <div
                            className={`p-2 rounded-lg shrink-0 transition-colors ${
                              route.isSecret
                                ? isDarkMode
                                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                                  : "bg-teal-50 text-teal-700 border border-teal-200"
                                : isSelected
                                  ? isDarkMode
                                    ? "bg-[#30363D] text-[#58A6FF]"
                                    : "bg-blue-50 text-[#0969DA] border border-blue-100"
                                  : isDarkMode
                                    ? "bg-[#161B22] text-slate-400"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs sm:text-sm truncate">
                                {route.title}
                              </span>
                              {route.isSecret && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                  GATEWAY
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[11px] truncate mt-0.5 ${
                                isDarkMode ? "text-slate-400" : "text-slate-500"
                              }`}
                            >
                              {route.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`font-mono text-xs font-semibold px-2 py-0.5 rounded border transition-colors ${
                              isSelected
                                ? isDarkMode
                                  ? "bg-[#0D1117] border-[#30363D] text-[#2DD4BF]"
                                  : "bg-white border-teal-200 text-teal-700 shadow-xs"
                                : isDarkMode
                                  ? "bg-[#161B22] border-[#21262D] text-slate-400"
                                  : "bg-slate-100 border-slate-200 text-slate-500"
                            }`}
                          >
                            {route.path}
                          </span>

                          {isSelected && (
                            <ArrowRight
                              className={`w-4 h-4 shrink-0 ${
                                isDarkMode ? "text-[#2DD4BF]" : "text-teal-600"
                              }`}
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Direct Jump Option when no preset matches */}
                  {filteredRoutes.length === 0 && (
                    <div className="p-1 space-y-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleNavigate(
                            query.trim().startsWith("/")
                              ? query.trim()
                              : `/${query.trim()}`,
                          )
                        }
                        className={`w-full text-left p-3.5 rounded-xl flex items-center justify-between gap-3 border transition-colors cursor-pointer ${
                          isDarkMode
                            ? "bg-[#161B22] border-cyan-500/30 text-white hover:bg-[#21262D]"
                            : "bg-slate-50 border-teal-200 text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            <CornerDownLeft className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold">
                              Navigate directly to &quot;
                              {query.trim().startsWith("/")
                                ? query.trim()
                                : `/${query.trim()}`}
                              &quot;
                            </span>
                            <p className="text-[11px] text-slate-400">
                              Press Enter to navigate
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-mono text-xs font-bold ${
                            isDarkMode ? "text-[#2DD4BF]" : "text-teal-700"
                          }`}
                        >
                          ↵ ENTER
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer Helper Bar */}
            {/* <div
              className={`p-2.5 px-4 flex items-center justify-between text-[11px] font-mono select-none transition-colors ${
                isTyping ? "border-t" : "border-t"
              } ${
                isDarkMode
                  ? "bg-[#161B22]/80 border-[#30363D] text-slate-400"
                  : "bg-slate-50/90 border-slate-200 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                {isTyping ? (
                  <>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 rounded border border-slate-600/40">
                        ↑
                      </kbd>
                      <kbd className="px-1 rounded border border-slate-600/40">
                        ↓
                      </kbd>
                      <span>navigate</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 rounded border border-slate-600/40">
                        ↵
                      </kbd>
                      <span>select</span>
                    </span>
                  </>
                ) : (
                  <span>Start typing to search routes or jump directly...</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Shortcut:</span>
                <kbd
                  className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${
                    isDarkMode
                      ? "bg-[#21262D] border-[#30363D] text-[#58A6FF]"
                      : "bg-slate-200 border-slate-300 text-[#0969DA]"
                  }`}
                >
                  Ctrl + P
                </kbd>
              </div>
            </div> */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
