"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  History,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Filter,
  Eye,
  Copy,
  Check,
  Globe,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  FolderCode,
  Briefcase,
  Mail,
  Sliders,
  Shield,
  Layers,
  Activity,
  ChevronLeft,
  ChevronRight,
  Database,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { LogsSkeleton } from "./components/LogsSkeleton";
import { ScrollableContainer } from "../components/ScrollableContainer";

export interface LogEntry {
  _id?: string;
  id?: string;
  action: string;
  category: "projects" | "experience" | "inquiries" | "settings" | "auth" | "system";
  description: string;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  actorEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  device?: {
    type: "desktop" | "mobile" | "tablet" | "unknown";
    os: string;
    browser: string;
    name?: string;
  };
  location?: {
    city?: string;
    country?: string;
    region?: string;
    ip?: string;
  };
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Filters & Pagination State
  const [category, setCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({
    all: 0,
    projects: 0,
    experience: 0,
    inquiries: 0,
    settings: 0,
    auth: 0,
    system: 0,
  });

  // Log Inspection Modal
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);

  // Fetch Logs from Backend
  const fetchLogs = useCallback(
    async (pageToFetch = page, cat = category, search = searchQuery, isManual = false) => {
      try {
        if (isManual) setRefreshing(true);
        const params = new URLSearchParams({
          page: String(pageToFetch),
          limit: "20",
        });
        if (cat && cat !== "all") params.append("category", cat);
        if (search.trim()) params.append("search", search.trim());

        const res = await fetch(`/api/ugaas/logs?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setLogs(data.logs || []);
          if (data.pagination) setPagination(data.pagination);
          if (data.categoryStats) setCategoryStats(data.categoryStats);
          if (isManual) toast.success("Activity logs updated");
        } else {
          toast.error(data.error || "Failed to fetch logs");
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, category, searchQuery]
  );

  useEffect(() => {
    fetchLogs(page, category, searchQuery);
  }, [page, category, searchQuery, fetchLogs]);

  // Auto-refresh interval if toggled on
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs(page, category, searchQuery);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, page, category, searchQuery, fetchLogs]);

  // Export logs to JSON
  const handleExportLogs = () => {
    try {
      const jsonString = JSON.stringify(logs, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Audit logs exported to JSON");
    } catch {
      toast.error("Failed to export logs");
    }
  };

  // Clear logs history
  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to permanently clear the audit logs history?")) {
      return;
    }

    try {
      setClearingLogs(true);
      const res = await fetch("/api/ugaas/logs?clearAll=true", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Audit logs cleared");
        fetchLogs(1, category, searchQuery);
      } else {
        toast.error(data.error || "Failed to clear logs");
      }
    } catch {
      toast.error("Failed to clear logs");
    } finally {
      setClearingLogs(false);
    }
  };

  // Device icon helper
  const getDeviceIcon = (type?: string) => {
    if (type === "mobile") return Smartphone;
    if (type === "tablet") return Tablet;
    return Laptop;
  };

  // Action badge styling helper
  const getActionBadge = (action: string) => {
    if (action.includes("CREATE")) {
      return (
        <Badge
          variant="default"
          className="bg-[#0B82EC]/15 text-[#0B82EC] border-[#0B82EC]/40 font-mono text-[10px] font-bold"
        >
          {action}
        </Badge>
      );
    }
    if (
      action.includes("UPDATE") ||
      action.includes("PATCH") ||
      action.includes("CHANGE")
    ) {
      return (
        <Badge
          variant="teal"
          className="bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/40 font-mono text-[10px] font-bold"
        >
          {action}
        </Badge>
      );
    }
    if (action.includes("DELETE") || action.includes("REVOKE")) {
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/15 text-red-400 border-red-500/40 font-mono text-[10px] font-bold"
        >
          {action}
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-indigo-500/15 text-indigo-400 border-indigo-500/40 font-mono text-[10px] font-bold"
      >
        {action}
      </Badge>
    );
  };

  // Overview stats cards data
  const statCards = useMemo(
    () => [
      {
        title: "Total Activity Logs",
        value: categoryStats.all,
        icon: Activity,
        accentBg: "bg-[#0B82EC]/15",
        accentText: "text-[#0B82EC]",
        borderColor: "border-[#0B82EC]/20",
        description: "All logged administrative operations",
      },
      {
        title: "Projects Activity",
        value: categoryStats.projects,
        icon: FolderCode,
        accentBg: "bg-[#3B82F6]/15",
        accentText: "text-[#3B82F6]",
        borderColor: "border-[#3B82F6]/20",
        description: "Creations, edits, and deletions",
      },
      {
        title: "Timeline & Inquiries",
        value: (categoryStats.experience || 0) + (categoryStats.inquiries || 0),
        icon: Briefcase,
        accentBg: "bg-[#2DD4BF]/15",
        accentText: "text-[#2DD4BF]",
        borderColor: "border-[#2DD4BF]/20",
        description: "Career, degrees, and lead briefs",
      },
      {
        title: "Auth & System Events",
        value: (categoryStats.auth || 0) + (categoryStats.system || 0) + (categoryStats.settings || 0),
        icon: Shield,
        accentBg: "bg-purple-500/15",
        accentText: "text-purple-400",
        borderColor: "border-purple-500/20",
        description: "Sessions, settings & database events",
      },
    ],
    [categoryStats]
  );

  if (loading && logs.length === 0) {
    return <LogsSkeleton />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primaryText flex items-center gap-2">
              <span>Audit & Activity Logs</span>
              <span className="text-[#0B82EC]">.</span>
            </h1>
            <Badge variant="teal" className="text-xs font-bold px-2.5 py-0.5">
              {pagination.total} Logged Events
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-mutedText">
            Real-time chronological timeline tracking all database modifications, hardware devices, and security events.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            title={autoRefresh ? "Auto-refresh active (10s)" : "Enable auto-refresh"}
            className={`h-9 px-3 text-xs border border-borderSubtle transition-colors ${
              autoRefresh
                ? "bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/40 font-bold"
                : "text-mutedText hover:text-primaryText hover:bg-surface"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                autoRefresh ? "bg-[#2DD4BF] animate-ping" : "bg-mutedText"
              }`}
            />
            {autoRefresh ? "Live Sync (10s)" : "Auto Sync"}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchLogs(page, category, searchQuery, true)}
            disabled={refreshing}
            title="Refresh Logs"
            className="text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle h-9 w-9"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-[#0B82EC]" : ""}`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportLogs}
            disabled={logs.length === 0}
            className="border-borderSubtle bg-surface text-primaryText hover:text-primaryText hover:bg-surface/80 gap-1.5 text-xs h-9 px-3"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleClearLogs}
            disabled={clearingLogs || logs.length === 0}
            className="bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white gap-1.5 text-xs font-bold h-9 px-3.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </Button>
        </div>
      </div>

      {/* 2. 4 Stat Counters Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`bg-surface ${stat.borderColor} transition-all duration-200 group relative overflow-hidden`}
            >
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-mutedText uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl ${stat.accentBg} border border-borderSubtle flex items-center justify-center ${stat.accentText} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-primaryText">
                  {stat.value}
                </div>

                <p className="text-[11px] text-mutedText truncate">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Search Bar & Category Filter Bar */}
      <Card className="bg-surface/90 border-borderSubtle p-4 sm:p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search logs by action, description, IP..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-surface border-borderSubtle text-primaryText text-xs h-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedText hover:text-primaryText text-xs"
              >
                ×
              </button>
            )}
          </div>
          {/* Category Tabs with Scroll Indicators (<< / >>) */}
          <div className="w-full md:w-auto min-w-0">
            <ScrollableContainer containerClassName="rounded-xl border border-borderSubtle bg-surface">
              <div className="flex items-center gap-1.5 p-1 min-w-max">
                {[
                  { id: "all", label: "All Events", icon: Layers },
                  { id: "projects", label: "Projects", icon: FolderCode },
                  { id: "experience", label: "Experience", icon: Briefcase },
                  { id: "inquiries", label: "Inquiries", icon: Mail },
                  { id: "settings", label: "Settings", icon: Sliders },
                  { id: "auth", label: "Auth & Sessions", icon: Shield },
                  { id: "system", label: "System", icon: Database },
                ].map((cat) => {
                  const isSelected = category === cat.id;
                  const count =
                    cat.id === "all"
                      ? categoryStats.all
                      : categoryStats[cat.id] || 0;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isSelected
                          ? "bg-[#0B82EC] text-white shadow-sm"
                          : "text-mutedText hover:text-primaryText hover:bg-surface/50"
                      }`}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-surface border border-borderSubtle text-mutedText"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </ScrollableContainer>
          </div>

        </div>
      </Card>

      {/* 4. Timeline Stream of Activity Logs */}
      <Card className="bg-surface/90 border-borderSubtle overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-16 text-center text-mutedText space-y-3">
            <History className="w-10 h-10 text-mutedText/40 mx-auto" />
            <h3 className="text-sm font-bold text-primaryText">No Activity Logs Found</h3>
            <p className="text-xs text-mutedText max-w-sm mx-auto">
              {searchQuery
                ? `No activity events match your query "${searchQuery}". Try changing search terms.`
                : "Activity logs will automatically populate here as actions occur in the admin console."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-borderSubtle/60">
            {logs.map((log) => {
              const DeviceIcon = getDeviceIcon(log.device?.type);
              const dateObj = new Date(log.createdAt);
              const fullDateStr = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={log._id || log.id}
                  className="p-4 sm:p-5 hover:bg-surface/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Left: Action Badge, Description, and Entity Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getActionBadge(log.action)}
                      <span className="text-[10px] font-mono font-semibold uppercase text-mutedText px-1.5 py-0.5 rounded bg-surface border border-borderSubtle">
                        {log.category}
                      </span>
                      {log.resourceName && (
                        <span className="text-[11px] font-semibold text-[#0B82EC] truncate max-w-xs">
                          {log.resourceName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-primaryText group-hover:text-[#0B82EC] transition-colors">
                      {log.description}
                    </p>

                    {/* Metadata items: Device, Geolocation, IP, Actor */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-mutedText">
                      <span className="flex items-center gap-1.5">
                        <DeviceIcon className="w-3.5 h-3.5 text-[#0B82EC] shrink-0" />
                        <span className="truncate">
                          {log.device?.browser || "Browser"} on {log.device?.os || "OS"}
                        </span>
                      </span>

                      <span>•</span>

                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                        <span>
                          {log.location?.city || "Localhost"}, {log.location?.country || "Development"}
                        </span>
                      </span>

                      <span>•</span>

                      <span className="font-mono text-[11px] text-mutedText/90">
                        IP: {log.ipAddress || "127.0.0.1"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Timestamp & Action Modal Button */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] text-mutedText font-mono block">
                        {fullDateStr}
                      </span>
                      <span className="text-[10px] text-mutedText/70 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedLog(log)}
                      className="h-8 px-3 text-xs text-mutedText hover:text-primaryText hover:bg-[#0B82EC]/15 border border-borderSubtle"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5 text-[#0B82EC]" />
                      <span>Inspect</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-borderSubtle bg-surface flex items-center justify-between">
            <span className="text-xs text-mutedText">
              Showing page <strong className="text-primaryText">{pagination.page}</strong> of{" "}
              <strong className="text-primaryText">{pagination.totalPages}</strong> (
              {pagination.total} total logs)
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-3 text-xs border-borderSubtle bg-surface text-primaryText"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="h-8 px-3 text-xs border-borderSubtle bg-surface text-primaryText"
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* 6. LOG DETAILS INSPECTOR MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-borderSubtle rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 animate-scale-up">
            {/* Modal Header */}
            <div className="p-5 border-b border-borderSubtle flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {getActionBadge(selectedLog.action)}
                <h3 className="font-bold text-sm text-primaryText">Audit Event Inspection</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-mutedText hover:text-primaryText text-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-mutedText uppercase">Description</span>
                <p className="text-sm font-bold text-primaryText">{selectedLog.description}</p>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface border border-borderSubtle space-y-0.5">
                  <span className="text-[10px] text-mutedText uppercase font-mono">Category</span>
                  <p className="font-bold text-primaryText capitalize">{selectedLog.category}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-borderSubtle space-y-0.5">
                  <span className="text-[10px] text-mutedText uppercase font-mono">Hardware</span>
                  <p className="font-bold text-primaryText truncate">{selectedLog.device?.os}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-borderSubtle space-y-0.5">
                  <span className="text-[10px] text-mutedText uppercase font-mono">Location</span>
                  <p className="font-bold text-primaryText truncate">{selectedLog.location?.city}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface border border-borderSubtle space-y-0.5">
                  <span className="text-[10px] text-mutedText uppercase font-mono">Client IP</span>
                  <p className="font-bold text-primaryText font-mono">{selectedLog.ipAddress}</p>
                </div>
              </div>

              {/* JSON Metadata Payload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-mutedText uppercase">
                    Event Payload / Changed Parameters
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(selectedLog.details || {}, null, 2)
                      );
                      setCopiedJson(true);
                      setTimeout(() => setCopiedJson(false), 2000);
                      toast.success("JSON Payload copied to clipboard");
                    }}
                    className="h-7 px-2.5 text-[11px] text-mutedText hover:text-primaryText"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-[#2DD4BF]" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" /> Copy JSON
                      </>
                    )}
                  </Button>
                </div>

                <pre className="p-4 rounded-xl bg-mainBg border border-borderSubtle text-[11px] font-mono text-primaryText overflow-x-auto max-h-60 custom-scrollbar leading-relaxed">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-borderSubtle bg-surface flex justify-end">
              <Button
                size="sm"
                onClick={() => setSelectedLog(null)}
                className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs font-bold px-4"
              >
                Close Inspection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
