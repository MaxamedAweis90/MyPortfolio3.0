"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Github,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  X,
  Maximize2,
  Smartphone,
  Info,
  CheckCircle2,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import type { Project } from "@/types/portfolio";
import { TOOL_ICONS } from "@/components/toolIcons";
import { POPULAR_TOOLS } from "@/app/ugaas/projects/components/ToolIconHelper";
import AutoDownload from "./AutoDownload";

interface MobileProjectViewProps {
  project: Project;
  shouldAutoDownload?: boolean;
}

export default function MobileProjectView({
  project,
  shouldAutoDownload = false,
}: MobileProjectViewProps) {
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

  // Mobile Assets
  const appIconUrl =
    project.appIconUrl || project.images?.[0] || "/Hero3DMe.png";
  const apkUrl = project.apkUrl;
  const playStoreUrl = project.playStoreUrl;
  const appStoreUrl = project.appStoreUrl;
  const githubUrl = project.githubUrl;
  const liveUrl = project.liveUrl || project.liveProjectUrl;

  // Gallery Screens (Portrait)
  const screens = (
    project.screenshots && project.screenshots.length > 0
      ? project.screenshots
      : project.images && project.images.length > 0
        ? project.images
        : [appIconUrl]
  ).filter(Boolean);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : screens.length - 1) : 0,
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev < screens.length - 1 ? prev + 1 : 0) : 0,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, screens.length]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const projectNumberStr = (
    project.projectNumber !== undefined && project.projectNumber !== null
      ? project.projectNumber
      : 1
  )
    .toString()
    .padStart(2, "0");

  const hasAnyLink = Boolean(
    playStoreUrl || appStoreUrl || apkUrl || githubUrl || liveUrl,
  );

  return (
    <div className="min-h-screen selection:bg-[#00875A]/30 selection:text-white pt-28 md:pt-32 pb-20 relative overflow-hidden transition-colors duration-300 bg-mainBg text-primaryText">
      {/* Ambient lighting glows */}
      <div className="absolute top-16 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[#00875A]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-96 right-1/4 w-[500px] h-[500px] bg-brandAccent/10 rounded-full blur-[140px] pointer-events-none" />

      <AutoDownload shouldDownload={shouldAutoDownload} apkUrl={apkUrl} />

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10 relative z-10">
        {/* Top Meta Indicator Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-borderSubtle">
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
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                isDarkMode
                  ? "bg-[#00875A]/20 border border-[#00875A]/40 text-[#00E676]"
                  : "bg-emerald-100/90 border border-emerald-300 text-[#007A50]"
              }`}
            >
              #{projectNumberStr}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 shadow-xs ${
                isDarkMode
                  ? "border-borderSubtle bg-surface text-primaryText"
                  : "border-slate-300 bg-white text-slate-800 font-semibold"
              }`}
            >
              <Smartphone
                className={`w-3.5 h-3.5 ${
                  isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                }`}
              />
              <span>{project.category || "Mobile App"}</span>
            </span>
          </div>
        </div>

        {/* Play Store App Header Hero Card */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-7">
            {/* App Icon */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[22%] overflow-hidden border border-borderSubtle bg-surface shadow-2xl shrink-0">
              <Image
                src={appIconUrl}
                alt={`${project.title} Icon`}
                fill
                sizes="(max-width: 640px) 96px, 128px"
                className="object-cover"
                priority
              />
            </div>

            {/* App Title, Publisher & Metadata */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-primaryText">
                  {project.title}
                </h1>
                <div
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                  }`}
                >
                  <span>Mohamed Aweis</span>
                  <ShieldCheck className="w-4 h-4" />
                  <span
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-mutedText" : "text-slate-700"
                    }`}
                  >
                    • Verified Publisher
                  </span>
                </div>
              </div>

              {project.shortTagline && (
                <p
                  className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                    isDarkMode ? "text-mutedText" : "text-slate-800 font-medium"
                  }`}
                >
                  {project.shortTagline}
                </p>
              )}

              <div
                className={`flex items-center gap-2 pt-1 flex-wrap text-xs ${
                  isDarkMode
                    ? "text-mutedText font-medium"
                    : "text-slate-700 font-semibold"
                }`}
              >
                <span
                  className={`px-2 py-0.5 rounded border font-semibold ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface text-mutedText"
                      : "border-slate-300 bg-white text-slate-800 shadow-xs"
                  }`}
                >
                  {project.category || "Productivity"}
                </span>
                <span>•</span>
                <span>Contains ads</span>
                <span>•</span>
                <span>In-app purchases</span>
              </div>
            </div>
          </div>

          {/* Google Play Store Signature 4-Metric Ribbon */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border border-borderSubtle divide-borderSubtle rounded-2xl p-4 shadow-lg bg-surface transition-colors">
          
            <div className="px-4 py-2 sm:py-0 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1 font-bold text-base text-primaryText">
                <span>4.9</span>
                <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
              </div>
              <span
                className={`text-[11px] mt-0.5 ${
                  isDarkMode
                    ? "text-mutedText font-medium"
                    : "text-slate-700 font-bold"
                }`}
              >
                1.2K reviews
              </span>
            </div>

    
            <div className="px-4 py-2 sm:py-0 flex flex-col items-center justify-center text-center">
              <span className="font-bold text-base text-primaryText">10K+</span>
              <span
                className={`text-[11px] mt-0.5 ${
                  isDarkMode
                    ? "text-mutedText font-medium"
                    : "text-slate-700 font-bold"
                }`}
              >
                Downloads
              </span>
            </div>

           
            <div className="px-4 py-2 sm:py-0 flex flex-col items-center justify-center text-center">
              <div
                className={`w-5 h-5 rounded-sm flex items-center justify-center font-bold text-[10px] border ${
                  isDarkMode
                    ? "border-borderSubtle bg-mainBg text-primaryText"
                    : "border-slate-400 bg-slate-100 text-slate-900 font-black"
                }`}
              >
                3+
              </div>
              <span
                className={`text-[11px] mt-0.5 ${
                  isDarkMode
                    ? "text-mutedText font-medium"
                    : "text-slate-700 font-bold"
                }`}
              >
                Rated for 3+
              </span>
            </div>

 
            <div className="px-4 py-2 sm:py-0 flex flex-col items-center justify-center text-center">
              <span className="font-bold text-base flex items-center gap-1 text-primaryText">
                <Smartphone
                  className={`w-3.5 h-3.5 ${
                    isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                  }`}
                />
                <span>Mobile</span>
              </span>
              <span
                className={`text-[11px] mt-0.5 ${
                  isDarkMode
                    ? "text-mutedText font-medium"
                    : "text-slate-700 font-bold"
                }`}
              >
                iOS & Android
              </span>
            </div>
          </div> */}

          {/* Play Store Action CTAs */}
          {hasAnyLink ? (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {playStoreUrl && (
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#00875A] hover:bg-[#00A16B] text-white font-semibold text-sm transition-all shadow-lg shadow-[#00875A]/25 hover:scale-[1.02] active:scale-95"
                >
                  <FaGooglePlay className="text-base" />
                  <span>Install on Google Play</span>
                </a>
              )}

              {appStoreUrl && (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-surface hover:bg-mainBg text-primaryText font-semibold text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-95 border border-borderSubtle"
                >
                  <FaApple className="text-lg" />
                  <span>Download on App Store</span>
                </a>
              )}

              {apkUrl && (
                <a
                  href={apkUrl}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all border shadow-sm ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface hover:bg-mainBg text-primaryText hover:border-[#00E676]/40"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-900 hover:border-[#00875A]"
                  }`}
                >
                  <Download
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                    }`}
                  />
                  <span>Download .APK</span>
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all border shadow-sm ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface hover:bg-mainBg text-mutedText hover:text-primaryText"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}

              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all border shadow-sm ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface hover:bg-mainBg text-mutedText hover:text-primaryText"
                      : "border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  }`}
                >
                  <ExternalLink
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                    }`}
                  />
                  <span>Interactive Demo</span>
                </a>
              )}
            </div>
          ) : (
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs max-w-fit shadow-xs ${
                isDarkMode
                  ? "border-borderSubtle bg-surface text-mutedText"
                  : "border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold"
              }`}
            >
              <Info
                className={`w-4 h-4 shrink-0 ${
                  isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                }`}
              />
              <span>
                Portfolio Case Study • Production build previewed in screenshots
                below
              </span>
            </div>
          )}
        </div>

        {/* Play Store Clean Phone Screenshots Reel */}
        <div className="space-y-4 pt-4 border-t border-borderSubtle">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-primaryText">
                <span>Phone Screenshots</span>
              </h2>
              <p
                className={`text-xs mt-0.5 ${
                  isDarkMode
                    ? "text-mutedText font-medium"
                    : "text-slate-700 font-semibold"
                }`}
              >
                Swipe or scroll to preview app views • Click any screen to zoom
              </p>
            </div>

            {screens.length > 2 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface hover:bg-mainBg text-primaryText"
                      : "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
                  }`}
                  aria-label="Scroll screenshots left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    isDarkMode
                      ? "border-borderSubtle bg-surface hover:bg-mainBg text-primaryText"
                      : "border-slate-300 bg-white hover:bg-slate-100 text-slate-800"
                  }`}
                  aria-label="Scroll screenshots right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "thin" }}
          >
            {screens.map((shotUrl, idx) => (
              <div
                key={`${shotUrl}-${idx}`}
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setLightboxIndex(idx);
                  }
                }}
                className={`group relative w-[210px] sm:w-[250px] md:w-[270px] aspect-[9/19] shrink-0 rounded-2xl overflow-hidden border shadow-xl transition-all duration-300 cursor-pointer snap-start hover:-translate-y-1 select-none ${
                  isDarkMode
                    ? "border-borderSubtle bg-surface hover:border-[#00E676]/50"
                    : "border-slate-200 bg-white hover:border-[#00875A]/50 shadow-md"
                }`}
              >
                <Image
                  src={shotUrl}
                  alt={`${project.title} Screenshot ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 210px, 270px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white shadow-lg backdrop-blur-sm">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute top-2.5 left-2.5 pointer-events-none">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border shadow-xs transition-colors ${
                      isDarkMode
                        ? "bg-black/60 border-white/10 text-white"
                        : "bg-white/95 border-slate-200 text-slate-800 shadow-sm"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* "About this app" Section */}
        <div className="space-y-4 pt-4 border-t border-borderSubtle">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-primaryText">
              <span>About this app</span>
              <ChevronRight
                className={`w-4 h-4 ${
                  isDarkMode ? "text-mutedText" : "text-slate-700"
                }`}
              />
            </h2>

            {project.description && (
              <p
                className={`text-sm sm:text-base leading-relaxed max-w-3xl ${
                  isDarkMode
                    ? "text-primaryText/90"
                    : "text-slate-800 font-normal"
                }`}
              >
                {project.description}
              </p>
            )}

            {project.longDescription && project.longDescription.length > 0 && (
              <div
                className={`space-y-3 text-sm leading-relaxed max-w-3xl pt-2 ${
                  isDarkMode ? "text-mutedText" : "text-slate-700 font-medium"
                }`}
              >
                {project.longDescription.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          {/* Tools & Frameworks Chips */}
          {project.tools && project.tools.length > 0 && (
            <div className="space-y-2 pt-4">
              <span
                className={`text-xs font-bold uppercase tracking-wider block ${
                  isDarkMode
                    ? "text-mutedText"
                    : "text-slate-800 font-extrabold"
                }`}
              >
                Technologies & Architecture
              </span>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => {
                  const toolName = tool.title || "";
                  if (!toolName) return null;

                  const preset = POPULAR_TOOLS.find(
                    (p) => p.name.toLowerCase() === toolName.toLowerCase(),
                  );
                  const IconComponent =
                    (tool.icon && TOOL_ICONS[tool.icon]) ||
                    (preset && TOOL_ICONS[preset.iconKey]);

                  return (
                    <span
                      key={tool._id || toolName}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-xs ${
                        isDarkMode
                          ? "border-borderSubtle bg-mainBg text-primaryText"
                          : "border-slate-300 bg-white text-slate-800 font-semibold"
                      }`}
                    >
                      {IconComponent && (
                        <IconComponent
                          className={`text-xs ${
                            isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                          }`}
                        />
                      )}
                      <span>{toolName}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* App Info / Technical Specifications Table */}
        <div className="pt-4 border-t border-borderSubtle space-y-4">
          <h2 className="text-lg font-bold text-primaryText">
            App Info & Compatibility
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                label: "Version",
                value: "1.0.0 (Production)",
              },
              {
                label: "Compatibility",
                value: "Android 8.0+ / iOS 15+",
                icon: true,
              },
              {
                label: "Interactive Screens",
                value: `${screens.length} Captured Views`,
              },
              {
                label: "Developer",
                value: "Mohamed Aweis",
              },
              {
                label: "Content Rating",
                value: "Everyone (All Ages)",
              },
              {
                label: "Category",
                value: project.category || "Mobile",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border space-y-1 shadow-xs ${
                  isDarkMode
                    ? "border-borderSubtle bg-surface"
                    : "border-slate-200 bg-white"
                }`}
              >
                <span
                  className={`text-xs block ${
                    isDarkMode
                      ? "text-mutedText font-medium"
                      : "text-slate-600 font-semibold"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`text-sm font-bold flex items-center gap-1.5 ${
                    isDarkMode ? "text-primaryText" : "text-slate-900"
                  }`}
                >
                  {item.icon && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        isDarkMode ? "text-[#00E676]" : "text-[#00875A]"
                      }`}
                    />
                  )}
                  <span>{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

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
              isDarkMode
                ? "text-mutedText font-medium"
                : "text-slate-600 font-semibold"
            }`}
          >
            Mohamed Aweis • Portfolio 3.0
          </span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-colors cursor-pointer"
            aria-label="Close screenshot modal"
          >
            <X className="w-5 h-5" />
          </button>

          {screens.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null
                      ? prev > 0
                        ? prev - 1
                        : screens.length - 1
                      : 0,
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-colors cursor-pointer"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null
                      ? prev < screens.length - 1
                        ? prev + 1
                        : 0
                      : 0,
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 transition-colors cursor-pointer"
                aria-label="Next screenshot"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative max-h-[88vh] aspect-[9/19] w-auto max-w-[90vw] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screens[lightboxIndex]}
              alt={`${project.title} Screenshot Zoom`}
              fill
              className="object-contain"
              sizes="(max-height: 88vh) 88vh, 100vw"
              priority
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-mono border border-white/10">
              Screen {lightboxIndex + 1} of {screens.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
