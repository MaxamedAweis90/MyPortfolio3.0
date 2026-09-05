"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  RiExternalLinkLine,
  RiEyeLine,
  RiArrowRightUpLine,
} from "react-icons/ri";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
  proj: Project;
  index?: number;
  isNew?: boolean;
};

export default function ProjectCard({ proj, index, isNew }: ProjectCardProps) {
  const router = useRouter();
  const detailHref = proj.slug ? `/work/${proj.slug}` : undefined;

  // Persistent project number from schema (never dynamic array index)
  const formattedNumber = (
    proj.projectNumber !== undefined && proj.projectNumber !== null
      ? proj.projectNumber
      : (proj.order || (typeof index === "number" ? index + 1 : 1))
  )
    .toString()
    .padStart(2, "0");

  const handleCardClick = () => {
    if (detailHref) {
      router.push(detailHref);
    }
  };

  // Extract tools as array of string badges
  const techList =
    proj.tools && proj.tools.length > 0
      ? proj.tools.map((t) => t.title)
      : (proj.shortTagline || "React, Next.js, TypeScript").split(/,\s*/);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`View project details for ${proj.title}`}
      className="bg-surface/90 backdrop-blur-xl border border-borderSubtle hover:border-brandAccent/70 rounded-3xl p-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(11,130,236,0.18)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brandAccent"
    >
      {/* Ambient bottom-up glow on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-brandAccent/20 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top subtle light flare */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brandAccent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 space-y-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Header Row: Project Number + New Badge + Category + Hover Arrow */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-primaryText tracking-tight group-hover:text-brandAccent transition-colors">
                {formattedNumber}
              </span>
              {isNew && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[#0B82EC] to-[#2DD4BF] text-white shadow-sm shadow-[#0B82EC]/30 animate-pulse">
                  New
                </span>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-brandAccent/60" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-mainBg border border-borderSubtle text-brandAccent shadow-sm">
                {proj.category || "Web App"}
              </span>
              <span className="p-1.5 rounded-full bg-mainBg border border-borderSubtle text-mutedText group-hover:text-primaryText group-hover:border-brandAccent/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                <RiArrowRightUpLine className="text-sm" />
              </span>
            </div>
          </div>

          {/* Project Title */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-primaryText group-hover:text-brandAccent transition-colors leading-snug line-clamp-1">
              {proj.title}
            </h3>

            {/* Tech Badges Row */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {techList.slice(0, 4).map((tech, idx) => (
                <span
                  key={`${tech}-${idx}`}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-mainBg/90 text-mutedText group-hover:text-primaryText border border-borderSubtle/80 transition-colors"
                >
                  {tech}
                </span>
              ))}
              {techList.length > 4 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brandAccent/10 text-brandAccent border border-brandAccent/20">
                  +{techList.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Project Image Preview Container */}
        <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden mt-4 border border-borderSubtle/80 bg-mainBg shrink-0 shadow-inner group/img">
          <Image
            src={proj.images?.[0] || proj.screenshots?.[0] || "/Hero3DMe.png"}
            alt={proj.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Overlay gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-mainBg/90 via-mainBg/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
            {detailHref && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brandAccent text-white font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">
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
                aria-label={`Open live preview for ${proj.title} (opens in new tab)`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface/95 border border-borderSubtle text-primaryText font-bold text-xs hover:border-brandAccent transition-colors shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brandAccent"
              >
                <span>Live Preview</span>
                <RiExternalLinkLine className="text-xs" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
