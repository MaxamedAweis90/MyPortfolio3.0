"use client";

import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { toast } from "react-toastify";

interface ImageDropzoneProps {
  onUploadComplete: (url: string | string[]) => void;
  folder?: string;
  multiple?: boolean;
  aspectRatio?: "1:1" | "9:19" | "16:10" | "auto";
  label?: string;
  description?: string;
  placeholderUrl?: string;
  allowUrlFallback?: boolean;
  className?: string;
}

export function ImageDropzone({
  onUploadComplete,
  folder = "projects",
  multiple = false,
  aspectRatio = "auto",
  label,
  description,
  placeholderUrl,
  allowUrlFallback = true,
  className = "",
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(placeholderUrl || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/ugaas/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (data.message && data.storage === "local-fallback") {
          // Subtle hint for Vercel Blob setup
          console.info("ℹ️ [Upload Storage]:", data.message);
        }
        return data.url;
      } else {
        throw new Error(data.error || "Upload failed");
      }
    },
    [folder]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));

      if (fileArray.length === 0) {
        toast.error("Please select a valid image file (PNG, JPG, WebP, etc.)");
        return;
      }

      setIsUploading(true);
      const uploadedUrls: string[] = [];

      try {
        if (!multiple) {
          const file = fileArray[0];
          setUploadProgressText(`Uploading "${file.name}"...`);
          const url = await uploadFile(file);
          if (url) {
            uploadedUrls.push(url);
            toast.success("Image uploaded successfully!");
            onUploadComplete(url);
          }
        } else {
          for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            setUploadProgressText(`Uploading ${i + 1} of ${fileArray.length}: "${file.name}"...`);
            try {
              const url = await uploadFile(file);
              if (url) uploadedUrls.push(url);
            } catch (err: any) {
              toast.error(`Failed to upload ${file.name}: ${err.message}`);
            }
          }

          if (uploadedUrls.length > 0) {
            toast.success(`Uploaded ${uploadedUrls.length} image(s) successfully!`);
            onUploadComplete(uploadedUrls);
          }
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to upload file");
      } finally {
        setIsUploading(false);
        setUploadProgressText("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [multiple, onUploadComplete, uploadFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualUrl.trim();
    if (!trimmed) return;
    onUploadComplete(multiple ? [trimmed] : trimmed);
    toast.success("URL applied successfully!");
    setManualUrl("");
    setShowUrlInput(false);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between text-xs">
        {label ? (
          <span className="font-semibold text-mutedText flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#0B82EC]" />
            <span>{label}</span>
          </span>
        ) : <span />}

        {allowUrlFallback && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-[#0B82EC] hover:text-[#3B82F6] font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? "Use File Upload" : "Paste URL Instead"}</span>
          </button>
        )}
      </div>

      {showUrlInput ? (
        /* Manual URL Fallback Input */
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="https://... or /image.png"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-[#111622] border border-[#222938] rounded-xl px-3 py-2 text-xs text-white placeholder-mutedText focus:outline-none focus:border-[#0B82EC]"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-[#0B82EC] hover:bg-[#3B82F6] text-white text-xs font-bold shrink-0 transition-colors"
          >
            Apply URL
          </button>
        </form>
      ) : (
        /* Drag & Drop Target */
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClick();
            }
          }}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-5 flex flex-col items-center justify-center text-center cursor-pointer group select-none overflow-hidden ${
            isDragging
              ? "border-[#0B82EC] bg-[#0B82EC]/15 ring-4 ring-[#0B82EC]/25 scale-[1.01]"
              : "border-[#222938] hover:border-[#0B82EC]/60 bg-[#0B0F19]/80 hover:bg-[#0E1320]"
          } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
        >
          {/* Hidden Native File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
            multiple={multiple}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B82EC]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2.5 py-2">
              <div className="w-10 h-10 rounded-full bg-[#0B82EC]/20 border border-[#0B82EC]/40 flex items-center justify-center text-[#0B82EC]">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Uploading to Cloud Storage...</p>
                <p className="text-[11px] font-mono text-mutedText">{uploadProgressText}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1 relative z-10">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isDragging
                    ? "bg-[#0B82EC] text-white scale-110 shadow-lg shadow-[#0B82EC]/40"
                    : "bg-surface border border-borderSubtle text-[#0B82EC] group-hover:scale-110 group-hover:border-[#0B82EC]/40 group-hover:text-white"
                }`}
              >
                <UploadCloud className="w-5 h-5" />
              </div>

              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white group-hover:text-[#0B82EC] transition-colors">
                  {isDragging ? "Drop images to upload" : "Drag & drop image here, or browse device"}
                </p>
                <p className="text-[11px] text-mutedText">
                  {description ||
                    `Supports PNG, JPG, WebP, SVG up to 10MB ${
                      multiple ? "• Multi-file enabled" : ""
                    }`}
                </p>
              </div>

              {aspectRatio !== "auto" && (
                <div className="pt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-surface border border-borderSubtle text-mutedText">
                    Target Aspect Ratio: {aspectRatio}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
