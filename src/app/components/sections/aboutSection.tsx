"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCodeSSlashLine,
  RiDatabase2Line,
  RiSparklingLine,
  RiSendPlaneLine,
  RiFolderChartLine,
  RiRocketLine,
  RiLightbulbLine,
} from "react-icons/ri";
import { LinkPreview } from "@/components/ui/link-preview";

export default function AboutSection() {
  const [showProjectsBreakdown, setShowProjectsBreakdown] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const statBoxRef = useRef<HTMLDivElement>(null);

  // Close breakdown popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        statBoxRef.current &&
        !statBoxRef.current.contains(e.target as Node)
      ) {
        setIsPinned(false);
        setShowProjectsBreakdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = Math.max(0, elementPosition - navOffset);
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const isVisible = showProjectsBreakdown || isPinned;

  return (
    <section
      id="about"
      className="py-20 lg:py-28 px-4 sm:px-8 lg:px-16 bg-mainBg border-b border-borderSubtle relative overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brandAccent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Grid: Left = Bio Story & Highlights, Right = Photo with Offset Cyan Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Heading & Comprehensive Story (col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-4xl sm:text-6xl font-extrabold text-primaryText tracking-tight">
                About Me<span className="text-brandAccent">.</span>
              </h2>
            </div>

            {/* Paragraphs with Interactive Link Preview Popups on Hover */}
            <div className="space-y-4 text-mutedText text-sm sm:text-base lg:text-[16.5px] leading-relaxed">
              <p>
                I am{" "}
                <LinkPreview
                  url="https://github.com/MaxamedAweis90"
                  className="font-semibold text-primaryText hover:text-brandAccent"
                >
                  Mohamed Aweys
                </LinkPreview>
                , a Software Engineer focused on building modern web and mobile applications. I enjoy turning ideas into reliable, scalable, and user-friendly digital products that solve real-world problems.
              </p>

              <p>
                My primary technologies are{" "}
                <LinkPreview
                  url="https://react.dev"
                  className="font-semibold text-primaryText hover:text-cyan-400"
                >
                  React
                </LinkPreview>
                ,{" "}
                <LinkPreview
                  url="https://nextjs.org"
                  className="font-semibold text-primaryText hover:text-brandAccent"
                >
                  Next.js
                </LinkPreview>
                , and{" "}
                <LinkPreview
                  url="https://reactnative.dev"
                  className="font-semibold text-primaryText hover:text-sky-400"
                >
                  React Native
                </LinkPreview>
                . I write clean, maintainable code and focus on building practical applications while continuously expanding my knowledge of modern software development.
              </p>

              <p>
                I specialize in full-stack architectures using{" "}
                <LinkPreview
                  url="https://www.postgresql.org"
                  className="font-semibold text-primaryText hover:text-sky-400"
                >
                  PostgreSQL
                </LinkPreview>
                ,{" "}
                <LinkPreview
                  url="https://www.prisma.io"
                  className="font-semibold text-primaryText hover:text-teal-400"
                >
                  Prisma ORM
                </LinkPreview>
                , and{" "}
                <LinkPreview
                  url="https://nodejs.org"
                  className="font-semibold text-primaryText hover:text-emerald-400"
                >
                  Node.js
                </LinkPreview>
                , building secure, high-performance systems and RESTful APIs.
              </p>

              <p>
                Alongside development, I bring an{" "}
                <LinkPreview
                  url="https://openai.com"
                  className="font-semibold text-primaryText hover:text-amber-400"
                >
                  AI-driven engineering workflow
                </LinkPreview>{" "}
                supported by{" "}
                <LinkPreview
                  url="https://github.com/features/copilot"
                  className="font-semibold text-primaryText hover:text-purple-400"
                >
                  modern development toolchains
                </LinkPreview>
                —accelerating delivery, maintaining rigorous code quality, and building scalable, high-performance production applications.
              </p>

              <p>
                I am seeking opportunities to contribute to real-world products, collaborate with talented teams, and continue developing high-quality software that delivers value to users and businesses.
              </p>
            </div>

            {/* 3 Pillars / Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-surface border border-borderSubtle space-y-1 shadow-sm hover:border-brandAccent/50 transition-all">
                <div className="flex items-center gap-2 text-brandAccent font-bold text-sm">
                  <RiCodeSSlashLine className="text-lg" />
                  <span>Web & Mobile</span>
                </div>
                <p className="text-xs text-mutedText">
                  React, Next.js & React Native applications
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-borderSubtle space-y-1 shadow-sm hover:border-sky-400/50 transition-all">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <RiDatabase2Line className="text-lg" />
                  <span>PostgreSQL & Prisma</span>
                </div>
                <p className="text-xs text-mutedText">
                  Type-safe ORM & relational data modeling
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-borderSubtle space-y-1 shadow-sm hover:border-amber-400/50 transition-all">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <RiSparklingLine className="text-lg" />
                  <span>AI-Driven Workflow</span>
                </div>
                <p className="text-xs text-mutedText">
                  AI-accelerated velocity & modern tooling
                </p>
              </div>
            </div>

            {/* 3 Uniform Matching Pill Buttons with Snug Centered Callout HUD */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5 relative">
              {/* Button 1: Let's Connect */}
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-gradient-to-r from-brandAccent to-secondaryAccent text-white font-extrabold text-sm hover:shadow-lg hover:shadow-brandAccent/25 hover:scale-105 transition-all duration-300 shadow-md border border-brandAccent/40 cursor-pointer"
              >
                <span>Let&apos;s Connect</span>
                <RiSendPlaneLine className="text-base" />
              </button>

              {/* Button 2: Explore Skills */}
              <button
                onClick={() => scrollToSection("skills")}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-surface border border-borderSubtle text-primaryText font-extrabold text-sm hover:bg-borderSubtle hover:border-brandAccent transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer"
              >
                <span>Explore Skills & Tech</span>
              </button>

              {/* Button 3: Total Projects with Perfectly Centered & Snug Dual Callout HUD */}
              <div
                ref={statBoxRef}
                onMouseEnter={() => setShowProjectsBreakdown(true)}
                onMouseLeave={() => {
                  if (!isPinned) setShowProjectsBreakdown(false);
                }}
                className="relative inline-flex"
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsPinned((prev) => !prev);
                    setShowProjectsBreakdown((prev) => !prev);
                  }}
                  className={`inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-surface border font-extrabold text-sm transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer select-none group ${
                    isVisible
                      ? "border-brandAccent text-brandAccent shadow-brandAccent/15 bg-surface"
                      : "border-borderSubtle text-primaryText hover:border-brandAccent hover:text-brandAccent"
                  }`}
                >
                  <RiFolderChartLine className="text-base text-brandAccent group-hover:scale-110 transition-transform" />
                  <span>15+ Total Projects</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </button>

                {/* HUD Overlay: Left-anchored so it always aligns precisely with button */}
                <AnimatePresence>
                  {isVisible && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute bottom-[calc(100%+4px)] left-0 w-[320px] pointer-events-auto z-50 flex flex-col items-stretch"
                    >
                      {/* Top: 2 Callout Cards Side by Side */}
                      <div className="grid grid-cols-2 gap-2 w-full">
                        
                        {/* Box 1: Real & Client Projects */}
                        <div className="p-3 rounded-2xl bg-surface/98 backdrop-blur-2xl border border-emerald-500/50 shadow-[0_15px_35px_rgba(0,0,0,0.9)] text-left hover:border-emerald-400 transition-all">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs">
                              <RiRocketLine />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                              Real & Client
                            </span>
                          </div>
                          <p className="text-lg font-black text-primaryText tracking-tight">
                            9+ <span className="text-xs font-semibold text-mutedText">Projects</span>
                          </p>
                          <p className="text-[10px] text-mutedText leading-tight mt-0.5">
                            Production apps, APIs & CMS
                          </p>
                        </div>

                        {/* Box 2: Hobby & Lab Projects */}
                        <div className="p-3 rounded-2xl bg-surface/98 backdrop-blur-2xl border border-cyan-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.9)] text-left hover:border-cyan-300 transition-all">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs">
                              <RiLightbulbLine />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                              Hobby & Labs
                            </span>
                          </div>
                          <p className="text-lg font-black text-primaryText tracking-tight">
                            6+ <span className="text-xs font-semibold text-mutedText">Projects</span>
                          </p>
                          <p className="text-[10px] text-mutedText leading-tight mt-0.5">
                            Open-source & AI prototypes
                          </p>
                        </div>

                      </div>

                      {/*
                        SVG connector lines:
                        - Total width: 320px (matches parent w-[320px])
                        - Left box center: x = 80 (half of 160px left col)
                        - Right box center: x = 240 (160 + half of 160px right col)
                        - Button's top-center relative to left-0 anchor:
                          button is ~160px wide, starting at left:0 of this div,
                          so button center ≈ x=80 (half of button width ~160px)
                      */}
                      <div className="w-full h-7 overflow-visible pointer-events-none -mt-0.5">
                        <svg
                          viewBox="0 0 320 28"
                          className="w-full h-full overflow-visible"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Left Line: Left box center (80,0) → button top-center (80,24) */}
                          <path
                            d="M 80 0 L 80 24"
                            stroke="#10b981"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{ filter: "drop-shadow(0 0 5px rgba(16,185,129,0.8))" }}
                          />
                          <circle cx="80" cy="0" r="2.5" fill="#10b981" style={{ filter: "drop-shadow(0 0 4px #10b981)" }} />

                          {/* Right Line: Right box center (240,0) → button top-center (80,24) */}
                          <path
                            d="M 240 0 L 240 10 L 80 24"
                            stroke="#06b6d4"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{ filter: "drop-shadow(0 0 5px rgba(6,182,212,0.8))" }}
                          />
                          {/* Right Box Target Node Dot — aligned to path start */}
                          <circle cx="240" cy="0" r="2.5" fill="#06b6d4" style={{ filter: "drop-shadow(0 0 4px #06b6d4)" }} />

                          {/* Central convergence node at button top-center */}
                          <circle
                            cx="80"
                            cy="24"
                            r="3.5"
                            fill="#0B82EC"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            style={{ filter: "drop-shadow(0 0 8px #0B82EC)" }}
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Styled Profile Image Frame (col-span-5) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-5 flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[420px] group">
              {/* Cyan / Accent Offset Outline Rectangle Frame */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-full h-full border-2 border-brandAccent sm:border-[#38bdf8] rounded-3xl pointer-events-none transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />

              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden bg-surface border border-borderSubtle shadow-2xl z-10 aspect-[4/5] w-full">
                <Image
                  src="/aboutimage.jpg"
                  alt="Mohamed Aweys"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                  loading="lazy"
                  className="object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
