"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Sparkles,
  Link as LinkIcon,
  Github,
  Globe,
  Smartphone,
  Check,
  Loader2,
  Image as ImageIcon,
  Plus,
  Star,
  Download,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Monitor,
  Laptop,
  ExternalLink,
  Lock,
  Eye,
  X,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { toast } from "react-toastify";
import { ToolBadge, POPULAR_TOOLS, getToolIcon } from "./ToolIconHelper";
import { ProjectItem } from "./DeleteProjectConfirmModal";
import { ImageDropzone } from "@/app/ugaas/components/ImageDropzone";

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectItem | null;
  onSuccess: (savedProject: ProjectItem, isNew: boolean) => void;
  availableCategories?: string[];
  onCategoriesChanged?: () => void;
}

export function ProjectDialog({
  isOpen,
  onClose,
  project,
  onSuccess,
  availableCategories,
  onCategoriesChanged,
}: ProjectDialogProps) {
  const isEditMode = Boolean(project);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "tech" | "links" | "media">("general");

  // Dynamic Categories
  const [categoriesList, setCategoriesList] = useState<string[]>(
    availableCategories && availableCategories.length > 0
      ? availableCategories
      : ["Web", "Mobile", "Design"]
  );
  const [showAddCatInline, setShowAddCatInline] = useState(false);
  const [inlineCatName, setInlineCatName] = useState("");
  const [isSavingInlineCat, setIsSavingInlineCat] = useState(false);

  // Sync available categories
  useEffect(() => {
    if (availableCategories && availableCategories.length > 0) {
      setCategoriesList(availableCategories);
    } else {
      fetch(`/api/ugaas/projects/categories?t=${Date.now()}`, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.categories) {
            setCategoriesList(data.categories.map((c: any) => c.name));
          }
        })
        .catch(() => {});
    }
  }, [availableCategories, isOpen]);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState<string>("Web");
  const [desc, setDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [playStoreUrl, setPlayStoreUrl] = useState("");
  const [appStoreUrl, setAppStoreUrl] = useState("");
  const [appIconUrl, setAppIconUrl] = useState("/Hero3DMe.png");
  const [apkUrl, setApkUrl] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [newScreenshotInput, setNewScreenshotInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageInput, setNewImageInput] = useState("");
  const [image, setImage] = useState("/Hero3DMe.png");
  const [tools, setTools] = useState<string[]>(["Next.js", "TypeScript", "TailwindCSS"]);
  const [customToolInput, setCustomToolInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Derived category mode
  const isMobile = category.trim().toLowerCase().includes("mobile");

  // Initialize or reset form when project changes or dialog opens
  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setSlug(project.slug || "");
      setIsSlugManuallyEdited(true);
      setCategory((project.category as any) || "Web");
      setDesc(project.desc || "");
      setFullDesc(project.fullDesc || project.desc || "");
      setLiveUrl(project.liveUrl || "");
      setGithubUrl(project.githubUrl || "");
      setClientUrl(project.clientUrl || "");
      setServerUrl(project.serverUrl || "");
      setPlayStoreUrl(project.playStoreUrl || "");
      setAppStoreUrl(project.appStoreUrl || "");
      setAppIconUrl(project.appIconUrl || project.image || "/Hero3DMe.png");
      setApkUrl(project.apkUrl || "");
      setScreenshots(
        Array.isArray(project.screenshots) && project.screenshots.length > 0
          ? project.screenshots
          : (project.image ? [project.image] : ["/Hero3DMe.png"])
      );
      setImages(
        Array.isArray(project.images) && project.images.length > 0
          ? project.images
          : (project.image ? [project.image] : ["/Hero3DMe.png"])
      );
      setImage(project.image || "/Hero3DMe.png");
      setTools(project.tools || []);
      setIsFeatured(Boolean(project.isFeatured));
    } else {
      setTitle("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setCategory("Web");
      setDesc("");
      setFullDesc("");
      setLiveUrl("");
      setGithubUrl("");
      setClientUrl("");
      setServerUrl("");
      setPlayStoreUrl("");
      setAppStoreUrl("");
      setAppIconUrl("/Hero3DMe.png");
      setApkUrl("");
      setScreenshots(["/Hero3DMe.png"]);
      setImages(["/Hero3DMe.png"]);
      setImage("/Hero3DMe.png");
      setTools(["Next.js", "TypeScript", "TailwindCSS"]);
      setIsFeatured(false);
    }
    setNewScreenshotInput("");
    setNewImageInput("");
    setActiveTab("general");
  }, [project, isOpen]);

  // Title change with auto-slug generation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugManuallyEdited) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(
      e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  const addTool = (toolName: string) => {
    const trimmed = toolName.trim();
    if (!trimmed) return;
    if (tools.includes(trimmed)) {
      toast.info(`"${trimmed}" is already added.`);
      return;
    }
    setTools([...tools, trimmed]);
    setCustomToolInput("");
  };

  const handleAddScreenshot = (urlToAdd: string) => {
    const trimmed = urlToAdd.trim();
    if (!trimmed) return;
    if (screenshots.includes(trimmed)) {
      toast.info("This screenshot is already in the list.");
      return;
    }
    setScreenshots((prev) => [...prev, trimmed]);
    setNewScreenshotInput("");
  };

  const handleRemoveScreenshot = (indexToRemove: number) => {
    setScreenshots((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMoveScreenshot = (index: number, direction: "left" | "right") => {
    const newIdx = direction === "left" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= screenshots.length) return;
    const updated = [...screenshots];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setScreenshots(updated);
  };

  const handleAddImage = (urlToAdd: string) => {
    const trimmed = urlToAdd.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      toast.info("This image is already in the gallery.");
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setNewImageInput("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    const newIdx = direction === "left" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setImages(updated);
  };

  const handleAddInlineCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inlineCatName.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === "all") {
      toast.error("'All' is a reserved system keyword.");
      return;
    }

    if (categoriesList.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      const match = categoriesList.find((c) => c.toLowerCase() === trimmed.toLowerCase()) || trimmed;
      setCategory(match);
      setShowAddCatInline(false);
      setInlineCatName("");
      return;
    }

    setIsSavingInlineCat(true);
    try {
      const res = await fetch("/api/ugaas/projects/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();

      if (data.success) {
        setCategoriesList((prev) => [...prev, trimmed]);
        setCategory(trimmed);
        setShowAddCatInline(false);
        setInlineCatName("");
        toast.success(`Category "${trimmed}" created!`);
        onCategoriesChanged?.();
      } else {
        toast.error(data.error || "Failed to create category");
      }
    } catch {
      toast.error("Network error while adding category.");
    } finally {
      setIsSavingInlineCat(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !desc.trim()) {
      toast.warn("Title and short description are required.");
      setActiveTab("general");
      return;
    }

    setLoading(true);

    const validScreenshots = screenshots.filter(Boolean);
    const validImages = images.filter(Boolean);

    // Smart primary image fallback
    let resolvedImage = image.trim();
    if (!resolvedImage || resolvedImage === "/Hero3DMe.png") {
      if (isMobile) {
        resolvedImage = validScreenshots[0] || appIconUrl || "/Hero3DMe.png";
      } else {
        resolvedImage = validImages[0] || "/Hero3DMe.png";
      }
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      desc: desc.trim(),
      fullDesc: fullDesc.trim() || desc.trim(),
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      clientUrl: clientUrl.trim(),
      serverUrl: serverUrl.trim(),
      playStoreUrl: playStoreUrl.trim(),
      appStoreUrl: appStoreUrl.trim(),
      appIconUrl: appIconUrl.trim() || resolvedImage,
      apkUrl: apkUrl.trim(),
      screenshots: validScreenshots.length > 0 ? validScreenshots : [resolvedImage],
      images: validImages.length > 0 ? validImages : [resolvedImage],
      image: resolvedImage,
      tools,
      isFeatured,
    };

    try {
      const endpoint = isEditMode
        ? `/api/ugaas/projects/${project!.id || project!._id || project!.slug}`
        : "/api/ugaas/projects";

      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.project) {
        toast.success(
          isEditMode
            ? `Project "${title}" updated successfully!`
            : `Project "${title}" created successfully!`
        );
        onSuccess(data.project, !isEditMode);
        onClose();
      } else {
        toast.error(data.error || "Failed to save project");
      }
    } catch {
      toast.error("An unexpected error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <DialogHeader className="border-b border-borderSubtle pb-4 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC]">
                {isMobile ? <Smartphone className="w-5 h-5 text-emerald-400" /> : <FolderKanban className="w-5 h-5" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{isEditMode ? "Edit Project" : "Create New Project"}</span>
                  {isFeatured && (
                    <Badge variant="teal" className="text-[10px] font-bold">
                      <Star className="w-3 h-3 mr-1 fill-[#2DD4BF]" /> Featured
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-mutedText flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                  {isEditMode
                    ? `Update "${project?.title}" metadata, assets, and distribution.`
                    : "Configure project details, media assets, and platform links."}
                </DialogDescription>
              </div>
            </div>

            {/* Platform Mode Indicator */}
            <div className="flex items-center gap-1.5">
              {isMobile ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile App Mode</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0B82EC]/15 border border-[#0B82EC]/30 text-[#0B82EC] shadow-sm">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Web Project Mode</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 pt-3 border-t border-borderSubtle/60 mt-3 overflow-x-auto custom-scrollbar pb-1">
            {[
              { id: "general", label: "General & Info" },
              { id: "tech", label: "Tech Stack" },
              {
                id: "links",
                label: isMobile ? "Mobile Stores & Links 📱" : "URLs & Deployments 🌐",
              },
              {
                id: "media",
                label: isMobile ? "App Icon & Screens 📱" : "Widescreen Gallery & Cover 💻",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#0B82EC] text-white shadow-sm"
                    : "bg-[#111622] text-mutedText hover:text-white border border-borderSubtle"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="title" className="text-xs font-semibold text-mutedText">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    required
                    placeholder="e.g. AI SaaS Workflow Engine"
                    value={title}
                    onChange={handleTitleChange}
                    className="bg-[#111622] border-[#222938] text-white text-sm"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slug" className="text-xs font-semibold text-mutedText">
                      URL Slug *
                    </Label>
                    <span className="text-[11px] text-mutedText font-mono">
                      /work/<span className="text-[#0B82EC]">{slug || "project-slug"}</span>
                    </span>
                  </div>
                  <Input
                    id="slug"
                    required
                    placeholder="ai-saas-workflow-engine"
                    value={slug}
                    onChange={handleSlugChange}
                    className="bg-[#111622] border-[#222938] text-white text-xs font-mono"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-mutedText">Category *</Label>
                    {!showAddCatInline && (
                      <button
                        type="button"
                        onClick={() => setShowAddCatInline(true)}
                        className="text-[11px] text-[#0B82EC] hover:text-[#3B82F6] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Category</span>
                      </button>
                    )}
                  </div>

                  {/* Inline Add Category Input */}
                  {showAddCatInline && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#161C2C] border border-[#0B82EC]/30 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Input
                        placeholder="e.g. AI & ML, Cloud, Desktop..."
                        value={inlineCatName}
                        onChange={(e) => setInlineCatName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddInlineCategory();
                          } else if (e.key === "Escape") {
                            setShowAddCatInline(false);
                            setInlineCatName("");
                          }
                        }}
                        autoFocus
                        className="h-8 text-xs bg-[#111622] border-[#222938] text-white flex-1"
                        disabled={isSavingInlineCat}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAddInlineCategory()}
                        disabled={isSavingInlineCat || !inlineCatName.trim()}
                        className="h-8 px-3 bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs font-bold gap-1 rounded-lg shrink-0"
                      >
                        {isSavingInlineCat ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Save</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowAddCatInline(false);
                          setInlineCatName("");
                        }}
                        className="h-8 px-2 text-mutedText hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}

                  {/* Category Chips Selection */}
                  <div className="flex flex-wrap gap-2">
                    {categoriesList.map((cat) => {
                      const isSelected = category.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white shadow-inner font-bold"
                              : "bg-[#111622] border-[#222938] text-mutedText hover:text-white hover:border-[#333E54]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-[#0B82EC]" : "bg-transparent"
                            }`}
                          />
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Featured Switch */}
                <div className="sm:col-span-2 flex items-center justify-between p-3 rounded-xl bg-[#111622] border border-borderSubtle">
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#2DD4BF]" />
                      Featured Project
                    </div>
                    <p className="text-xs text-mutedText">
                      Highlight this project in hero carousels and top recommendations.
                    </p>
                  </div>
                  <Switch
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                    aria-label="Toggle featured state"
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="desc" className="text-xs font-semibold text-mutedText">
                    Short Summary (Tagline) *
                  </Label>
                  <Textarea
                    id="desc"
                    required
                    rows={2}
                    placeholder="Concise overview of what this application solves and key deliverables..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white min-h-[60px] text-xs leading-relaxed"
                  />
                </div>

                {/* Full Description / Markdown */}
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="fullDesc" className="text-xs font-semibold text-mutedText">
                    Extended Description / Case Study (Markdown)
                  </Label>
                  <Textarea
                    id="fullDesc"
                    rows={4}
                    placeholder="Comprehensive deep dive into architecture, challenges faced, technical highlights..."
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white min-h-[100px] text-xs font-mono leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECH STACK */}
          {activeTab === "tech" && (
            <div className="space-y-5">
              {/* Selected Tech Chips */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-mutedText flex items-center justify-between">
                  <span>Selected Tech Stack ({tools.length})</span>
                  <span className="text-[11px] text-mutedText">Click × to remove</span>
                </Label>

                <div className="p-3.5 rounded-xl bg-[#111622] border border-borderSubtle min-h-[50px] flex flex-wrap gap-2 items-center">
                  {tools.length > 0 ? (
                    tools.map((tool) => (
                      <ToolBadge
                        key={tool}
                        tool={tool}
                        onRemove={() => removeTool(tool)}
                      />
                    ))
                  ) : (
                    <span className="text-xs text-mutedText">
                      No tools added yet. Select from presets below or type a custom tool.
                    </span>
                  )}
                </div>
              </div>

              {/* Custom Tool Input */}
              <div className="space-y-1.5">
                <Label htmlFor="custom-tool" className="text-xs font-semibold text-mutedText">
                  Add Custom Tool / Library
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-tool"
                    placeholder="e.g. Prisma, Zustand, WebSockets"
                    value={customToolInput}
                    onChange={(e) => setCustomToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTool(customToolInput);
                      }
                    }}
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                  <Button
                    type="button"
                    onClick={() => addTool(customToolInput)}
                    className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>

              {/* Preset Catalogue */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-mutedText">
                  Popular Preset Stack (Click to Add)
                </Label>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                  {POPULAR_TOOLS.map((item) => {
                    const isSelected = tools.includes(item.name);
                    const Icon = getToolIcon(item.name);

                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() =>
                          isSelected ? removeTool(item.name) : addTool(item.name)
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white"
                            : "bg-[#111622] border-[#222938] text-mutedText hover:text-white hover:border-borderSubtle"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#2DD4BF]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: URLS & REPOSITORIES (ADAPTIVE MOBILE VS WEB) */}
          {activeTab === "links" && (
            <div className="space-y-4">
              {isMobile ? (
                /* MOBILE APP LINKS */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#111622] border border-emerald-500/20 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Mobile Distribution & App Stores</h4>
                      <p className="text-xs text-mutedText mt-0.5">
                        Configure official store listings, direct APK packages, and optional open-source mobile repositories.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Play Store */}
                    <div className="space-y-1.5">
                      <Label htmlFor="playStoreUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <FaGooglePlay className="w-3.5 h-3.5 text-[#00E676]" /> Google Play Store URL
                      </Label>
                      <Input
                        id="playStoreUrl"
                        placeholder="https://play.google.com/store/apps/details?id=..."
                        value={playStoreUrl}
                        onChange={(e) => setPlayStoreUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* App Store */}
                    <div className="space-y-1.5">
                      <Label htmlFor="appStoreUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <FaApple className="w-4 h-4 text-white" /> Apple App Store URL
                      </Label>
                      <Input
                        id="appStoreUrl"
                        placeholder="https://apps.apple.com/app/..."
                        value={appStoreUrl}
                        onChange={(e) => setAppStoreUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* Direct APK Download URL */}
                    <div className="space-y-1.5">
                      <Label htmlFor="apkUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-cyan-400" /> Direct Android .APK Download URL
                      </Label>
                      <Input
                        id="apkUrl"
                        placeholder="https://myportfolio.dev/downloads/app-release.apk"
                        value={apkUrl}
                        onChange={(e) => setApkUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* Mobile App GitHub / Source */}
                    <div className="space-y-1.5">
                      <Label htmlFor="githubUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-[#0B82EC]" /> Mobile App Repository (GitHub)
                      </Label>
                      <Input
                        id="githubUrl"
                        placeholder="https://github.com/..."
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* WEB APPLICATION LINKS */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#111622] border border-[#0B82EC]/20 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#0B82EC]/10 text-[#0B82EC] shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Web Deployments & Architecture Repos</h4>
                      <p className="text-xs text-mutedText mt-0.5">
                        Configure production website domains, git repositories, and client/server endpoints.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Live Demo URL */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="liveUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-[#0B82EC]" /> Live Production / Demo URL *
                        </Label>
                        {liveUrl && (
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#0B82EC] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Test Live URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <Input
                        id="liveUrl"
                        placeholder="https://myproject.com or https://myapp.vercel.app"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* Main GitHub URL */}
                    <div className="space-y-1.5">
                      <Label htmlFor="githubUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5 text-[#0B82EC]" /> Main GitHub Repository
                      </Label>
                      <Input
                        id="githubUrl"
                        placeholder="https://github.com/organization/repo"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* Client Repo URL */}
                    <div className="space-y-1.5">
                      <Label htmlFor="clientUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-mutedText" /> Frontend / Client Repo (Optional)
                      </Label>
                      <Input
                        id="clientUrl"
                        placeholder="https://github.com/...-client"
                        value={clientUrl}
                        onChange={(e) => setClientUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>

                    {/* Server Repo URL */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="serverUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-mutedText" /> Backend / API Server Repo or Docs (Optional)
                      </Label>
                      <Input
                        id="serverUrl"
                        placeholder="https://github.com/...-server or https://api.myproject.com/docs"
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        className="bg-[#111622] border-[#222938] text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MEDIA, SCREENS & PREVIEWS (ADAPTIVE MOBILE VS WEB) */}
          {activeTab === "media" && (
            <div className="space-y-6">
              {isMobile ? (
                /* ==================== MOBILE MEDIA SUITE ==================== */
                <div className="space-y-6">
                  {/* 1. App Icon Section */}
                  <div className="p-4 rounded-2xl bg-[#111622] border border-borderSubtle space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-emerald-400" />
                          <span>Application Icon (1:1 Squircle)</span>
                        </h4>
                        <p className="text-xs text-mutedText mt-0.5">
                          High-res square icon with curvature applied automatically for device headers and stores.
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[10px]">
                        1:1 Ratio
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      {/* Live Squircle Icon Preview */}
                      <div className="relative w-20 h-20 rounded-[22%] border-2 border-[#2A3245] bg-[#0A0D14] overflow-hidden shadow-2xl shrink-0 group flex items-center justify-center">
                        {appIconUrl ? (
                          <Image
                            src={appIconUrl}
                            alt="App Icon Preview"
                            fill
                            sizes="80px"
                            className="object-cover"
                            onError={() => {}}
                          />
                        ) : (
                          <Smartphone className="w-8 h-8 text-mutedText/40" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        <ImageDropzone
                          label="Upload from Device / Drag & Drop"
                          description="Drop 1:1 square icon or click to browse device"
                          aspectRatio="1:1"
                          folder="app-icons"
                          placeholderUrl={appIconUrl}
                          onUploadComplete={(url) => setAppIconUrl(Array.isArray(url) ? url[0] : url)}
                        />
                        <Input
                          placeholder="Or paste App Icon URL directly"
                          value={appIconUrl}
                          onChange={(e) => setAppIconUrl(e.target.value)}
                          className="bg-[#0D121F] border-[#222938] text-white text-xs"
                        />
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-mutedText font-semibold">Presets:</span>
                          {["/Hero3DMe.png", "/myProfile.png", "/HeroMe.png"].map((preset) => (
                            <button
                              type="button"
                              key={preset}
                              onClick={() => setAppIconUrl(preset)}
                              className="px-2 py-0.5 rounded bg-[#161D2E] border border-borderSubtle text-[10px] text-mutedText hover:text-white transition-colors"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Portrait Mobile Screenshots Manager (9:19) */}
                  <div className="p-4 rounded-2xl bg-[#111622] border border-borderSubtle space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#0B82EC]" />
                          <span>Mobile Portrait Screens Showcase ({screenshots.length})</span>
                        </h4>
                        <p className="text-xs text-mutedText mt-0.5">
                          Add multiple portrait screens (aspect ratio 9:19). Displayed in the public interactive smartphone mockup frame.
                        </p>
                      </div>
                      <Badge variant="teal" className="text-[10px]">
                        9:19 Portrait
                      </Badge>
                    </div>

                    {/* Drag & Drop Multi-Screen Upload Target */}
                    <ImageDropzone
                      multiple={true}
                      label="Upload Mobile Portrait Screenshots"
                      description="Drag & drop 1 or more portrait screenshots, or click to browse device"
                      aspectRatio="9:19"
                      folder="screenshots"
                      onUploadComplete={(urls) => {
                        const newUrls = Array.isArray(urls) ? urls : [urls];
                        setScreenshots((prev) => [...prev, ...newUrls.filter((u) => !prev.includes(u))]);
                      }}
                    />

                    {/* Or manual URL entry */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Or paste screenshot URL manually (e.g. /Hero3DMe.png or https://...)"
                        value={newScreenshotInput}
                        onChange={(e) => setNewScreenshotInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddScreenshot(newScreenshotInput);
                          }
                        }}
                        className="bg-[#0D121F] border-[#222938] text-white text-xs"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddScreenshot(newScreenshotInput)}
                        className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </div>

                    {/* Screenshots Filmstrip / Grid */}
                    <div className="pt-2">
                      {screenshots.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar">
                          {screenshots.map((shot, idx) => {
                            const isCurrentCover = image === shot;
                            return (
                              <div
                                key={`${shot}-${idx}`}
                                className={`w-28 sm:w-32 aspect-[9/19] rounded-2xl border-2 shrink-0 bg-[#0A0D14] relative overflow-hidden shadow-xl group transition-all ${
                                  isCurrentCover ? "border-[#2DD4BF] ring-2 ring-[#2DD4BF]/30" : "border-borderSubtle"
                                }`}
                              >
                                <Image
                                  src={shot}
                                  alt={`Screen ${idx + 1}`}
                                  fill
                                  sizes="128px"
                                  className="object-cover"
                                  onError={() => {}}
                                />

                                {/* Subtle smartphone bezel notch at top */}
                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-black/60 z-10" />

                                {/* Screen order badge */}
                                <div className="absolute top-2 left-2 z-10">
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-black/70 text-white border border-white/10 backdrop-blur-sm">
                                    #{idx + 1}
                                  </span>
                                </div>

                                {isCurrentCover && (
                                  <div className="absolute bottom-2 left-2 z-10">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#2DD4BF] text-black">
                                      Cover
                                    </span>
                                  </div>
                                )}

                                {/* Hover Control Overlay */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveScreenshot(idx)}
                                      className="p-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                                      title="Remove screenshot"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="space-y-1">
                                    {!isCurrentCover && (
                                      <button
                                        type="button"
                                        onClick={() => setImage(shot)}
                                        className="w-full py-1 rounded bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-[10px] font-bold transition-colors"
                                      >
                                        Set Cover
                                      </button>
                                    )}
                                    <div className="flex items-center justify-between gap-1">
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => handleMoveScreenshot(idx, "left")}
                                        className="flex-1 py-0.5 rounded bg-surface text-mutedText hover:text-white disabled:opacity-30 text-[10px] font-mono flex items-center justify-center"
                                      >
                                        <ArrowLeft className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === screenshots.length - 1}
                                        onClick={() => handleMoveScreenshot(idx, "right")}
                                        className="flex-1 py-0.5 rounded bg-surface text-mutedText hover:text-white disabled:opacity-30 text-[10px] font-mono flex items-center justify-center"
                                      >
                                        <ArrowRight className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl border border-dashed border-borderSubtle text-center space-y-2">
                          <Smartphone className="w-8 h-8 text-mutedText/40 mx-auto" />
                          <p className="text-xs text-mutedText">No mobile screenshots added yet.</p>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setScreenshots(["/Hero3DMe.png", "/myProfile.png"])}
                            className="text-xs border-borderSubtle"
                          >
                            Load Sample Screens
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Primary Card Image Fallback */}
                  <div className="space-y-1.5">
                    <Label htmlFor="image" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0B82EC]" /> Primary Showcase Thumbnail
                    </Label>
                    <Input
                      id="image"
                      placeholder="/Hero3DMe.png"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="bg-[#111622] border-[#222938] text-white text-xs"
                    />
                  </div>
                </div>
              ) : (
                /* ==================== WEB MEDIA SUITE ==================== */
                <div className="space-y-6">
                  {/* 1. Desktop Hero Banner & Browser Mockup Preview */}
                  <div className="p-4 rounded-2xl bg-[#111622] border border-borderSubtle space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-[#0B82EC]" />
                          <span>Primary Desktop Banner & Browser Mockup</span>
                        </h4>
                        <p className="text-xs text-mutedText mt-0.5">
                          High-resolution widescreen screenshot displayed in the desktop browser window frame.
                        </p>
                      </div>
                      <Badge className="bg-[#0B82EC]/10 border-[#0B82EC]/20 text-[#0B82EC] text-[10px]">
                        16:10 Widescreen
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <ImageDropzone
                        label="Upload Desktop Banner (16:10 / 16:9)"
                        description="Drag & drop widescreen screenshot or browse from device"
                        aspectRatio="16:10"
                        folder="banners"
                        placeholderUrl={image}
                        onUploadComplete={(url) => setImage(Array.isArray(url) ? url[0] : url)}
                      />
                      <Input
                        placeholder="Or paste desktop banner URL directly"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="bg-[#0D121F] border-[#222938] text-white text-xs"
                      />
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-mutedText font-semibold">Presets:</span>
                        {["/Hero3DMe.png", "/myProfile.png", "/images/project1.png"].map((preset) => (
                          <button
                            type="button"
                            key={preset}
                            onClick={() => setImage(preset)}
                            className="px-2 py-0.5 rounded bg-[#161D2E] border border-borderSubtle text-[10px] text-mutedText hover:text-white transition-colors"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sleek macOS Browser Mockup Preview */}
                    <div className="rounded-xl border border-borderSubtle bg-[#0B0F19] overflow-hidden shadow-2xl">
                      {/* Browser Chrome Header */}
                      <div className="px-3.5 py-2.5 bg-[#141A29] border-b border-borderSubtle flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                        </div>
                        <div className="flex-1 max-w-sm mx-auto px-3 py-1 rounded-md bg-[#0B0F19] border border-[#222938] flex items-center justify-center gap-1.5 text-[11px] text-mutedText font-mono truncate">
                          <Lock className="w-3 h-3 text-[#2DD4BF]" />
                          <span className="truncate">{liveUrl || "https://myproject.dev/demo"}</span>
                        </div>
                        <div className="w-10 flex justify-end">
                          <span className="text-[10px] text-mutedText font-bold">16:10</span>
                        </div>
                      </div>

                      {/* Viewport */}
                      <div className="relative aspect-[16/10] w-full bg-mainBg flex items-center justify-center">
                        {image ? (
                          <Image
                            src={image}
                            alt="Desktop Preview"
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                            onError={() => {}}
                          />
                        ) : (
                          <Monitor className="w-10 h-10 text-mutedText/30" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Desktop Screenshot Gallery (images: string[]) */}
                  <div className="p-4 rounded-2xl bg-[#111622] border border-borderSubtle space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-[#2DD4BF]" />
                          <span>Desktop Widescreen Gallery ({images.length})</span>
                        </h4>
                        <p className="text-xs text-mutedText mt-0.5">
                          Additional widescreen screenshots showcasing dashboard, analytics, admin screens, or alternate workflows.
                        </p>
                      </div>
                      <Badge variant="teal" className="text-[10px]">
                        Widescreen Views
                      </Badge>
                    </div>

                    {/* Drag & Drop Multi-View Upload Target */}
                    <ImageDropzone
                      multiple={true}
                      label="Upload Desktop Widescreen Views"
                      description="Drag & drop 1 or more widescreen views, or click to browse device"
                      aspectRatio="16:10"
                      folder="desktop-views"
                      onUploadComplete={(urls) => {
                        const newUrls = Array.isArray(urls) ? urls : [urls];
                        setImages((prev) => [...prev, ...newUrls.filter((u) => !prev.includes(u))]);
                      }}
                    />

                    {/* Or manual URL entry */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Or paste widescreen view URL manually (e.g. /Hero3DMe.png or https://...)"
                        value={newImageInput}
                        onChange={(e) => setNewImageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddImage(newImageInput);
                          }
                        }}
                        className="bg-[#0D121F] border-[#222938] text-white text-xs"
                      />
                      <Button
                        type="button"
                        onClick={() => handleAddImage(newImageInput)}
                        className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </Button>
                    </div>

                    {/* Widescreen Grid */}
                    <div className="pt-2">
                      {images.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {images.map((imgUrl, idx) => {
                            const isCurrentBanner = image === imgUrl;
                            return (
                              <div
                                key={`${imgUrl}-${idx}`}
                                className={`rounded-xl border bg-[#0B0F19] overflow-hidden relative shadow-lg group transition-all ${
                                  isCurrentBanner ? "border-[#0B82EC] ring-2 ring-[#0B82EC]/30" : "border-borderSubtle"
                                }`}
                              >
                                {/* Mini browser header */}
                                <div className="px-2.5 py-1.5 bg-[#141A29] border-b border-borderSubtle/60 flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F56]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F]" />
                                  </div>
                                  <span className="text-[9px] font-bold text-mutedText">View #{idx + 1}</span>
                                  {isCurrentBanner && (
                                    <span className="text-[9px] font-bold text-[#0B82EC]">Hero Cover</span>
                                  )}
                                </div>

                                <div className="relative aspect-[16/10] w-full bg-mainBg">
                                  <Image
                                    src={imgUrl}
                                    alt={`View ${idx + 1}`}
                                    fill
                                    sizes="300px"
                                    className="object-cover"
                                    onError={() => {}}
                                  />

                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(idx)}
                                        className="p-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                                        title="Remove view"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                      {!isCurrentBanner && (
                                        <button
                                          type="button"
                                          onClick={() => setImage(imgUrl)}
                                          className="px-2 py-1 rounded bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-[10px] font-bold transition-colors"
                                        >
                                          Set As Banner
                                        </button>
                                      )}
                                      <div className="flex items-center gap-1 ml-auto">
                                        <button
                                          type="button"
                                          disabled={idx === 0}
                                          onClick={() => handleMoveImage(idx, "left")}
                                          className="p-1 rounded bg-surface text-mutedText hover:text-white disabled:opacity-30"
                                        >
                                          <ArrowLeft className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={idx === images.length - 1}
                                          onClick={() => handleMoveImage(idx, "right")}
                                          className="p-1 rounded bg-surface text-mutedText hover:text-white disabled:opacity-30"
                                        >
                                          <ArrowRight className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl border border-dashed border-borderSubtle text-center space-y-2">
                          <Laptop className="w-8 h-8 text-mutedText/40 mx-auto" />
                          <p className="text-xs text-mutedText">No desktop gallery screenshots added yet.</p>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setImages(["/Hero3DMe.png"])}
                            className="text-xs border-borderSubtle"
                          >
                            Add Primary Banner as First View
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 border-t border-borderSubtle pt-4 mt-6">
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
              className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-bold shadow-lg shadow-[#0B82EC]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditMode ? "Save Changes" : "Create Project"}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
