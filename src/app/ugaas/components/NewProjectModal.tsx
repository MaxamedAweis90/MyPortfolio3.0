"use client";

import React, { useState } from "react";
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
  const [formData, setFormData] = useState({
    title: "",
    category: "Web",
    desc: "",
    liveUrl: "",
    githubUrl: "",
    image: "/Hero3DMe.png",
    tools: "Next.js, TypeScript, TailwindCSS",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desc.trim()) {
      toast.warn("Please provide both a title and description.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ugaas/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <DialogContent className="max-w-lg bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl">
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
            <div className="grid grid-cols-4 gap-2">
              {["Web", "Mobile", "Design", "All"].map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    formData.category === cat
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

          {/* Live & GitHub URLs */}
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
