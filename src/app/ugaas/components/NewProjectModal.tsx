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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FolderPlus, Loader2, Sparkles, Check } from "lucide-react";
import { toast } from "react-toastify";
import { ImageDropzone } from "./ImageDropzone";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: NewProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(["Web", "Mobile", "Design"]);
  const [formData, setFormData] = useState({
    title: "",
    category: "Web",
    desc: "",
    liveUrl: "",
    githubUrl: "",
    playStoreUrl: "",
    appStoreUrl: "",
    appIconUrl: "/Hero3DMe.png",
    image: "/Hero3DMe.png",
    tools: "Next.js, TypeScript, TailwindCSS",
  });

  const isMobile = formData.category.toLowerCase().includes("mobile");

  useEffect(() => {
    if (isOpen) {
      fetch(`/api/ugaas/projects/categories?t=${Date.now()}`, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.categories && data.categories.length > 0) {
            setCategories(data.categories.map((c: any) => c.name));
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desc.trim()) {
      toast.warn("Please provide both a title and description.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        appIconUrl: formData.appIconUrl.trim() || formData.image.trim() || "/Hero3DMe.png",
        screenshots: [formData.image.trim() || "/Hero3DMe.png"],
        images: [formData.image.trim() || "/Hero3DMe.png"],
      };

      const res = await fetch("/api/ugaas/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Project created successfully!");
        onSuccess?.();
        onClose();
        setFormData({
          title: "",
          category: "Web",
          desc: "",
          liveUrl: "",
          githubUrl: "",
          playStoreUrl: "",
          appStoreUrl: "",
          appIconUrl: "/Hero3DMe.png",
          image: "/Hero3DMe.png",
          tools: "Next.js, TypeScript, TailwindCSS",
        });
      } else {
        toast.error(data.error || "Failed to create project");
      }
    } catch {
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl pr-3">
        <DialogHeader className="space-y-2 border-b border-borderSubtle pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-xs text-mutedText flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
                Add a new project or case study to your portfolio
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Project Title */}
          <div className="space-y-1.5">
            <Label htmlFor="project-title" className="text-xs text-mutedText">
              Project Title *
            </Label>
            <Input
              id="project-title"
              required
              placeholder="e.g. AI Portfolio 3.0"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-[#111622] border-[#222938] text-white"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs text-mutedText">
              Category
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    formData.category.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#0B82EC]/20 border-[#0B82EC] text-white"
                      : "bg-[#111622] border-[#222938] text-mutedText hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Short Tagline / Description */}
          <div className="space-y-1.5">
            <Label htmlFor="project-desc" className="text-xs text-mutedText">
              Short Description *
            </Label>
            <Textarea
              id="project-desc"
              required
              rows={3}
              placeholder="Brief summary of the project goals, stack, and deliverables..."
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              className="bg-[#111622] border-[#222938] text-white min-h-[70px]"
            />
          </div>

          {/* Platform Specific Media & Distribution */}
          {isMobile ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="playStoreUrl" className="text-xs text-mutedText">
                    Google Play Store URL
                  </Label>
                  <Input
                    id="playStoreUrl"
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    value={formData.playStoreUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, playStoreUrl: e.target.value })
                    }
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="appStoreUrl" className="text-xs text-mutedText">
                    Apple App Store URL
                  </Label>
                  <Input
                    id="appStoreUrl"
                    placeholder="https://apps.apple.com/app/..."
                    value={formData.appStoreUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, appStoreUrl: e.target.value })
                    }
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-mutedText">
                  Mobile App Icon (1:1 Ratio)
                </Label>
                <ImageDropzone
                  label="Upload App Icon"
                  description="Drop 1:1 icon or click to select from device"
                  aspectRatio="1:1"
                  folder="app-icons"
                  placeholderUrl={formData.appIconUrl}
                  onUploadComplete={(url) => {
                    const u = Array.isArray(url) ? url[0] : url;
                    setFormData((prev) => ({
                      ...prev,
                      appIconUrl: u,
                      image: u,
                    }));
                  }}
                />
                <Input
                  id="appIconUrl"
                  placeholder="Or paste App Icon URL directly (/Hero3DMe.png or https://...)"
                  value={formData.appIconUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, appIconUrl: e.target.value })
                  }
                  className="bg-[#111622] border-[#222938] text-white text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="live-url" className="text-xs text-mutedText">
                    Live URL (Optional)
                  </Label>
                  <Input
                    id="live-url"
                    placeholder="https://example.com"
                    value={formData.liveUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, liveUrl: e.target.value })
                    }
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="github-url" className="text-xs text-mutedText">
                    GitHub URL (Optional)
                  </Label>
                  <Input
                    id="github-url"
                    placeholder="https://github.com/..."
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, githubUrl: e.target.value })
                    }
                    className="bg-[#111622] border-[#222938] text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-mutedText">
                  Desktop Hero Banner (16:10 / 16:9)
                </Label>
                <ImageDropzone
                  label="Upload Desktop Banner"
                  description="Drop 16:10 screenshot or click to select from device"
                  aspectRatio="16:10"
                  folder="banners"
                  placeholderUrl={formData.image}
                  onUploadComplete={(url) => {
                    const u = Array.isArray(url) ? url[0] : url;
                    setFormData((prev) => ({
                      ...prev,
                      image: u,
                    }));
                  }}
                />
                <Input
                  placeholder="Or paste banner image URL directly (/Hero3DMe.png or https://...)"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="bg-[#111622] border-[#222938] text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Tech Stack Tools */}
          <div className="space-y-1.5">
            <Label htmlFor="tools" className="text-xs text-mutedText">
              Tools & Tech Stack (comma separated)
            </Label>
            <Input
              id="tools"
              placeholder="Next.js, TypeScript, TailwindCSS, MongoDB"
              value={formData.tools}
              onChange={(e) =>
                setFormData({ ...formData, tools: e.target.value })
              }
              className="bg-[#111622] border-[#222938] text-white text-xs"
            />
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
              className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2 font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Create Project</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
