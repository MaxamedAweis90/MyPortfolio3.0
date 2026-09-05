"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { RiMoonClearLine, RiSunLine } from "react-icons/ri";

const ROUTE_NAME_MAP: Record<string, string> = {
  work: "Projects",
  experience: "Experience",
  certificates: "Certificates",
  about: "About",
  services: "Services",
  blog: "Blog",
  gallery: "Gallery",
  contact: "Contact",
};

function formatSegmentTitle(segment: string): string {
  const lower = decodeURIComponent(segment).toLowerCase();
  if (ROUTE_NAME_MAP[lower]) {
    return ROUTE_NAME_MAP[lower];
  }

  return decodeURIComponent(segment)
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function BreadcrumbHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync dark/light theme dynamically with DOM
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

  const toggleTheme = () => {
    const nextTheme = !isDarkMode; // true = dark, false = light
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute(
        "data-theme-transition",
        nextTheme ? "to-dark" : "to-light"
      );
    }

    const applyTheme = () => {
      setIsDarkMode(nextTheme);
      if (nextTheme) {
        document.documentElement.setAttribute("data-theme", "mytheme");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
    };

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      const docWithTransition = document as Document & {
        startViewTransition: (callback: () => void) => { finished: Promise<void> };
      };
      const transition = docWithTransition.startViewTransition(() => {
        applyTheme();
      });
      transition.finished.finally(() => {
        document.documentElement.removeAttribute("data-theme-transition");
      });
    } else {
      applyTheme();
    }
  };

  // If on main screen, return null
  if (!pathname || pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      if (segments.length > 1) {
        router.push(`/${segments[0]}`);
      } else {
        router.push("/");
      }
    }
  };

  return (
    <nav className="fixed top-3 md:top-5 px-4 sm:px-6 w-full z-[99] transition-all duration-300 pointer-events-none">
      <div
        className={`container max-w-6xl mx-auto p-2 sm:p-2.5 px-4 sm:px-6 flex justify-between items-center rounded-2xl md:rounded-full transition-all duration-300 backdrop-blur-xl shadow-2xl border pointer-events-auto ${
          isDarkMode
            ? "bg-[#11161D]/80 border-[#2C394B]/80 text-[#E2E8F0] shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
            : "bg-white/80 border-slate-200/90 text-slate-900 shadow-xl"
        }`}
      >
        {/* Left Side: Back Button + Glass Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-x-auto no-scrollbar py-0.5">
          {/* Back Navigation Button */}
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer ${
              isDarkMode
                ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-[#E2E8F0]"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
            }`}
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Breadcrumb Trail */}
          <div aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
            {/* Root / Home */}
            <Link
              href="/"
              className={`flex items-center gap-1.5 transition-colors shrink-0 group ${
                isDarkMode ? "text-mutedText hover:text-white" : "text-slate-600 hover:text-slate-900 font-semibold"
              }`}
            >
              <Home className="w-3.5 h-3.5 group-hover:text-brandAccent transition-colors" />
              <span className="hidden xs:inline">Home</span>
            </Link>

            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;
              const href = "/" + segments.slice(0, index + 1).join("/");
              const title = formatSegmentTitle(segment);

              return (
                <React.Fragment key={href}>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isDarkMode ? "text-[#2C394B]" : "text-slate-500"
                    }`}
                  />
                  {isLast ? (
                    <span
                      className={`font-bold truncate max-w-[150px] sm:max-w-[260px] md:max-w-[380px] shrink-0 ${
                        isDarkMode ? "text-primaryText" : "text-slate-900"
                      }`}
                      title={title}
                    >
                      {title}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className={`transition-colors truncate max-w-[100px] sm:max-w-[180px] shrink-0 ${
                        isDarkMode ? "text-mutedText hover:text-primaryText" : "text-slate-600 hover:text-slate-900 font-medium"
                      }`}
                    >
                      {title}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Quick Section Navlinks for Experience Screen */}
          {pathname === "/experience" && (
            <div className="hidden md:flex items-center gap-1 pl-3 ml-2 border-l border-borderSubtle/60 text-xs shrink-0">
              <a
                href="#experience"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  isDarkMode
                    ? "text-mutedText hover:text-brandAccent hover:bg-white/5"
                    : "text-slate-600 hover:text-brandAccent hover:bg-slate-100"
                }`}
              >
                Experience
              </a>
              <a
                href="#education"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("education")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  isDarkMode
                    ? "text-mutedText hover:text-emerald-400 hover:bg-white/5"
                    : "text-slate-600 hover:text-emerald-600 hover:bg-slate-100"
                }`}
              >
                Education
              </a>
              <a
                href="#certificates"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("certificates")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  isDarkMode
                    ? "text-mutedText hover:text-purple-400 hover:bg-white/5"
                    : "text-slate-600 hover:text-purple-600 hover:bg-slate-100"
                }`}
              >
                Certificates
              </a>
            </div>
          )}
        </div>

        {/* Right Side: Theme Toggle & Logo */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer ${
              isDarkMode
                ? "bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-amber-400 hover:text-amber-300"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-brandAccent"
            }`}
            aria-label="Toggle dark/light theme"
          >
            {isDarkMode ? (
              <RiSunLine className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <RiMoonClearLine className="w-4 h-4 text-brandAccent hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Minimal Brand Logo shortcut to Home */}
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            title="Return to Mohamed Aweis Portfolio Home"
          >
            <Image
              src="/logoR2.png"
              alt="Mohamed Aweis Logo"
              width={45}
              height={18}
              className="h-5 sm:h-5.5 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
