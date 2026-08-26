"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@/ugaas/lib/auth-client";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AppsSwitcherModal } from "./AppsSwitcherModal";
import { TerminalConsoleModal } from "./TerminalConsoleModal";
import { Loader2, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  children: React.ReactNode;
}

// Helper to check if pressed key combo matches assigned shortcut string
function matchesShortcut(e: KeyboardEvent, combo: string): boolean {
  if (!combo) return false;
  const parts = combo.split("+").map((p) => p.trim().toLowerCase());

  const hasCtrl = parts.includes("ctrl");
  const hasCmd = parts.includes("cmd") || parts.includes("meta");
  const hasAlt = parts.includes("alt");
  const hasShift = parts.includes("shift");

  // Check modifier keys
  if (hasCtrl && !e.ctrlKey && !e.metaKey) return false;
  if (hasCmd && !e.metaKey && !e.ctrlKey) return false;
  if (hasAlt && !e.altKey) return false;
  if (!hasAlt && e.altKey) return false;
  if (hasShift && !e.shiftKey) return false;

  // Main primary key
  const mainKey = parts.find(
    (p) => !["ctrl", "cmd", "meta", "alt", "shift"].includes(p)
  );
  if (!mainKey) return false;

  const pressedKey = e.key.toLowerCase();
  if (mainKey === "space" && (e.code === "Space" || pressedKey === " ")) return true;
  if (mainKey === "/" && pressedKey === "/") return true;
  if (mainKey === "`" && pressedKey === "`") return true;

  return pressedKey === mainKey;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending, error } = useSession();

  // Collapsible Sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bottom action modals
  const [appsOpen, setAppsOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Apps assigned shortcut key
  const [appsShortcut, setAppsShortcut] = useState("Ctrl+K");

  // Load saved preferences
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem("ugaas_sidebar_collapsed");
      if (savedCollapsed !== null) {
        setIsCollapsed(savedCollapsed === "true");
      }

      const savedShortcut = localStorage.getItem("ugaas_apps_shortcut");
      if (savedShortcut) {
        setAppsShortcut(savedShortcut);
      }
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

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing inside an input/textarea (unless pressing Ctrl/Cmd modifier)
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // 1. Check Apps Launcher Shortcut
      if (matchesShortcut(e, appsShortcut)) {
        e.preventDefault();
        e.stopPropagation();
        setAppsOpen((prev) => !prev);
        return;
      }

      // 2. Fallback check for standard Cmd+K / Ctrl+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopPropagation();
        setAppsOpen((prev) => !prev);
        return;
      }

      // 3. Check Terminal Shortcut (Ctrl+` or Ctrl+~)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "`" || e.key === "~" || e.code === "Backquote")
      ) {
        e.preventDefault();
        e.stopPropagation();
        setTerminalOpen((prev) => !prev);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appsShortcut]);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ugaas_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Session check redirect - immediately route to terminal login if unauthenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/ugaas/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, router, pathname]);

  // Loading state or redirecting to terminal login
  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-mainBg flex flex-col items-center justify-center gap-4 text-primaryText">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0B82EC]/10 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC] animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-mutedText font-mono">
          Authenticating session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mainBg text-primaryText flex flex-row">
      {/* 1. Desktop Fixed Sidebar */}
      <div
        className={cn(
          "hidden lg:block fixed inset-y-0 left-0 z-40 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <AdminSidebar
          isCollapsed={isCollapsed}
          onOpenApps={() => setAppsOpen(true)}
          onOpenTerminal={() => setTerminalOpen(true)}
        />
      </div>

      {/* 2. Mobile Drawer Backdrop & Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] shadow-2xl flex flex-col"
            >
              <div className="relative h-full flex flex-col">
                <AdminSidebar
                  isCollapsed={false}
                  onCloseMobile={() => setMobileMenuOpen(false)}
                  onOpenApps={() => {
                    setMobileMenuOpen(false);
                    setAppsOpen(true);
                  }}
                  onOpenTerminal={() => {
                    setMobileMenuOpen(false);
                    setTerminalOpen(true);
                  }}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute right-3 top-4 p-2 rounded-lg text-mutedText hover:text-white bg-surface border border-borderSubtle transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <AdminHeader
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Page Content with Framer Motion Transition */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* 4. Global Action Modals */}
      <AppsSwitcherModal
        isOpen={appsOpen}
        onClose={() => setAppsOpen(false)}
      />

      <TerminalConsoleModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
    </div>
  );
}
