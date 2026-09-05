"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Award,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink,
  FileText,
  Eye,
  ShieldCheck,
  Copy,
  Check,
  GripVertical,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ExperienceDialog } from "../experience/components/ExperienceDialog";
import { DeleteExperienceConfirmModal, ExperienceItem } from "../experience/components/DeleteExperienceConfirmModal";

// Helper to extract chronological weight (larger number = more recent)
function getChronologicalWeight(durationStr: string = ""): number {
  if (!durationStr) return 0;
  const str = durationStr.toLowerCase();
  if (str.includes("present") || str.includes("now") || str.includes("current")) {
    return 999999;
  }
  const years = durationStr.match(/\b(19\d{2}|20\d{2})\b/g);
  if (!years || years.length === 0) return 0;
  const latestYear = Math.max(...years.map(Number));
  
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  let monthIndex = 0;
  months.forEach((m, idx) => {
    if (str.includes(m)) monthIndex = idx + 1;
  });

  return latestYear * 100 + monthIndex;
}

export default function CertificatesAdminPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ExperienceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCertificatesData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch("/api/ugaas/experience", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        const certs = [
          ...(data.experiences || []).filter((e: any) => e.type === "certification"),
          ...(data.certificates || []).map((c: any) => ({
            id: c.id || c._id,
            _id: c.id || c._id,
            role: c.title,
            company: c.issuer,
            duration: c.issueDate || "2024",
            badges: [c.category || "Verified"].filter(Boolean),
            image: c.image || "/Hero3DMe.png",
            credentialUrl: c.link || c.credentialUrl || "",
            credentialId: c.code || c.credentialId || "",
            type: "certification" as const,
            order: c.order || 0,
          })),
        ];

        // Deduplicate
        const uniqueMap = new Map();
        certs.forEach((c) => {
          const key = c.id || c._id || c.role || c.title;
          if (key && !uniqueMap.has(key)) {
            uniqueMap.set(key, c);
          }
        });
        
        const sorted = Array.from(uniqueMap.values()).sort(
          (a: any, b: any) => (a.order || 0) - (b.order || 0)
        );
        setCertificates(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch certificates:", err);
      toast.error("Failed to load certificates");
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificatesData();
  }, [fetchCertificatesData]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (cert: any) => {
    setEditingItem(cert);
    setIsEditorOpen(true);
  };

  const handleRecordSaved = () => {
    fetchCertificatesData();
  };

  const handleRecordDeleted = (deletedId: string) => {
    setCertificates((prev) =>
      prev.filter((item) => (item.id || item._id) !== deletedId)
    );
  };

  const handleCopyId = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.info("Credential ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Persist reordered certificates to backend
  const saveReorderedCertificates = async (items: any[]) => {
    setSavingOrder(true);
    try {
      const payload = items.map((item, idx) => ({
        id: item.id || item._id,
        order: idx + 1,
      }));

      const res = await fetch("/api/ugaas/experience/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Certificates display order updated!");
      } else {
        toast.error(data.error || "Failed to update order");
      }
    } catch {
      toast.error("Network error updating order");
    } finally {
      setSavingOrder(false);
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const updated = [...certificates];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    setCertificates(updated.map((item, i) => ({ ...item, order: i + 1 })));
    setDraggedIndex(null);
    await saveReorderedCertificates(updated);
  };

  // Auto-sort chronologically (latest to oldest)
  const handleSortChronological = async () => {
    const sorted = [...certificates].sort((a, b) => {
      const weightA = getChronologicalWeight(a.duration);
      const weightB = getChronologicalWeight(b.duration);
      return weightB - weightA; // Descending (latest first)
    });

    setCertificates(sorted.map((item, i) => ({ ...item, order: i + 1 })));
    toast.info("Sorted certificates chronologically. Saving order...");
    await saveReorderedCertificates(sorted);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primaryText flex items-center gap-2">
              <span>Certificates & Accreditations</span>
              <span className="text-[#0B82EC]">.</span>
            </h1>
            <Badge variant="teal" className="text-xs font-bold px-2.5 py-0.5">
              {certificates.length} Verified
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-mutedText">
            Upload certificates, attach PDF documents, and drag to arrange display order for the public portfolio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSortChronological}
            disabled={savingOrder || certificates.length <= 1}
            title="Sort latest certificates first"
            className="text-xs font-semibold gap-1.5 border-borderSubtle bg-surface hover:bg-surface/80 text-primaryText"
          >
            <Clock className="w-3.5 h-3.5 text-[#0B82EC]" />
            <span>Sort Timeline (Latest First)</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchCertificatesData(true)}
            disabled={refreshing}
            title="Refresh Certificates"
            className="text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#0B82EC]" : ""}`} />
          </Button>

          <Button
            onClick={handleOpenCreateModal}
            className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-bold shadow-lg shadow-[#0B82EC]/20 active:scale-[0.98] transition-all text-xs sm:text-sm h-10 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </Button>
        </div>
      </div>

      {/* 2. Certificates Grid with Consistent 16:10 Aspect Ratio & Drag and Drop */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 rounded-3xl bg-surface/50 border border-borderSubtle animate-pulse" />
          ))}
        </div>
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => {
            const certId = cert.id || cert._id;
            const isPdf = cert.image?.endsWith(".pdf") || cert.credentialUrl?.endsWith(".pdf");

            return (
              <Card
                key={certId || index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`bg-surface hover:border-purple-500/50 transition-all duration-300 group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between border-borderSubtle cursor-grab active:cursor-grabbing ${
                  draggedIndex === index ? "opacity-40 border-dashed border-purple-500" : ""
                }`}
              >
                {/* 16:10 Consistent Ratio Certificate Header */}
                <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-purple-950/30 via-mainBg to-surface border-b border-borderSubtle overflow-hidden flex items-center justify-center">
                  {cert.image && !isPdf ? (
                    <Image
                      src={cert.image}
                      alt={cert.role || cert.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-purple-400 p-4 text-center">
                      <FileText className="w-10 h-10 opacity-80" />
                      <span className="text-xs font-bold text-white">PDF Certificate Document</span>
                    </div>
                  )}

                  {/* Gradient Overlay & Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="p-1 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-white/70 hover:text-white cursor-grab"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-purple-300 flex items-center gap-1 shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-purple-400" />
                          <span>{cert.badges?.[0] || "Verified"}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cert)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all cursor-pointer shadow-sm"
                          title="Edit Certificate"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(cert)}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-red-500/80 text-white border border-white/20 transition-all cursor-pointer shadow-sm"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/90">
                      <span className="font-semibold text-purple-200">{cert.company}</span>
                      <span className="font-mono text-mutedText bg-black/50 px-2 py-0.5 rounded border border-white/10">
                        {cert.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Meta Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-primaryText group-hover:text-purple-400 transition-colors line-clamp-2">
                      {cert.role || cert.title}
                    </h3>

                    {cert.credentialId && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-mono text-mutedText truncate">
                          ID: {cert.credentialId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyId(cert.credentialId)}
                          className="text-[10px] text-mutedText hover:text-primaryText flex items-center gap-1"
                        >
                          {copiedId === cert.credentialId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-borderSubtle/60 flex items-center justify-between gap-2 text-xs">
                    {(cert.image || cert.credentialUrl) && (
                      <a
                        href={cert.image || cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-primaryText hover:text-purple-400 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>Preview</span>
                      </a>
                    )}

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 font-bold transition-all ml-auto"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Verify</span>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center text-mutedText border-dashed border-borderSubtle bg-surface/50">
          <Award className="w-12 h-12 text-mutedText/40 mx-auto mb-3" />
          <p className="text-base font-bold text-primaryText">No certificates added yet</p>
          <p className="text-xs text-mutedText mt-1 max-w-sm mx-auto">
            Upload your first verified credential or specialization to showcase on your portfolio experience timeline.
          </p>
          <Button
            onClick={handleOpenCreateModal}
            className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-semibold text-xs mt-4"
          >
            <Plus className="w-4 h-4" /> Add First Certificate
          </Button>
        </Card>
      )}

      {/* Modals */}
      <ExperienceDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        item={editingItem}
        defaultType="certification"
        onSuccess={handleRecordSaved}
      />

      <DeleteExperienceConfirmModal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        item={deletingItem}
        onSuccess={handleRecordDeleted}
      />
    </div>
  );
}

