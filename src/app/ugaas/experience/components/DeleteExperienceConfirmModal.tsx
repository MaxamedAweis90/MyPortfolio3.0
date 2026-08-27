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
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export interface ExperienceItem {
  id: string;
  _id?: string;
  role: string;
  company: string;
  duration: string;
  badges: string[];
  highlights: string[];
  techStack: string[];
  image?: string;
  credentialUrl?: string;
  credentialId?: string;
  type: "career" | "education" | "certification";
  order: number;
}

interface DeleteExperienceConfirmModalProps {
  item: ExperienceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteExperienceConfirmModal({
  item,
  isOpen,
  onClose,
  onSuccess,
}: DeleteExperienceConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const handleDelete = async () => {
    const targetId = item.id || item._id;
    if (!targetId) {
      toast.error("Invalid record identifier");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/ugaas/experience/${targetId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Record "${item.role}" deleted.`);
        onSuccess(targetId);
        onClose();
      } else {
        toast.error(data.error || "Failed to delete record");
      }
    } catch {
      toast.error("Failed to delete record");
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
              Delete Timeline Entry?
            </DialogTitle>
            <DialogDescription className="text-sm text-mutedText mt-1.5 leading-relaxed">
              Are you sure you want to remove <strong>{item.role}</strong> at{" "}
              <strong>{item.company}</strong>? This action cannot be undone.
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
                <span>Delete Entry</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
