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
  Layers,
  Star,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import { ToolBadge, POPULAR_TOOLS, getToolIcon } from "./ToolIconHelper";
import { ProjectItem } from "./DeleteProjectConfirmModal";

interface ProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectItem | null;
  onSuccess: (savedProject: ProjectItem, isNew: boolean) => void;
}

export function ProjectDialog({
  isOpen,
  onClose,
  project,
  onSuccess,
}: ProjectDialogProps) {
  const isEditMode = Boolean(project);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "tech" | "links" | "media">("general");

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [category, setCategory] = useState<"Web" | "Mobile" | "Design" | "All">("Web");
  const [desc, setDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [playStoreUrl, setPlayStoreUrl] = useState("");
  const [appStoreUrl, setAppStoreUrl] = useState("");
  const [image, setImage] = useState("/Hero3DMe.png");
  const [tools, setTools] = useState<string[]>(["Next.js", "TypeScript", "TailwindCSS"]);
  const [customToolInput, setCustomToolInput] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

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
      setImage("/Hero3DMe.png");
      setTools(["Next.js", "TypeScript", "TailwindCSS"]);
      setIsFeatured(false);
    }
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

  const removeTool = (toolToRemove: string) => {
    setTools(tools.filter((t) => t !== toolToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !desc.trim()) {
      toast.warn("Title and short description are required.");
      setActiveTab("general");
      return;
    }

    setLoading(true);

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
      image: image.trim() || "/Hero3DMe.png",
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC]">
              <FolderKanban className="w-5 h-5" />
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
                  ? `Update "${project?.title}" metadata, tech stack, and links.`
                  : "Fill out the fields below to add a new project to your showcase."}
              </DialogDescription>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 pt-3 border-t border-borderSubtle/60 mt-3">
            {[
              { id: "general", label: "General & Info" },
              { id: "tech", label: "Tech Stack" },
              { id: "links", label: "URLs & Deployments" },
              { id: "media", label: "Media & Thumbnail" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-mutedText">Category</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["Web", "Mobile", "Design", "All"] as const).map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          category === cat
                            ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white shadow-inner"
                            : "bg-[#111622] border-[#222938] text-mutedText hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
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

          {/* TAB 3: URLS & REPOSITORIES */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Live Demo URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="liveUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0B82EC]" /> Live Demo URL
                  </Label>
                  <Input
                    id="liveUrl"
                    placeholder="https://myproject.com"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>

                {/* Main GitHub URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="githubUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-[#0B82EC]" /> GitHub Repository
                  </Label>
                  <Input
                    id="githubUrl"
                    placeholder="https://github.com/..."
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>

                {/* Client Repo URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="clientUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-mutedText" /> Frontend / Client Repo
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
                <div className="space-y-1.5">
                  <Label htmlFor="serverUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-mutedText" /> Backend / Server Repo
                  </Label>
                  <Input
                    id="serverUrl"
                    placeholder="https://github.com/...-server"
                    value={serverUrl}
                    onChange={(e) => setServerUrl(e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>

                {/* Play Store URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="playStoreUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#00E676]" /> Google Play Store URL
                  </Label>
                  <Input
                    id="playStoreUrl"
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    value={playStoreUrl}
                    onChange={(e) => setPlayStoreUrl(e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>

                {/* App Store URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="appStoreUrl" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-white" /> Apple App Store URL
                  </Label>
                  <Input
                    id="appStoreUrl"
                    placeholder="https://apps.apple.com/app/..."
                    value={appStoreUrl}
                    onChange={(e) => setAppStoreUrl(e.target.value)}
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & PREVIEW */}
          {activeTab === "media" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="image" className="text-xs font-semibold text-mutedText flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#0B82EC]" /> Primary Thumbnail / Screenshot URL
                </Label>
                <Input
                  id="image"
                  placeholder="/Hero3DMe.png or https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="bg-[#111622] border-[#222938] text-white text-xs"
                />
              </div>

              {/* Quick Image Presets */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-mutedText">Presets:</span>
                {["/Hero3DMe.png", "/myProfile.png", "/images/project1.png"].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setImage(preset)}
                    className="px-2 py-0.5 rounded bg-[#111622] border border-[#222938] text-[11px] text-mutedText hover:text-white transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Live Preview Card */}
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs font-semibold text-mutedText">
                  Live Showcase Card Preview
                </Label>
                <div className="max-w-md mx-auto rounded-2xl border border-borderSubtle bg-[#111622] p-4 space-y-3 shadow-xl">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-mainBg border border-borderSubtle flex items-center justify-center">
                    {image ? (
                      <Image
                        src={image}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                        onError={() => {}}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-mutedText/40" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm truncate">
                        {title || "Project Title Preview"}
                      </h4>
                      <Badge variant="teal" className="text-[10px]">
                        {category}
                      </Badge>
                    </div>
                    <p className="text-xs text-mutedText line-clamp-2">
                      {desc || "Project short description preview will appear here."}
                    </p>
                  </div>
                </div>
              </div>
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
