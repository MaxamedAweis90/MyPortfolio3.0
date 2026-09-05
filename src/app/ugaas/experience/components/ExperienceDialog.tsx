"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Loader2,
  ListPlus,
  Layers,
  FileText,
  Link2,
} from "lucide-react";
import { toast } from "react-toastify";
import { ToolBadge, POPULAR_TOOLS, getToolIcon } from "../../projects/components/ToolIconHelper";
import { ExperienceItem } from "./DeleteExperienceConfirmModal";
import { ImageDropzone } from "@/app/ugaas/components/ImageDropzone";

interface ExperienceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item?: ExperienceItem | null;
  defaultType?: "career" | "education" | "certification";
  onSuccess: (savedItem: ExperienceItem, isNew: boolean) => void;
}

export function ExperienceDialog({
  isOpen,
  onClose,
  item,
  defaultType = "career",
  onSuccess,
}: ExperienceDialogProps) {
  const isEditMode = Boolean(item);

  const [loading, setLoading] = useState(false);

  // Form states
  const [type, setType] = useState<"career" | "education" | "certification">(defaultType);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [duration, setDuration] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [image, setImage] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [customTechInput, setCustomTechInput] = useState("");

  useEffect(() => {
    if (item) {
      setType(item.type || "career");
      setRole(item.role || "");
      setCompany(item.company || "");
      setDuration(item.duration || "");
      setBadgeText(item.badges?.[0] || "");
      setImage(item.image || "");
      setCredentialUrl(item.credentialUrl || "");
      setCredentialId(item.credentialId || "");
      setHighlights(item.highlights && item.highlights.length > 0 ? item.highlights : [""]);
      setTechStack(item.techStack || []);
    } else {
      setType(defaultType);
      setRole("");
      setCompany("");
      setDuration("");
      setBadgeText(
        defaultType === "career"
          ? "Full-Time"
          : defaultType === "education"
          ? "B.Sc. Degree"
          : "Verified Credential"
      );
      setImage("");
      setCredentialUrl("");
      setCredentialId("");
      setHighlights([""]);
      setTechStack(
        defaultType === "career"
          ? ["React", "Next.js", "TypeScript", "Node.js"]
          : defaultType === "education"
          ? ["Computer Science"]
          : ["Full-Stack", "Web Development"]
      );
    }
  }, [item, defaultType, isOpen]);

  const addHighlightBullet = () => {
    setHighlights([...highlights, ""]);
  };

  const updateHighlightBullet = (index: number, text: string) => {
    const updated = [...highlights];
    updated[index] = text;
    setHighlights(updated);
  };

  const removeHighlightBullet = (index: number) => {
    setHighlights(highlights.filter((_, idx) => idx !== index));
  };

  const addTech = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (techStack.includes(trimmed)) {
      toast.info(`"${trimmed}" is already added.`);
      return;
    }
    setTechStack([...techStack, trimmed]);
    setCustomTechInput("");
  };

  const removeTech = (nameToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== nameToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role.trim() || !company.trim() || !duration.trim()) {
      toast.warn("Please provide title, issuing org / company, and duration.");
      return;
    }

    setLoading(true);

    const cleanHighlights = highlights.map((h) => h.trim()).filter(Boolean);

    const payload = {
      type,
      role: role.trim(),
      company: company.trim(),
      duration: duration.trim(),
      badges: badgeText.trim() ? [badgeText.trim()] : [],
      image: image.trim(),
      credentialUrl: credentialUrl.trim(),
      credentialId: credentialId.trim(),
      highlights: cleanHighlights,
      techStack,
    };

    try {
      const endpoint = isEditMode
        ? `/api/ugaas/experience/${item!.id || item!._id}`
        : "/api/ugaas/experience";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.experience) {
        toast.success(
          isEditMode
            ? `Record "${role}" updated successfully!`
            : `Record "${role}" created successfully!`
        );
        onSuccess(data.experience, !isEditMode);
        onClose();
      } else {
        toast.error(data.error || "Failed to save record");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="border-b border-borderSubtle pb-4 space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC]">
              {type === "education" ? (
                <GraduationCap className="w-5 h-5" />
              ) : type === "certification" ? (
                <Award className="w-5 h-5" />
              ) : (
                <Briefcase className="w-5 h-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {isEditMode ? "Edit Timeline Entry" : "Add New Timeline Entry"}
              </DialogTitle>
              <DialogDescription className="text-xs text-mutedText flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Manage career timeline, degrees, and verified certificates.
              </DialogDescription>
            </div>
          </div>

          {/* Type Segmented Selector */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-borderSubtle/60 mt-3">
            {[
              { id: "career", label: "Career & Work", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "certification", label: "Certifications", icon: Award },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setType(t.id as any)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#0B82EC] text-white shadow-sm"
                      : "bg-[#111622] text-mutedText hover:text-white border border-borderSubtle"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role / Degree / Certificate Title */}
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-semibold text-mutedText">
                {type === "education"
                  ? "Degree / Major *"
                  : type === "certification"
                  ? "Certificate Title *"
                  : "Role / Position Title *"}
              </Label>
              <Input
                id="role"
                required
                placeholder={
                  type === "education"
                    ? "B.Sc. in Computer Science"
                    : type === "certification"
                    ? "Full-Stack Web Development"
                    : "Senior Full Stack Engineer"
                }
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#111622] border-[#222938] text-white text-xs"
              />
            </div>

            {/* Company / Issuing Org */}
            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-xs font-semibold text-mutedText">
                {type === "education"
                  ? "University / Institution *"
                  : type === "certification"
                  ? "Issuing Body / Org *"
                  : "Company / Organization *"}
              </Label>
              <Input
                id="company"
                required
                placeholder={
                  type === "education"
                    ? "SIMAD University"
                    : type === "certification"
                    ? "Meta / Coursera"
                    : "Almaas University Tech Lab"
                }
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-[#111622] border-[#222938] text-white text-xs"
              />
            </div>

            {/* Duration / Period */}
            <div className="space-y-1.5">
              <Label htmlFor="duration" className="text-xs font-semibold text-mutedText">
                {type === "certification" ? "Issue Date / Year *" : "Duration / Period *"}
              </Label>
              <Input
                id="duration"
                required
                placeholder={type === "certification" ? "e.g. 2025" : "e.g. Aug 2025 - Present"}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="bg-[#111622] border-[#222938] text-white text-xs"
              />
            </div>

            {/* Category / Badge Text */}
            <div className="space-y-1.5">
              <Label htmlFor="badge" className="text-xs font-semibold text-mutedText">
                Category Tag / Badge
              </Label>
              <Input
                id="badge"
                placeholder="e.g. Verified Credential, Full-Time"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="bg-[#111622] border-[#222938] text-white text-xs"
              />
            </div>
          </div>

          {/* CERTIFICATION SPECIFIC: IMAGE OR PDF ATTACHMENT */}
          {type === "certification" && (
            <div className="space-y-4 p-4 rounded-2xl bg-[#111622] border border-[#0B82EC]/30 shadow-inner">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#2DD4BF]" />
                  Certificate Image or PDF Document
                </Label>
                <span className="text-[10px] text-mutedText">16:10 Aspect Ratio • Max 15MB</span>
              </div>

              {/* Drag & Drop Upload Zone */}
              <ImageDropzone
                folder="certificates"
                aspectRatio="16:10"
                label="Upload Certificate (Image or PDF)"
                description="Drag & drop or browse device file. JPG, PNG, WebP, or PDF."
                placeholderUrl={image}
                onUploadComplete={(uploaded) => {
                  const url = Array.isArray(uploaded) ? uploaded[0] : uploaded;
                  setImage(url);
                  toast.success("Certificate document attached!");
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Verification URL */}
                <div className="space-y-1">
                  <Label htmlFor="cert-url" className="text-[11px] font-medium text-mutedText flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                    Credential / Verification Link (URL)
                  </Label>
                  <Input
                    id="cert-url"
                    placeholder="https://coursera.org/verify/..."
                    value={credentialUrl}
                    onChange={(e) => setCredentialUrl(e.target.value)}
                    className="bg-[#0E131D] border-[#222938] text-white text-xs"
                  />
                </div>

                {/* Credential ID */}
                <div className="space-y-1">
                  <Label htmlFor="cert-id" className="text-[11px] font-medium text-mutedText flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
                    Credential / License ID
                  </Label>
                  <Input
                    id="cert-id"
                    placeholder="e.g. CERT-98234-XYZ"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="bg-[#0E131D] border-[#222938] text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bulleted Highlights Section */}
          <div className="space-y-2 pt-2 border-t border-borderSubtle">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                <ListPlus className="w-3.5 h-3.5 text-[#0B82EC]" /> Key Responsibilities & Highlights
              </Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={addHighlightBullet}
                className="text-xs text-[#0B82EC] hover:text-[#3B82F6] hover:bg-[#0B82EC]/10 h-7 px-2"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Bullet Point
              </Button>
            </div>

            <div className="space-y-2">
              {highlights.map((bullet, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0B82EC]/15 text-[#0B82EC] flex items-center justify-center text-[10px] font-bold shrink-0 mt-2">
                    {index + 1}
                  </span>
                  <Input
                    placeholder={`Highlight point #${index + 1}...`}
                    value={bullet}
                    onChange={(e) => updateHighlightBullet(index, e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white text-xs flex-1"
                  />
                  {highlights.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeHighlightBullet(index)}
                      className="text-mutedText hover:text-red-400 hover:bg-red-500/10 h-9 w-9 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="space-y-2 pt-2 border-t border-borderSubtle">
            <Label className="text-xs font-semibold text-mutedText flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#2DD4BF]" /> Technologies & Skills
              </span>
              <span className="text-[11px] text-mutedText">Click × to remove</span>
            </Label>

            <div className="p-3 rounded-xl bg-[#111622] border border-borderSubtle min-h-[44px] flex flex-wrap gap-1.5 items-center">
              {techStack.length > 0 ? (
                techStack.map((tech) => (
                  <ToolBadge
                    key={tech}
                    tool={tech}
                    onRemove={() => removeTech(tech)}
                  />
                ))
              ) : (
                <span className="text-xs text-mutedText">
                  No skills selected. Add from popular presets below or type custom skill.
                </span>
              )}
            </div>

            {/* Custom Tech Stack input */}
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Next.js, Prisma, REST APIs"
                value={customTechInput}
                onChange={(e) => setCustomTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTech(customTechInput);
                  }
                }}
                className="bg-[#111622] border-[#222938] text-white text-xs"
              />
              <Button
                type="button"
                onClick={() => addTech(customTechInput)}
                className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs shrink-0"
              >
                Add
              </Button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 custom-scrollbar">
              {POPULAR_TOOLS.slice(0, 16).map((tool) => {
                const isSelected = techStack.includes(tool.name);
                const Icon = getToolIcon(tool.name);
                return (
                  <button
                    type="button"
                    key={tool.name}
                    onClick={() =>
                      isSelected ? removeTech(tool.name) : addTech(tool.name)
                    }
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white"
                        : "bg-[#111622] border-[#222938] text-mutedText hover:text-white"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 border-t border-borderSubtle pt-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-borderSubtle text-primaryText hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Record...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditMode ? "Save Changes" : "Create Record"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
