"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Mail,
  Sliders,
  Sparkles,
  LayoutGrid,
  Terminal,
  LogOut,
  Loader2,
  Sun,
  Moon,
  History,
} from "lucide-react";
import { signOut } from "@/ugaas/lib/auth-client";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onOpenApps?: () => void;
  onOpenTerminal?: () => void;
}

const navItems = [
  {
    name: "Overview",
    href: "/ugaas",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Projects",
    href: "/ugaas/projects",
    icon: FolderKanban,
  },
  {
    name: "Experience & Education",
    href: "/ugaas/experience",
    icon: Briefcase,
  },
  {
    name: "Inquiries & Leads",
    href: "/ugaas/inquiries",
    icon: Mail,
  },
  {
    name: "Audit & Activity Logs",
    href: "/ugaas/logs",
    icon: History,
  },
  {
    name: "Settings",
    href: "/ugaas/settings",
    icon: Sliders,
  },
];

export function AdminSidebar({
  onCloseMobile,
  isCollapsed = false,
  onOpenApps,
  onOpenTerminal,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [appsShortcut, setAppsShortcut] = useState("Ctrl+K");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from localStorage / DOM attribute
  useEffect(() => {
    const checkTheme = () => {
      const savedTheme = localStorage.getItem("theme");
      const isCurrentDark =
        savedTheme === "light"
          ? false
          : document.documentElement.getAttribute("data-theme") !== "light";

      setIsDarkMode(isCurrentDark);
      if (!isCurrentDark) {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.setAttribute("data-theme", "mytheme");
        document.documentElement.classList.remove("light");
      }
    };

    checkTheme();

    const handleStorageChange = () => {
      checkTheme();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("theme_changed", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("theme_changed", handleStorageChange);
    };
  }, []);

  // Toggle Theme (matches Navbar.tsx exactly with View Transition support)
  const toggleTheme = () => {
    const nextTheme = !isDarkMode; // true = dark, false = light

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(
        "data-theme-transition",
        nextTheme ? "to-dark" : "to-light"
      );
    }

    const applyTheme = () => {
      setIsDarkMode(nextTheme);
      if (nextTheme) {
        document.documentElement.setAttribute("data-theme", "mytheme");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
      window.dispatchEvent(new Event("theme_changed"));
    };

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      const docWithTransition = document as Document & {
        startViewTransition: (callback: () => void) => { finished: Promise<void> };
      };
      const transition = docWithTransition.startViewTransition(() => {
        applyTheme();
      });
      transition.finished.finally(() => {
        document.documentElement.removeAttribute("data-theme-transition");
      });
    } else {
      applyTheme();
    }
  };

  // Load shortcut from localStorage and listen to updates
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ugaas_apps_shortcut");
      if (saved) setAppsShortcut(saved);
    } catch {
      // ignore
    }

    const handleShortcutUpdate = (e: any) => {
      if (e.detail?.shortcut) {
        setAppsShortcut(e.detail.shortcut);
      }
    };

    window.addEventListener("ugaas_shortcut_updated", handleShortcutUpdate);
    return () => window.removeEventListener("ugaas_shortcut_updated", handleShortcutUpdate);
  }, []);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.push("/ugaas/login");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign out");
            setLoggingOut(false);
          },
        },
      });
    } catch {
      toast.error("Failed to sign out");
      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        "bg-[#111622] border-r border-[#222938] flex flex-col h-full select-none transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* 1. Brand / Logo Header */}
      <div
        className={cn(
          "h-16 px-4 border-b border-[#222938] flex items-center shrink-0",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/ugaas"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B82EC] to-[#2DD4BF] p-[1.5px] shadow-lg shadow-[#0B82EC]/20 shrink-0">
            <div className="w-full h-full bg-[#111622] rounded-[10px] flex items-center justify-center">
              <span className="font-mono font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#0B82EC] to-[#2DD4BF]">
                UG
              </span>
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-primaryText group-hover:text-[#0B82EC] transition-colors truncate">
                  Eng_Aweis
                </span>
                <Sparkles className="w-3 h-3 text-[#2DD4BF] shrink-0" />
              </div>
              <span className="text-[10px] text-mutedText font-mono uppercase tracking-wider truncate">
                Admin Console
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {!isCollapsed && (
          <p className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-mutedText/70 pb-1">
            Core Modules
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "group flex items-center rounded-xl text-xs font-semibold transition-all duration-150",
                isCollapsed
                  ? "justify-center h-11 w-11 mx-auto"
                  : "gap-3 px-3.5 py-2.5",
                isActive
                  ? isCollapsed
                    ? "bg-[#0B82EC]/15 text-[#0B82EC] border border-[#0B82EC]/40"
                    : "border-l-4 border-[#0B82EC] bg-[#0B82EC]/10 text-primaryText shadow-inner font-bold"
                  : isCollapsed
                  ? "text-mutedText hover:text-primaryText hover:bg-surface/60"
                  : "border-l-4 border-transparent text-mutedText hover:text-primaryText hover:bg-surface/60"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors shrink-0",
                  isActive
                    ? "text-[#0B82EC]"
                    : "text-mutedText group-hover:text-primaryText"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* 3. Developer Bottom Reference Menu (APPS, TERMINAL, THEME, LOGOUT) */}
      <div className="p-3 border-t border-borderSubtle bg-surface/90 shrink-0 space-y-1">
        {/* APPS Button with Shortcut Badge */}
        <button
          type="button"
          onClick={() => onOpenApps?.()}
          title={`APPS (Quick Launcher) - ${appsShortcut}`}
          className={cn(
            "w-full flex items-center rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer group text-mutedText hover:text-primaryText hover:bg-surface/80",
            isCollapsed
              ? "justify-center h-10 w-10 mx-auto"
              : "gap-3 px-3 py-2 text-left"
          )}
        >
          <LayoutGrid className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
          {!isCollapsed && (
            <>
              <span className="uppercase text-[11px] font-mono tracking-widest text-primaryText">
                APPS
              </span>
              <kbd className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-surface text-mutedText group-hover:text-cyan-400 border border-borderSubtle font-mono transition-colors">
                {appsShortcut}
              </kbd>
            </>
          )}
        </button>

        {/* TERMINAL Button */}
        <button
          type="button"
          onClick={() => onOpenTerminal?.()}
          title="TERMINAL (Console CLI)"
          className={cn(
            "w-full flex items-center rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer group text-mutedText hover:text-primaryText hover:bg-surface/80",
            isCollapsed
              ? "justify-center h-10 w-10 mx-auto"
              : "gap-3 px-3 py-2 text-left"
          )}
        >
          <Terminal className="w-4 h-4 text-[#2DD4BF] group-hover:scale-110 transition-transform shrink-0" />
          {!isCollapsed && (
            <span className="uppercase text-[11px] font-mono tracking-widest text-primaryText">
              TERMINAL
            </span>
          )}
        </button>

        {/* THEME TOGGLE Button (Below Terminal) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={cn(
            "w-full flex items-center rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer group text-mutedText hover:text-primaryText hover:bg-surface/80",
            isCollapsed
              ? "justify-center h-10 w-10 mx-auto"
              : "gap-3 px-3 py-2 text-left"
          )}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform shrink-0" />
          )}
          {!isCollapsed && (
            <>
              <span className="uppercase text-[11px] font-mono tracking-widest text-primaryText">
                {isDarkMode ? "LIGHT MODE" : "DARK MODE"}
              </span>
              <span
                className={cn(
                  "ml-auto text-[9px] px-1.5 py-0.5 rounded font-mono uppercase border transition-colors",
                  isDarkMode
                    ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                    : "bg-indigo-400/10 text-indigo-400 border-indigo-400/30"
                )}
              >
                {isDarkMode ? "DARK" : "LIGHT"}
              </span>
            </>
          )}
        </button>

        {/* LOGOUT Button */}
        <button
          type="button"
          onClick={handleSignOut}
          disabled={loggingOut}
          title="LOGOUT"
          className={cn(
            "w-full flex items-center rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer group text-red-400/90 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50",
            isCollapsed
              ? "justify-center h-10 w-10 mx-auto"
              : "gap-3 px-3 py-2 text-left"
          )}
        >
          {loggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin text-red-400 shrink-0" />
          ) : (
            <LogOut className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          )}
          {!isCollapsed && (
            <span className="uppercase text-[11px] font-mono tracking-widest">
              LOGOUT
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
