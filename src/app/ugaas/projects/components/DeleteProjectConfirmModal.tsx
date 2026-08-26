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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export interface ProjectItem {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  category: string;
  desc: string;
  fullDesc?: string;
  liveUrl?: string;
  githubUrl?: string;
  clientUrl?: string;
  serverUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  image: string;
  tools: string[];
  isFeatured: boolean;
  order: number;
  createdAt?: string | Date;
}

interface DeleteProjectConfirmModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteProjectConfirmModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: DeleteProjectConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  if (!project) return null;

  const handleDelete = async () => {
    setLoading(true);
    const targetId = project.id || project._id || project.slug;

    try {
      const res = await fetch(`/api/ugaas/projects/${targetId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Project "${project.title}" deleted.`);
        onSuccess(targetId);
        onClose();
      } else {
        toast.error(data.error || "Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto sm:mx-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-white">
              Delete Project?
            </DialogTitle>
            <DialogDescription className="text-sm text-mutedText mt-1.5 leading-relaxed">
              Are you sure you want to remove <strong>{project.title}</strong>? This action cannot be undone and will remove it from your live showcase.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 border-t border-borderSubtle pt-4 mt-2">
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
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
