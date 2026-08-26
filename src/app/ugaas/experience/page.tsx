"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Calendar,
  Building2,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
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
import { toast } from "react-toastify";
import { ToolBadge } from "../projects/components/ToolIconHelper";
import { ExperienceDialog } from "./components/ExperienceDialog";
import {
  DeleteExperienceConfirmModal,
  ExperienceItem,
} from "./components/DeleteExperienceConfirmModal";
import { ExperienceSkeleton } from "./components/ExperienceSkeleton";
import { ScrollableContainer } from "../components/ScrollableContainer";

export default function ExperienceCMSPage() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState<"career" | "education" | "certification">("career");

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ExperienceItem | null>(null);

  const fetchExperienceData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch("/api/ugaas/experience");
      const data = await res.json();
      if (data.success) {
        setExperiences(data.experiences || []);
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error("Failed to fetch experience data:", err);
      toast.error("Failed to load experience records");
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchExperienceData();
  }, [fetchExperienceData]);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (item: ExperienceItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleRecordSaved = (savedItem: ExperienceItem, isNew: boolean) => {
    if (isNew) {
      setExperiences((prev) => [savedItem, ...prev]);
    } else {
      const targetId = savedItem.id || savedItem._id;
      setExperiences((prev) =>
        prev.map((item) =>
          (item.id || item._id) === targetId ? savedItem : item
        )
      );
    }
  };

  const handleRecordDeleted = (deletedId: string) => {
    setExperiences((prev) =>
      prev.filter((item) => (item.id || item._id) !== deletedId)
    );
  };

  // Filtered lists
  const careerItems = useMemo(
    () => experiences.filter((e) => e.type === "career" || !e.type),
    [experiences]
  );
  const educationItems = useMemo(
    () => experiences.filter((e) => e.type === "education"),
    [experiences]
  );
  const certificationItems = useMemo(
    () => [
      ...experiences.filter((e) => e.type === "certification"),
      ...certificates.map((c) => ({
        id: c.id || c._id,
        _id: c.id || c._id,
        role: c.title,
        company: c.issuer,
        duration: c.issueDate || "2024",
        badges: [c.category || "Verified"].filter(Boolean),
        highlights: [
          c.credentialId ? `Credential ID: ${c.credentialId}` : "",
          c.credentialUrl ? `Verification: ${c.credentialUrl}` : "",
        ].filter(Boolean),
        techStack: c.skills || [],
        image: c.image || "",
        credentialUrl: c.credentialUrl || "",
        credentialId: c.credentialId || "",
        type: "certification" as const,
        order: c.order || 0,
      })),
    ],
    [experiences, certificates]
  );

  const currentList =
    activeTab === "career"
      ? careerItems
      : activeTab === "education"
      ? educationItems
      : certificationItems;

  if (loading && experiences.length === 0 && certificates.length === 0) {
    return <ExperienceSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primaryText">
              Experience & Education Manager<span className="text-[#0B82EC]">.</span>
            </h1>
            <Badge variant="teal" className="text-xs font-bold px-2.5 py-0.5">
              {experiences.length + certificates.length} Records
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-mutedText">
            Maintain your professional work history, university degrees, and verified certifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchExperienceData(true)}
            disabled={refreshing}
            title="Refresh Records"
            className="text-mutedText hover:text-primaryText hover:bg-surface border border-borderSubtle"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#0B82EC]" : ""}`} />
          </Button>

          <Button
            onClick={handleOpenCreateModal}
            className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-bold shadow-lg shadow-[#0B82EC]/20 active:scale-[0.98] transition-all text-xs sm:text-sm h-10 px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Add Timeline Entry</span>
          </Button>
        </div>
      </div>

      {/* 2. Segmented Tabs Bar with Scroll Indicators (<< / >>) */}
      <ScrollableContainer containerClassName="rounded-2xl border border-borderSubtle bg-surface">
        <div className="p-1.5 flex items-center gap-2 w-full min-w-full">
          {[
            { id: "career", label: "Career Experience", icon: Briefcase, count: careerItems.length },
            { id: "education", label: "Education", icon: GraduationCap, count: educationItems.length },
            { id: "certification", label: "Certifications", icon: Award, count: certificationItems.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0B82EC] text-white shadow-md shadow-[#0B82EC]/20"
                    : "text-mutedText hover:text-primaryText hover:bg-surface/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-surface border border-borderSubtle text-mutedText"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollableContainer>

      {/* 3. Cards Grid */}
      <div className="space-y-4">
        {currentList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {currentList.map((item, index) => {
              const targetId = item.id || item._id;

              return (
                <Card
                  key={targetId || index}
                  className="bg-surface hover:border-[#0B82EC]/40 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Top Row: Title, Company, Duration, Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg sm:text-xl font-bold text-primaryText group-hover:text-[#0B82EC] transition-colors">
                            {item.role}
                          </h3>
                          {item.badges && item.badges.length > 0 && (
                            <Badge
                              variant="teal"
                              className="text-[11px] font-semibold bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30"
                            >
                              {item.badges[0]}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-mutedText">
                          <span className="flex items-center gap-1.5 text-primaryText font-medium">
                            <Building2 className="w-4 h-4 text-[#0B82EC]" />
                            {item.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-mutedText" />
                            {item.duration}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(item)}
                          className="h-8 px-2.5 text-xs text-mutedText hover:text-primaryText hover:bg-[#0B82EC]/15"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingItem(item)}
                          className="h-8 px-2.5 text-xs text-mutedText hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                        </Button>
                      </div>
                    </div>

                    {/* Highlights Bulleted List */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="pt-2 border-t border-borderSubtle/60 space-y-2">
                        <ul className="space-y-1.5 text-xs text-mutedText leading-relaxed">
                          {item.highlights.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0B82EC] mt-1.5 shrink-0" />
                              <span className="text-primaryText">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Certificate Attachment (Image or PDF) */}
                    {(item.image || item.credentialUrl) && (
                      <div className="pt-2 border-t border-borderSubtle/60 flex items-center justify-between gap-3 bg-surface p-2.5 rounded-xl border border-borderSubtle/40">
                        <div className="flex items-center gap-2 text-xs text-primaryText min-w-0">
                          <Award className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                          <span className="truncate text-[11px]">
                            {item.credentialId ? `Credential ID: ${item.credentialId}` : "Attached Certificate Document"}
                          </span>
                        </div>
                        {(item.credentialUrl || item.image) && (
                          <a
                            href={item.credentialUrl || item.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B82EC] hover:underline shrink-0"
                          >
                            <span>View Document</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    {item.techStack && item.techStack.length > 0 && (
                      <div className="pt-3 border-t border-borderSubtle/40 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-mutedText font-semibold mr-1 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#2DD4BF]" /> Stack:
                        </span>
                        {item.techStack.map((tech) => (
                          <ToolBadge
                            key={tech}
                            tool={tech}
                            className="px-2 py-0.5 text-[11px]"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-16 text-center text-mutedText border-dashed border-borderSubtle bg-[#111622]/40">
            <Briefcase className="w-10 h-10 text-mutedText/40 mx-auto mb-3" />
            <p className="text-base font-bold text-white">No records found</p>
            <p className="text-xs text-mutedText mt-1 max-w-sm mx-auto">
              You currently have no entries under {activeTab}. Click the button below to add your first milestone.
            </p>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-semibold text-xs mt-4"
            >
              <Plus className="w-4 h-4" /> Add Timeline Entry
            </Button>
          </Card>
        )}
      </div>

      {/* 4. Modals */}
      <ExperienceDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        item={editingItem}
        defaultType={activeTab}
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
