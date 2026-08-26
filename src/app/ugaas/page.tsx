"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Briefcase,
  Layers,
  Mail,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Plus,
  Database,
  Clock,
  Eye,
  ExternalLink,
  ShieldCheck,
  Server,
  Activity,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InquiryDetailModal, InquiryItem } from "./components/InquiryDetailModal";
import { ReseedConfirmModal } from "./components/ReseedConfirmModal";
import { NewProjectModal } from "./components/NewProjectModal";
import { DashboardSkeleton } from "./components/DashboardSkeleton";

interface OverviewStats {
  totalProjects: number;
  inquiries: {
    total: number;
    unread: number;
    read: number;
    recent: InquiryItem[];
  };
  experienceMilestones: number;
  activeTechStack: number;
  dbStatus: {
    connected: boolean;
    database: string;
    host: string;
    readyState: number;
  };
}

export default function UgaasAdminDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isReseedOpen, setIsReseedOpen] = useState(false);

  const fetchStats = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setRefreshing(true);
    try {
      const res = await fetch("/api/ugaas/overview");
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard overview stats:", err);
    } finally {
      setLoading(false);
      if (showRefreshingState) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleInquiryStatusUpdated = (id: string, newStatus: "unread" | "read") => {
    setStats((prev) => {
      if (!prev) return prev;
      const updatedRecent = prev.inquiries.recent.map((inq) =>
        inq.id === id ? { ...inq, status: newStatus } : inq
      );
      const unreadCount = updatedRecent.filter((i) => i.status === "unread").length;
      return {
        ...prev,
        inquiries: {
          ...prev.inquiries,
          unread: unreadCount,
          read: prev.inquiries.total - unreadCount,
          recent: updatedRecent,
        },
      };
    });
  };

  if (loading && !stats) {
    return <DashboardSkeleton />;
  }

  const kpis = [
    {
      title: "Total Projects",
      value: stats ? stats.totalProjects : 12,
      subtitle: "Live in portfolio",
      trend: "Curated Case Studies",
      icon: FolderKanban,
      href: "/ugaas/projects",
      color: "#0B82EC",
      borderColor: "hover:border-[#0B82EC]/40",
      accentBg: "bg-[#0B82EC]/10",
      accentText: "text-[#0B82EC]",
    },
    {
      title: "Total Inquiries",
      value: stats ? stats.inquiries.total : 0,
      subtitle: `${stats ? stats.inquiries.unread : 0} unread messages`,
      trend: stats && stats.inquiries.unread > 0 ? "Requires Review" : "Up to date",
      icon: Mail,
      href: "/ugaas/inquiries",
      color: "#2DD4BF",
      borderColor: "hover:border-[#2DD4BF]/40",
      accentBg: "bg-[#2DD4BF]/10",
      accentText: "text-[#2DD4BF]",
      badge: stats && stats.inquiries.unread > 0 ? `${stats.inquiries.unread} New` : undefined,
    },
    {
      title: "Experience Milestones",
      value: stats ? stats.experienceMilestones : 14,
      subtitle: "Career & certifications",
      trend: "Verified History",
      icon: Briefcase,
      href: "/ugaas/experience",
      color: "#3B82F6",
      borderColor: "hover:border-[#3B82F6]/40",
      accentBg: "bg-[#3B82F6]/10",
      accentText: "text-[#3B82F6]",
    },
    {
      title: "Active Tech Stack",
      value: stats ? stats.activeTechStack : 48,
      subtitle: "Unique tools & icons",
      trend: "Full-Stack Ecosystem",
      icon: Layers,
      href: "/ugaas/projects",
      color: "#8B5CF6",
      borderColor: "hover:border-[#8B5CF6]/40",
      accentBg: "bg-[#8B5CF6]/10",
      accentText: "text-[#8B5CF6]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Live Telemetry Welcome Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-borderSubtle bg-gradient-to-r from-surface via-surface to-[#0B82EC]/10 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="teal" className="flex items-center gap-1.5 px-3 py-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Command Center Active
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Next.js 15 App Router
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primaryText tracking-tight">
              Developer Overview Console<span className="text-brandAccent">.</span>
            </h1>
            <p className="text-sm text-mutedText max-w-xl">
              Real-time portfolio management, inbound inquiries, project catalog metrics, and database health.
            </p>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              onClick={() => setIsNewProjectOpen(true)}
              className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-semibold shadow-lg shadow-[#0B82EC]/20 hover:shadow-[#0B82EC]/30 active:scale-[0.98] transition-all text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsReseedOpen(true)}
              className="border-borderSubtle bg-surface text-primaryText hover:text-primaryText hover:bg-surface/80 gap-2 text-xs sm:text-sm"
            >
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>Reseed Data</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              title="Refresh Dashboard Data"
              className="text-mutedText hover:text-primaryText hover:bg-surface/80"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#0B82EC]" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-80 h-80 bg-[#0B82EC]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Metric Cards Grid (4 KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className={`bg-surface ${kpi.borderColor} transition-all duration-200 group relative overflow-hidden`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-mutedText uppercase tracking-wider">
                  {kpi.title}
                </CardTitle>
                <div
                  className={`w-10 h-10 rounded-xl ${kpi.accentBg} border border-borderSubtle flex items-center justify-center ${kpi.accentText} group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-extrabold text-primaryText">
                    {loading ? (
                      <span className="inline-block w-12 h-8 bg-surface animate-pulse rounded" />
                    ) : (
                      kpi.value
                    )}
                  </div>
                  {kpi.badge && (
                    <Badge variant="teal" className="text-[10px] font-bold px-2 py-0.5 animate-pulse">
                      {kpi.badge}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-borderSubtle/60">
                  <span className="text-mutedText flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    {kpi.trend}
                  </span>
                  <Link
                    href={kpi.href}
                    className="text-[#0B82EC] hover:underline flex items-center font-medium group-hover:translate-x-0.5 transition-transform"
                  >
                    Manage <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Main Dashboard Body (Recent Inquiries Table + System Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Inbound Inquiries Table (2 cols) */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-borderSubtle">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base sm:text-lg font-bold text-primaryText flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#0B82EC]" />
                    Recent Inbound Inquiries
                  </CardTitle>
                  {stats && stats.inquiries.unread > 0 && (
                    <Badge variant="default" className="text-xs px-2 py-0.5 font-bold">
                      {stats.inquiries.unread} New
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs text-mutedText mt-0.5">
                  Latest client proposals and messages submitted via the public Contact section.
                </CardDescription>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-borderSubtle bg-surface text-primaryText hover:text-primaryText gap-1.5 text-xs self-start sm:self-auto"
              >
                <Link href="/ugaas/inquiries">
                  <span>View All Inquiries</span>
                  <ChevronRight className="w-3.5 h-3.5 text-mutedText" />
                </Link>
              </Button>
            </CardHeader>

            {/* Inquiries Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-borderSubtle bg-surface">
                    <TableHead className="font-semibold text-xs text-mutedText">Project / Lead</TableHead>
                    <TableHead className="font-semibold text-xs text-mutedText">Client</TableHead>
                    <TableHead className="font-semibold text-xs text-mutedText hidden sm:table-cell">Budget</TableHead>
                    <TableHead className="font-semibold text-xs text-mutedText hidden md:table-cell">Date</TableHead>
                    <TableHead className="font-semibold text-xs text-mutedText text-center">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-mutedText text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <TableRow key={idx} className="border-b border-borderSubtle/50">
                        <TableCell colSpan={6} className="py-4">
                          <div className="h-4 bg-surface rounded animate-pulse w-3/4 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : stats && stats.inquiries.recent.length > 0 ? (
                    stats.inquiries.recent.map((inq) => {
                      const isUnread = inq.status === "unread";
                      const dateStr = new Date(inq.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <TableRow
                          key={inq.id}
                          onClick={() => setSelectedInquiry(inq)}
                          className="border-b border-borderSubtle/50 hover:bg-surface/80 cursor-pointer transition-colors"
                        >
                          <TableCell className="font-medium text-primaryText py-3.5">
                            <div className="flex flex-col">
                              <span className="truncate max-w-[140px] sm:max-w-[180px] font-semibold text-xs sm:text-sm">
                                {inq.projectName}
                              </span>
                              <span className="text-[11px] text-mutedText truncate">
                                {inq.projectType}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="py-3.5">
                            <div className="flex flex-col">
                              <span className="text-xs text-primaryText truncate max-w-[120px]">
                                {inq.name}
                              </span>
                              <span className="text-[11px] text-mutedText truncate max-w-[120px]">
                                {inq.email}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden sm:table-cell text-xs text-mutedText py-3.5">
                            <span className="px-2 py-0.5 rounded bg-surface border border-borderSubtle text-primaryText font-medium">
                              {inq.budget || "Flexible"}
                            </span>
                          </TableCell>

                          <TableCell className="hidden md:table-cell text-xs text-mutedText py-3.5">
                            {dateStr}
                          </TableCell>

                          <TableCell className="text-center py-3.5">
                            <Badge
                              variant={isUnread ? "default" : "teal"}
                              className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                                isUnread
                                  ? "bg-[#0B82EC]/15 text-[#0B82EC] border-[#0B82EC]/30"
                                  : "bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/30"
                              }`}
                            >
                              {inq.status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right py-3.5">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInquiry(inq);
                              }}
                              className="h-8 px-2.5 text-xs text-mutedText hover:text-white hover:bg-[#0B82EC]/15"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-mutedText">
                        <Mail className="w-8 h-8 text-mutedText/40 mx-auto mb-2" />
                        <p className="text-sm font-medium text-white">No incoming inquiries yet</p>
                        <p className="text-xs text-mutedText mt-1">
                          Messages submitted via the contact form will appear here in real-time.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="p-4 bg-[#0E131D]/60 border-t border-borderSubtle flex items-center justify-between text-xs text-mutedText">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0B82EC]" />
              Auto-refreshes on incoming proposals
            </span>
            <Link href="/ugaas/inquiries" className="text-[#0B82EC] hover:underline font-medium">
              Go to Inbox →
            </Link>
          </div>
        </Card>

        {/* Right Column: Quick Action Bar & Database Cluster Health (1 col) */}
        <div className="space-y-6">
          {/* Quick Management Shortcuts */}
          <Card>
            <CardHeader className="pb-3 border-b border-borderSubtle">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#0B82EC]" />
                Quick Action Bar
              </CardTitle>
              <CardDescription className="text-xs text-mutedText">
                Instant shortcuts to perform admin operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              <Button
                onClick={() => setIsNewProjectOpen(true)}
                className="w-full justify-start bg-[#111622] hover:bg-surface border border-borderSubtle text-white text-xs sm:text-sm h-11 px-4 gap-3 shadow-none hover:border-[#0B82EC]/40"
              >
                <div className="w-6 h-6 rounded-md bg-[#0B82EC]/20 text-[#0B82EC] flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span>Create New Project Modal</span>
              </Button>

              <Button
                asChild
                className="w-full justify-start bg-[#111622] hover:bg-surface border border-borderSubtle text-white text-xs sm:text-sm h-11 px-4 gap-3 shadow-none hover:border-[#3B82F6]/40"
              >
                <Link href="/ugaas/experience">
                  <div className="w-6 h-6 rounded-md bg-[#3B82F6]/20 text-[#3B82F6] flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <span>Add Experience Milestone</span>
                </Link>
              </Button>

              <Button
                onClick={() => setIsReseedOpen(true)}
                className="w-full justify-start bg-[#111622] hover:bg-surface border border-borderSubtle text-amber-400 text-xs sm:text-sm h-11 px-4 gap-3 shadow-none hover:border-amber-500/40"
              >
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <span>Reseed Showcase Data</span>
              </Button>

              <Button
                asChild
                className="w-full justify-start bg-[#111622] hover:bg-surface border border-borderSubtle text-primaryText text-xs sm:text-sm h-11 px-4 gap-3 shadow-none hover:border-[#2DD4BF]/40"
              >
                <Link href="/" target="_blank">
                  <div className="w-6 h-6 rounded-md bg-[#2DD4BF]/20 text-[#2DD4BF] flex items-center justify-center shrink-0">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                  <span>Preview Public Portfolio</span>
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Database Cluster Health & Telemetry */}
          <Card>
            <CardHeader className="pb-3 border-b border-borderSubtle">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#2DD4BF]" />
                  MongoDB Cluster Health
                </CardTitle>
                <Badge variant="teal" className="text-[10px] font-bold">
                  Atlas ugaas
                </Badge>
              </div>
              <CardDescription className="text-xs text-mutedText">
                Live database connection telemetry & status.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="p-3 rounded-xl bg-[#111622] border border-borderSubtle space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-mutedText">Connection Status:</span>
                  <span className="font-semibold text-[#2DD4BF] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                    Online & Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-mutedText">Target Database:</span>
                  <span className="font-mono text-white font-medium">
                    {stats?.dbStatus.database || "myportfolio"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-mutedText">Cluster Host:</span>
                  <span className="font-mono text-mutedText text-[11px] truncate max-w-[140px]">
                    {stats?.dbStatus.host || "cluster.ugaas.mongodb.net"}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-mutedText">
                  <span>Auth Engine:</span>
                  <span className="text-white font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0B82EC]" /> Better Auth
                  </span>
                </div>

                <div className="flex items-center justify-between text-mutedText">
                  <span>API Latency:</span>
                  <span className="text-[#2DD4BF] font-mono font-medium">~12ms</span>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full border-borderSubtle bg-[#111622] hover:bg-surface text-primaryText hover:text-white text-xs gap-2 mt-2"
              >
                <a
                  href="https://cloud.mongodb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Server className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  <span>Open MongoDB Cloud Console</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-mutedText" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Modals */}
      <InquiryDetailModal
        inquiry={selectedInquiry}
        isOpen={Boolean(selectedInquiry)}
        onClose={() => setSelectedInquiry(null)}
        onStatusUpdated={handleInquiryStatusUpdated}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onSuccess={() => fetchStats(true)}
      />

      <ReseedConfirmModal
        isOpen={isReseedOpen}
        onClose={() => setIsReseedOpen(false)}
        onSuccess={() => fetchStats(true)}
      />
    </div>
  );
}
