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
import { AlertTriangle, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

interface ReseedConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReseedConfirmModal({
  isOpen,
  onClose,
  onSuccess,
}: ReseedConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleReseed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ugaas/reseed", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Database reseeded successfully!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(data.error || "Failed to reseed database");
      }
    } catch {
      toast.error("Failed to reseed database");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto sm:mx-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-white">
              Reseed Database Content?
            </DialogTitle>
            <DialogDescription className="text-sm text-mutedText mt-1.5 leading-relaxed">
              This will safely re-populate default records for all <strong>Projects</strong>, <strong>Experiences</strong>, and <strong>Certificates</strong> from your local data files into MongoDB. Existing inquiry leads will remain untouched.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="p-3.5 rounded-xl bg-[#111622] border border-borderSubtle text-xs text-mutedText space-y-1.5">
          <div className="flex items-center gap-2 text-white font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
            <span>Overwrites default showcase records</span>
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
            <span>Syncs newly updated local projects to Atlas</span>
          </div>
        </div>

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
            onClick={handleReseed}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reseeding...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Confirm Reseed</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
