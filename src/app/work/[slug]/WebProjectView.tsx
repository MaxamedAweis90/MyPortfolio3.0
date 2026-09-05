"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Globe,
  Sparkles,
  Layers,
  Server,
  Code2,
  ShieldCheck,
} from "lucide-react";
import type { Project } from "@/types/portfolio";
import { TOOL_ICONS } from "@/components/toolIcons";
import { POPULAR_TOOLS } from "@/app/ugaas/projects/components/ToolIconHelper";

interface WebProjectViewProps {
  project: Project;
}

export default function WebProjectView({ project }: WebProjectViewProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Dynamic theme listener to guarantee exact dark mode preservation and smooth light mode adaptation
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      const isDark =
        theme === "dark" ||
        theme === "mytheme" ||
        !document.documentElement.classList.contains("light");
      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    return () => observer.disconnect();
  }, []);

  // Web Assets
  const liveUrl = project.liveProjectUrl || project.liveUrl;
  const githubUrl = project.githubUrl;
  const clientUrl = project.clientUrl;
  const serverUrl = project.serverUrl;

  // Single Main Thumbnail
  const mainThumbnailUrl =
    project.images && project.images.length > 0
      ? project.images[0]
      : project.screenshots && project.screenshots.length > 0
      ? project.screenshots[0]
      : "/Hero3DMe.png";

  const projectNumberStr = (
    project.projectNumber !== undefined && project.projectNumber !== null
      ? project.projectNumber
      : 1
  )
    .toString()
    .padStart(2, "0");

  return (
    <div className="min-h-screen selection:bg-brandAccent/30 selection:text-white pt-28 md:pt-32 pb-20 relative overflow-hidden transition-colors duration-300 bg-mainBg text-primaryText">
      {/* Ambient lighting glows */}
      <div className="absolute top-16 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-brandAccent/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-96 right-1/4 w-[500px] h-[500px] bg-secondaryAccent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10 space-y-12">
        {/* Top Meta Indicator Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono uppercase tracking-wider ${
                isDarkMode
                  ? "text-mutedText font-bold"
                  : "text-slate-800 font-extrabold"
              }`}
            >
              Project
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-brandAccent/15 border border-brandAccent/30 text-brandAccent font-mono font-black text-xs">
              #{projectNumberStr}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
                isDarkMode
                  ? "border-borderSubtle bg-surface text-primaryText"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-brandAccent" />
              <span>{project.category || "Web App"}</span>
            </span>
          </div>
        </div>

        {/* Hero Section: Left Headline & Details + Right Single Minimalist Thumbnail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title, Metadata, Tagline & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-brandAccent px-2.5 py-0.5 rounded-full bg-brandAccent/10 border border-brandAccent/20">
                {project.category || "Web Application"}
              </span>
              {project.isFeatured && (
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    isDarkMode
                      ? "text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20"
                      : "text-teal-800 bg-teal-50 border border-teal-300 shadow-xs"
                  }`}
                >
                  <Sparkles className="w-3 h-3" /> Featured Web Project
                </span>
              )}
              <span
                className={`text-xs font-mono ${
                  isDarkMode ? "text-mutedText" : "text-slate-600 font-semibold"
                }`}
              >
                v1.0 Production
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-primaryText">
                {project.title}
              </h1>
              {project.shortTagline && (
                <p
                  className={`text-base sm:text-lg font-normal leading-relaxed ${
                    isDarkMode ? "text-mutedText" : "text-slate-700 font-medium"
                  }`}
                >
                  {project.shortTagline}
                </p>
              )}
            </div>

            {/* Web Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-brandAccent hover:bg-secondaryAccent text-white font-extrabold text-sm shadow-lg shadow-brandAccent/25 hover:scale-105 active:scale-95 transition-all group/launch"
                >
                  <span>Launch Live Application</span>
                  <ExternalLink className="w-4 h-4 group-hover/launch:translate-x-0.5 group-hover/launch:-translate-y-0.5 transition-transform" />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-sm ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface hover:bg-mainBg text-primaryText"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-xs"
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                </a>
              )}

              {clientUrl && (
                <a
                  href={clientUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface/80 hover:bg-mainBg text-mutedText hover:text-primaryText"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-bold"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-brandAccent" />
                  <span>Frontend Repo</span>
                </a>
              )}

              {serverUrl && (
                <a
                  href={serverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface/80 hover:bg-mainBg text-mutedText hover:text-primaryText"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-bold"
                  }`}
                >
                  <Server
                    className={`w-3.5 h-3.5 ${
                      isDarkMode ? "text-[#2DD4BF]" : "text-teal-700"
                    }`}
                  />
                  <span>API Repo</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Single Minimalist Thumbnail */}
          <div className="lg:col-span-5">
            <div
              className={`relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl transition-all duration-300 group ${
                isDarkMode
                  ? "border-borderSubtle bg-surface shadow-black/40 hover:border-brandAccent/50"
                  : "border-slate-200 bg-white shadow-xl hover:border-slate-300"
              }`}
            >
              <Image
                src={mainThumbnailUrl}
                alt={`${project.title} Thumbnail`}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                priority
              />

              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs backdrop-blur-xs"
                >
                  <span className="px-4 py-2 rounded-full bg-black/70 border border-white/20 flex items-center gap-2 shadow-xl">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live Project</span>
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* System Architecture & Technology Stack Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-borderSubtle">
          <div className="p-6 rounded-3xl border border-borderSubtle bg-surface shadow-md space-y-4 md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-primaryText">
              <ShieldCheck
                className={`w-4 h-4 ${
                  isDarkMode ? "text-[#2DD4BF]" : "text-teal-700"
                }`}
              />
              <span>Project Specification</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-borderSubtle">
                <span
                  className={
                    isDarkMode ? "text-mutedText" : "text-slate-600 font-semibold"
                  }
                >
                  Type:
                </span>
                <span className="font-bold text-primaryText">
                  {project.category || "Full-Stack Web"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-borderSubtle">
                <span
                  className={
                    isDarkMode ? "text-mutedText" : "text-slate-600 font-semibold"
                  }
                >
                  Catalog #:
                </span>
                <span className="font-mono font-bold text-brandAccent">
                  #{projectNumberStr}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-borderSubtle">
                <span
                  className={
                    isDarkMode ? "text-mutedText" : "text-slate-600 font-semibold"
                  }
                >
                  Live Status:
                </span>
                <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online & Deployed</span>
                </span>
              </div>
              {liveUrl && (
                <div className="flex items-center justify-between">
                  <span
                    className={
                      isDarkMode ? "text-mutedText" : "text-slate-600 font-semibold"
                    }
                  >
                    Domain:
                  </span>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brandAccent hover:underline font-mono truncate max-w-[150px]"
                  >
                    {liveUrl.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-borderSubtle bg-surface shadow-md space-y-4 md:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-primaryText">
              <Layers className="w-4 h-4 text-brandAccent" />
              <span>Technology Stack & Tools</span>
            </h3>

            {project.tools && project.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {project.tools.map((tool) => {
                  const toolName = tool.title || "";
                  if (!toolName) return null;

                  const preset = POPULAR_TOOLS.find(
                    (p) => p.name.toLowerCase() === toolName.toLowerCase()
                  );
                  const IconComponent =
                    (tool.icon && TOOL_ICONS[tool.icon]) ||
                    (preset && TOOL_ICONS[preset.iconKey]);

                  return (
                    <span
                      key={tool._id || toolName}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-borderSubtle bg-mainBg text-primaryText hover:border-brandAccent/60 text-xs font-bold transition-colors shadow-xs"
                    >
                      {IconComponent && (
                        <IconComponent className="text-sm text-brandAccent" />
                      )}
                      <span>{toolName}</span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p
                className={`text-xs ${
                  isDarkMode ? "text-mutedText" : "text-slate-600"
                }`}
              >
                No explicit tool specifications recorded.
              </p>
            )}
          </div>
        </div>

        {/* Extended Case Study & About Section */}
        {(project.description || project.longDescription?.length) && (
          <div className="p-6 sm:p-10 rounded-3xl border border-borderSubtle bg-surface shadow-xl space-y-4">
            <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-primaryText">
              <span>About this Project</span>
            </h3>

            {project.description && (
              <p className="text-base sm:text-lg leading-relaxed text-primaryText/90">
                {project.description}
              </p>
            )}

            {project.longDescription && project.longDescription.length > 0 && (
              <div
                className={`space-y-4 pt-3 leading-relaxed text-sm sm:text-base border-t mt-4 border-borderSubtle ${
                  isDarkMode ? "text-mutedText" : "text-slate-700 font-medium"
                }`}
              >
                {project.longDescription.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Return CTA */}
        <div className="pt-6 border-t border-borderSubtle flex items-center justify-between">
          <Link
            href="/work"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors ${
              isDarkMode
                ? "text-mutedText hover:text-primaryText"
                : "text-slate-700 hover:text-slate-950"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore other projects in portfolio</span>
          </Link>
          <span
            className={`text-xs ${
              isDarkMode ? "text-mutedText font-medium" : "text-slate-600 font-semibold"
            }`}
          >
            Mohamed Aweis • Portfolio 3.0
          </span>
        </div>
      </div>
    </div>
  );
}
