"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Mail,
  Search,
  RefreshCw,
  Clock,
  User,
  Phone,
  DollarSign,
  Calendar,
  CheckCircle,
  Archive,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Inbox,
  Filter,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { InquiryItem } from "@/ugaas/components/InquiryDetailModal";
import { InquiriesSkeleton } from "./components/InquiriesSkeleton";

export default function InquiriesInboxPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Selection
  const [selectedStatus, setSelectedStatus] = useState<"all" | "unread" | "read" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInquiries = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch("/api/ugaas/inquiries");
      const data = await res.json();
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries);
        // Default select first item if none selected on desktop
        if (data.inquiries.length > 0 && !selectedId) {
          setSelectedId(data.inquiries[0].id || data.inquiries[0]._id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const statusMatch =
        selectedStatus === "all" || item.status === selectedStatus;

      const q = searchQuery.toLowerCase().trim();
      const queryMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.projectName.toLowerCase().includes(q) ||
        item.projectType.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q);

      return statusMatch && queryMatch;
    });
  }, [inquiries, selectedStatus, searchQuery]);

  // Auto-select first matching item when filter changes
  useEffect(() => {
    if (filteredInquiries.length > 0) {
      const currentSelectedExists = filteredInquiries.some(
        (i) => (i.id || (i as any)._id) === selectedId
      );
      if (!currentSelectedExists) {
        setSelectedId(filteredInquiries[0].id || (filteredInquiries[0] as any)._id);
      }
    } else {
      setSelectedId(null);
    }
  }, [filteredInquiries, selectedId]);

  const activeInquiry = useMemo(() => {
    return (
      inquiries.find((i) => (i.id || (i as any)._id) === selectedId) || null
    );
  }, [inquiries, selectedId]);

  // Update Status handler
  const handleUpdateStatus = async (
    targetId: string,
    newStatus: "unread" | "read" | "archived"
  ) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/ugaas/inquiries/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Inquiry status updated to "${newStatus}"`);
        setInquiries((prev) =>
          prev.map((i) =>
            (i.id || (i as any)._id) === targetId
              ? { ...i, status: newStatus }
              : i
          )
        );
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update inquiry");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (targetId: string) => {
    if (!confirm("Are you sure you want to permanently delete this inquiry?")) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/ugaas/inquiries/${targetId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Inquiry deleted.");
        setInquiries((prev) =>
          prev.filter((i) => (i.id || (i as any)._id) !== targetId)
        );
        setMobileShowDetail(false);
      } else {
        toast.error(data.error || "Failed to delete inquiry");
      }
    } catch {
      toast.error("Failed to delete inquiry");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (activeInquiry?.message) {
      navigator.clipboard.writeText(activeInquiry.message);
      setCopied(true);
      toast.success("Proposal message copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const unreadCount = inquiries.filter((i) => i.status === "unread").length;
  const readCount = inquiries.filter((i) => i.status === "read").length;
  const archivedCount = inquiries.filter((i) => i.status === "archived").length;

  if (loading && inquiries.length === 0) {
    return <InquiriesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primaryText">
              Inquiries & Leads Inbox<span className="text-[#2DD4BF]">.</span>
            </h1>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs font-bold px-2.5 py-0.5">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-mutedText">
            Review incoming project proposals, client briefs, and direct inquiries.
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => fetchInquiries(true)}
          disabled={refreshing}
          title="Refresh Inbox"
          className="text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle self-start sm:self-auto h-9 w-9"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#0B82EC]" : ""}`} />
        </Button>
      </div>

      {/* 2. Split-View Master-Detail Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Master List (5 cols on lg, hidden on mobile if mobileShowDetail is true) */}
        <Card
          className={`lg:col-span-5 overflow-hidden flex flex-col h-[720px] ${
            mobileShowDetail ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Top Filter & Search Bar */}
          <div className="p-3.5 sm:p-4 border-b border-borderSubtle bg-surface space-y-2.5 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search leads, clients, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-surface border-borderSubtle text-primaryText text-xs h-9"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mutedText hover:text-primaryText text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-surface border border-borderSubtle">
              {[
                { id: "all", label: "All", count: inquiries.length },
                { id: "unread", label: "Unread", count: unreadCount },
                { id: "read", label: "Read", count: readCount },
                { id: "archived", label: "Archived", count: archivedCount },
              ].map((tab) => {
                const isSelected = selectedStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedStatus(tab.id as any)}
                    className={`py-1.5 px-1 rounded-md text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-[#0B82EC] text-white shadow-sm"
                        : "text-mutedText hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#161C2C] text-mutedText"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Submissions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-borderSubtle/50 custom-scrollbar">
            {filteredInquiries.length > 0 ? (
              filteredInquiries.map((inq) => {
                const targetId = inq.id || (inq as any)._id;
                const isSelected = selectedId === targetId;
                const isUnread = inq.status === "unread";
                const isArchived = inq.status === "archived";

                const dateStr = new Date(inq.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={targetId}
                    onClick={() => {
                      setSelectedId(targetId);
                      setMobileShowDetail(true);
                      if (isUnread) {
                        handleUpdateStatus(targetId, "read");
                      }
                    }}
                    className={`p-3.5 sm:p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#0B82EC]/10 border-l-4 border-[#0B82EC] pl-3"
                        : "hover:bg-surface/60 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs sm:text-sm truncate ${isSelected ? "text-primaryText font-extrabold" : "text-primaryText"}`}>
                            {inq.projectName}
                          </span>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#0B82EC] shrink-0 animate-pulse" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-mutedText truncate">
                          <span className="font-semibold text-primaryText truncate">
                            {inq.name}
                          </span>
                          <span>•</span>
                          <span className="truncate">{inq.projectType}</span>
                        </div>

                        <p className="text-[11px] text-mutedText/80 line-clamp-1">
                          {inq.message || "No message body."}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[10px] text-mutedText font-mono">
                          {dateStr}
                        </span>

                        <Badge
                          variant={isUnread ? "default" : isArchived ? "secondary" : "teal"}
                          className={`text-[9px] font-bold px-1.5 py-0.2 uppercase tracking-wider ${
                            isUnread
                              ? "bg-[#0B82EC]/20 text-[#0B82EC] border-[#0B82EC]/40"
                              : isArchived
                              ? "bg-gray-800 text-gray-400 border-gray-700"
                              : "bg-[#2DD4BF]/15 text-[#2DD4BF] border-[#2DD4BF]/30"
                          }`}
                        >
                          {inq.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center text-mutedText space-y-2">
                <Inbox className="w-8 h-8 text-mutedText/40 mx-auto" />
                <p className="text-xs font-semibold text-primaryText">No inquiries found</p>
                <p className="text-[11px] text-mutedText">
                  {searchQuery
                    ? `No submissions matched "${searchQuery}".`
                    : "Inbox is clean and up to date."}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Right Side: Detail View Pane (7 cols on lg, full width on mobile when open) */}
        <Card
          className={`lg:col-span-7 h-[720px] flex flex-col justify-between overflow-hidden ${
            !mobileShowDetail ? "hidden lg:flex" : "flex"
          }`}
        >
          {activeInquiry ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Detail Header */}
              <div className="p-4 sm:p-6 border-b border-borderSubtle bg-surface space-y-3 shrink-0">
                {/* Mobile Back Button */}
                <div className="lg:hidden">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setMobileShowDetail(false)}
                    className="h-8 px-2 text-xs text-mutedText hover:text-primaryText mb-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Inquiries List
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC] shrink-0">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-xl font-bold text-primaryText leading-tight truncate">
                        {activeInquiry.projectName}
                      </h2>
                      <p className="text-[11px] sm:text-xs text-mutedText flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#0B82EC] shrink-0" />
                        Received{" "}
                        {new Date(activeInquiry.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={activeInquiry.status === "unread" ? "default" : "teal"}
                    className="capitalize px-3 py-1 text-xs self-start sm:self-auto font-bold shrink-0"
                  >
                    {activeInquiry.status}
                  </Badge>
                </div>

                {/* Client Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 sm:p-4 rounded-xl bg-surface border border-borderSubtle text-xs">
                  <div className="flex items-center gap-2 text-mutedText truncate">
                    <User className="w-4 h-4 text-[#0B82EC] shrink-0" />
                    <span>Client:</span>
                    <strong className="text-primaryText truncate">{activeInquiry.name}</strong>
                  </div>

                  <div className="flex items-center gap-2 text-mutedText truncate">
                    <Mail className="w-4 h-4 text-[#0B82EC] shrink-0" />
                    <span>Email:</span>
                    <a
                      href={`mailto:${activeInquiry.email}`}
                      className="text-[#0B82EC] hover:underline truncate"
                    >
                      {activeInquiry.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-mutedText truncate">
                    <Phone className="w-4 h-4 text-[#0B82EC] shrink-0" />
                    <span>Phone:</span>
                    <span className="text-primaryText truncate">
                      {activeInquiry.phone || "Not provided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-mutedText truncate">
                    <DollarSign className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                    <span>Budget:</span>
                    <span className="text-primaryText font-medium truncate">
                      {activeInquiry.budget || "Flexible"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-mutedText sm:col-span-2 truncate">
                    <Calendar className="w-4 h-4 text-[#3B82F6] shrink-0" />
                    <span>Type & Deadline:</span>
                    <span className="text-primaryText truncate">
                      {activeInquiry.projectType} • {activeInquiry.deadline || "Flexible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Message Content Area */}
              <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-mutedText">
                    Full Proposal / Message
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyMessage}
                    className="h-7 px-2.5 text-xs text-mutedText hover:text-primaryText"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-[#2DD4BF]" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Text
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-surface border border-borderSubtle text-xs sm:text-sm text-primaryText leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message || "No message content provided."}
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="p-3.5 sm:p-4 border-t border-borderSubtle bg-[#111622]/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actionLoading}
                    onClick={() => {
                      const next =
                        activeInquiry.status === "unread" ? "read" : "unread";
                      handleUpdateStatus(
                        activeInquiry.id || (activeInquiry as any)._id,
                        next
                      );
                    }}
                    className="border-borderSubtle bg-surface text-primaryText hover:text-white text-xs h-9 flex-1 sm:flex-initial"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-[#2DD4BF]" />
                    {activeInquiry.status === "unread"
                      ? "Mark Read"
                      : "Mark Unread"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actionLoading}
                    onClick={() => {
                      const next =
                        activeInquiry.status === "archived" ? "read" : "archived";
                      handleUpdateStatus(
                        activeInquiry.id || (activeInquiry as any)._id,
                        next
                      );
                    }}
                    className="border-borderSubtle bg-surface text-primaryText hover:text-white text-xs h-9 flex-1 sm:flex-initial"
                  >
                    <Archive className="w-3.5 h-3.5 mr-1.5 text-mutedText" />
                    {activeInquiry.status === "archived"
                      ? "Unarchive"
                      : "Archive"}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={actionLoading}
                    onClick={() =>
                      handleDelete(activeInquiry.id || (activeInquiry as any)._id)
                    }
                    className="text-mutedText hover:text-red-400 hover:bg-red-500/10 h-9 px-2.5"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Mailto Pre-filled Reply Button */}
                <Button
                  asChild
                  className="w-full sm:w-auto bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-semibold text-xs h-9 shadow-md shadow-[#0B82EC]/20"
                >
                  <a
                    href={`mailto:${activeInquiry.email}?subject=Re: Project Inquiry - ${encodeURIComponent(
                      activeInquiry.projectName
                    )}&body=Hello ${encodeURIComponent(
                      activeInquiry.name
                    )},\n\nThank you for reaching out regarding your project "${encodeURIComponent(
                      activeInquiry.projectName
                    )}".`}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="truncate">Reply to {activeInquiry.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-mutedText space-y-3">
              <Mail className="w-12 h-12 text-mutedText/30" />
              <h3 className="text-base font-bold text-white">No Lead Selected</h3>
              <p className="text-xs text-mutedText max-w-xs">
                Select a message from the left inbox list to view the proposal details, client information, and quick reply actions.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
