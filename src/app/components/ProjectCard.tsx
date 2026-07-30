"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiExternalLinkLine, RiEyeLine } from "react-icons/ri";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
  proj: Project;
  index: number;
};

export default function ProjectCard({ proj, index }: ProjectCardProps) {
  const router = useRouter();
  const detailHref = proj.slug ? `/work/${proj.slug}` : undefined;

  // Format index as 2-digit string: 01, 02, 03...
  const formattedIndex = (index + 1).toString().padStart(2, "0");

  // Format tools stack list string
  const techStackText =
    proj.tools && proj.tools.length > 0
      ? proj.tools.map((t) => t.title).join(", ")
      : proj.shortTagline || "HTML, CSS, JavaScript, React, Next.js";

  const handleCardClick = () => {
    if (detailHref) {
      router.push(detailHref);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-surface/90 backdrop-blur-md border border-borderSubtle hover:border-brandAccent/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between h-full transition-all duration-500 hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Ambient bottom glow effect using brand Accent color */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-brandAccent/25 via-secondaryAccent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          {/* 1. Top Header Row: Large Index Number + Category Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl sm:text-4xl font-black text-primaryText tracking-tight">
              {formattedIndex}
            </span>
            <span className="text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-mainBg border border-borderSubtle text-brandAccent shadow-sm">
              {proj.category || "Web"}
            </span>
          </div>

          {/* 2. Middle Content: Title + Technologies used */}
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-primaryText group-hover:text-brandAccent transition-colors leading-tight line-clamp-1">
              {proj.title}
            </h3>

            <div className="pt-2 space-y-1">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-mutedText">
                Technologies used
              </p>
              <p className="text-xs sm:text-sm text-primaryText/80 font-medium leading-relaxed line-clamp-2">
                {techStackText}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Bottom Preview Slot: Rounded Image Preview Container */}
        <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden mt-4 border border-borderSubtle bg-mainBg shrink-0">
          <img
            src={proj.images?.[0] || proj.screenshots?.[0] || "/Hero3DMe.png"}
            alt={proj.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Hover overlay with action buttons */}
          <div className="absolute inset-0 bg-mainBg/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
            {detailHref && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brandAccent text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-transform">
                <span>View Details</span>
                <RiEyeLine className="text-sm" />
              </span>
            )}
            {proj.liveProjectUrl && (
              <a
                href={proj.liveProjectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface border border-borderSubtle text-primaryText font-bold text-xs hover:border-brandAccent transition-colors"
              >
                <span>Live</span>
                <RiExternalLinkLine className="text-xs" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
