"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ExternalLink,
  ChevronRight,
  Database,
  Globe,
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Mail,
  History,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  onToggleMobileMenu: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const routeDetails: Record<
  string,
  { title: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "/ugaas": { title: "Dashboard Overview", icon: LayoutDashboard },
  "/ugaas/projects": { title: "Projects Management", icon: FolderKanban },
  "/ugaas/experience": { title: "Experience & Education", icon: Briefcase },
  "/ugaas/inquiries": { title: "Inquiries & Leads Inbox", icon: Mail },
  "/ugaas/logs": { title: "Audit & Activity Logs", icon: History },
  "/ugaas/settings": { title: "Settings & Preferences", icon: Sliders },
};

export function AdminHeader({
  onToggleMobileMenu,
  isCollapsed = false,
  onToggleCollapse,
}: AdminHeaderProps) {
  const pathname = usePathname();

  const currentRoute = routeDetails[pathname] || {
    title:
      pathname
        .split("/")
        .filter(Boolean)
        .slice(1)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" / ") || "Dashboard",
    icon: LayoutDashboard,
  };

  const IconComponent = currentRoute.icon;

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-borderSubtle bg-surface/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Toggle / Desktop Collapse & Route Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle transition-colors cursor-pointer shrink-0"
          aria-label="Toggle mobile navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-lg text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle transition-colors cursor-pointer shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4 text-[#0B82EC]" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
          <Link
            href="/ugaas"
            className="text-mutedText hover:text-primaryText transition-colors font-medium shrink-0"
          >
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-mutedText/50 shrink-0" />
          <div className="flex items-center gap-1.5 font-bold text-primaryText truncate">
            <IconComponent className="w-3.5 h-3.5 text-[#0B82EC] shrink-0" />
            <span className="truncate">{currentRoute.title}</span>
          </div>
        </nav>
      </div>

      {/* Right: Quick status badges & Live Site Link */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Status Badge */}
        <div className="hidden md:flex items-center">
          <Badge
            variant="teal"
            className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2DD4BF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2DD4BF]"></span>
            </span>
            <Database className="w-3 h-3" />
            <span>MongoDB: Connected</span>
          </Badge>
        </div>

        {/* View Live Site Button */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-borderSubtle bg-surface hover:bg-surface/80 hover:text-white text-primaryText gap-2 shadow-sm text-xs h-9 px-3"
        >
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Globe className="w-3.5 h-3.5 text-[#0B82EC]" />
            <span className="hidden sm:inline">View Live Portfolio</span>
            <span className="sm:hidden">Live Site</span>
            <ExternalLink className="w-3 h-3 text-mutedText ml-0.5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
