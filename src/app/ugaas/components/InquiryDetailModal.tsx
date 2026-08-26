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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  User,
  Phone,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

export interface InquiryItem {
  id: string;
  projectName: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget?: string;
  deadline?: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string | Date;
}

interface InquiryDetailModalProps {
  inquiry: InquiryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: (id: string, newStatus: "unread" | "read") => void;
}

export function InquiryDetailModal({
  inquiry,
  isOpen,
  onClose,
  onStatusUpdated,
}: InquiryDetailModalProps) {
  const [updating, setUpdating] = useState(false);

  if (!inquiry) return null;

  const formattedDate = new Date(inquiry.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const toggleStatus = async () => {
    const nextStatus = inquiry.status === "unread" ? "read" : "unread";
    setUpdating(true);
    try {
      const res = await fetch(`/api/ugaas/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          nextStatus === "read"
            ? "Inquiry marked as read"
            : "Inquiry marked as unread"
        );
        onStatusUpdated?.(inquiry.id, nextStatus);
        onClose();
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-surface border-borderSubtle text-primaryText rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-2 border-b border-borderSubtle pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#0B82EC]/15 border border-[#0B82EC]/30 flex items-center justify-center text-[#0B82EC]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {inquiry.projectName}
                </DialogTitle>
                <DialogDescription className="text-xs text-mutedText flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> Received {formattedDate}
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant={inquiry.status === "unread" ? "default" : "teal"}
              className="capitalize px-3 py-1 text-xs"
            >
              {inquiry.status}
            </Badge>
          </div>
        </DialogHeader>

        {/* Sender Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#111622] border border-borderSubtle text-xs">
          <div className="flex items-center gap-2 text-mutedText">
            <User className="w-4 h-4 text-[#0B82EC]" />
            <span>Client:</span>
            <strong className="text-white">{inquiry.name}</strong>
          </div>

          <div className="flex items-center gap-2 text-mutedText">
            <Mail className="w-4 h-4 text-[#0B82EC]" />
            <span>Email:</span>
            <a
              href={`mailto:${inquiry.email}`}
              className="text-[#0B82EC] hover:underline truncate"
            >
              {inquiry.email}
            </a>
          </div>

          <div className="flex items-center gap-2 text-mutedText">
            <Phone className="w-4 h-4 text-[#0B82EC]" />
            <span>Phone:</span>
            <span className="text-white">{inquiry.phone || "Not provided"}</span>
          </div>

          <div className="flex items-center gap-2 text-mutedText">
            <DollarSign className="w-4 h-4 text-[#2DD4BF]" />
            <span>Budget:</span>
            <span className="text-white font-medium">{inquiry.budget || "Flexible"}</span>
          </div>

          <div className="flex items-center gap-2 text-mutedText sm:col-span-2">
            <Calendar className="w-4 h-4 text-[#3B82F6]" />
            <span>Project Type & Deadline:</span>
            <span className="text-white">
              {inquiry.projectType} • {inquiry.deadline || "Flexible"}
            </span>
          </div>
        </div>

        {/* Full Message Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-mutedText">
            Proposal & Message Content
          </label>
          <div className="p-4 rounded-xl bg-[#111622] border border-borderSubtle text-sm text-primaryText leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
            {inquiry.message || "No message content provided."}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between border-t border-borderSubtle pt-4 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={toggleStatus}
            disabled={updating}
            className="border-borderSubtle text-primaryText hover:text-white"
          >
            {updating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 text-[#2DD4BF] mr-2" />
            )}
            {inquiry.status === "unread" ? "Mark as Read" : "Mark as Unread"}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="bg-[#0B82EC] hover:bg-[#3B82F6] text-white gap-2"
            >
              <a
                href={`mailto:${inquiry.email}?subject=Re: Project Inquiry - ${encodeURIComponent(
                  inquiry.projectName
                )}`}
              >
                <Mail className="w-4 h-4" />
                <span>Reply via Email</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
