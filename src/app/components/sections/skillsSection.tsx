"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiVite,
  SiNextdotjs,
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiFlutter,
  SiFigma,
  SiGithub,
  SiVercel,
  SiFirebase,
  SiSupabase,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiPostgresql,
  SiPrisma,
  SiOpenai,
  SiPython,
} from "react-icons/si";
import {
  FaLayerGroup,
  FaDatabase,
  FaPeopleCarry,
  FaRegClock,
  FaBolt,
  FaHandshake,
  FaBookOpen,
} from "react-icons/fa";
import {
  RiSparklingLine,
  RiArrowDownSLine,
  RiCheckDoubleLine,
  RiCloseLine,
  RiGlobalLine,
} from "react-icons/ri";

export default function SkillsSection() {
  // State for active clicked box (open strictly on click)
  const [activeBox, setActiveBox] = useState<string | null>(null);
  const leftStackRef = useRef<HTMLDivElement>(null);

  // Close active box on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        leftStackRef.current &&
        !leftStackRef.current.contains(e.target as Node)
      ) {
        setActiveBox(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleBoxClick = (id: string) => {
    setActiveBox((prev) => (prev === id ? null : id));
  };

  const isBoxOpen = (id: string) => activeBox === id;

  // Row 1 Tools for Infinite Marquee
  const row1Badges = [
    { name: "Next.js", role: "FULLSTACK REACT", icon: SiNextdotjs, color: "text-primaryText" },
    { name: "React", role: "UI LIBRARY", icon: SiReact, color: "text-cyan-400" },
    { name: "React Native", role: "MOBILE APPS", icon: SiReact, color: "text-sky-400" },
    { name: "TypeScript", role: "TYPE SAFETY", icon: SiTypescript, color: "text-blue-400" },
    { name: "PostgreSQL", role: "RELATIONAL DB", icon: SiPostgresql, color: "text-sky-300" },
    { name: "Prisma", role: "TYPE-SAFE ORM", icon: SiPrisma, color: "text-teal-400" },
    { name: "AI-Driven Dev", role: "LLMS & WORKFLOWS", icon: RiSparklingLine, color: "text-amber-300" },
    { name: "Tailwind CSS", role: "UTILITY STYLING", icon: SiTailwindcss, color: "text-cyan-400" },
    { name: "Node.js", role: "RUNTIME & APIS", icon: SiNodedotjs, color: "text-emerald-500" },
    { name: "Figma", role: "UI/UX DESIGN", icon: SiFigma, color: "text-pink-500" },
    { name: "Vite", role: "BUILD TOOL", icon: SiVite, color: "text-purple-400" },
  ];

  // Row 2 Tools for Infinite Marquee
  const row2Badges = [
    { name: "OpenAI / LLMs", role: "AI ENGINEERING", icon: SiOpenai, color: "text-emerald-400" },
    { name: "Supabase", role: "CLOUD DATABASE", icon: SiSupabase, color: "text-emerald-400" },
    { name: "Express.js", role: "RESTFUL APIS", icon: SiExpress, color: "text-mutedText" },
    { name: "MongoDB", role: "NOSQL DATABASE", icon: SiMongodb, color: "text-green-500" },
    { name: "Git & GitHub", role: "VERSION CONTROL", icon: SiGithub, color: "text-red-400" },
    { name: "Firebase", role: "BACKEND & AUTH", icon: SiFirebase, color: "text-amber-400" },
    { name: "Vercel", role: "EDGE DEPLOYMENT", icon: SiVercel, color: "text-primaryText" },
    { name: "JavaScript", role: "CORE LANGUAGE", icon: SiJavascript, color: "text-amber-400" },
    { name: "HTML5 / CSS3", role: "MODERN LAYOUTS", icon: SiHtml5, color: "text-orange-500" },
    { name: "Flutter", role: "CROSS-PLATFORM", icon: SiFlutter, color: "text-sky-400" },
    { name: "Python", role: "DATA & SCRIPTING", icon: SiPython, color: "text-yellow-400" },
  ];

  // Languages for Infinite Carousel
  const languagesList = [
    {
      name: "Somali",
      proficiency: "Native",
      flag: "https://flagcdn.com/w160/so.png",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      name: "English",
      proficiency: "Advanced",
      flag: "https://flagcdn.com/w160/gb.png",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    },
    {
      name: "Arabic",
      proficiency: "Fluent",
      flag: "https://flagcdn.com/w160/sa.png",
      badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
    },
    {
      name: "German",
      proficiency: "Basic",
      flag: "https://flagcdn.com/w160/de.png",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
  ];

  // Duplicate arrays for seamless infinite continuous looping
  const infiniteRow1 = [...row1Badges, ...row1Badges, ...row1Badges, ...row1Badges];
  const infiniteRow2 = [...row2Badges, ...row2Badges, ...row2Badges, ...row2Badges];
  const infiniteLanguages = [
    ...languagesList,
    ...languagesList,
    ...languagesList,
    ...languagesList,
  ];

  return (
    <section
      id="skills"
      className="py-20 lg:py-28 bg-mainBg border-b border-borderSubtle relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-secondaryAccent/5 rounded-full blur-[170px] pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-borderSubtle/60 pb-6"
        >
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brandAccent">
              Technical Expertise & Soft Skills
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-primaryText tracking-tight">
              TECHNOLOGIES I WORK WITH
            </h2>
          </div>
          <p className="text-mutedText text-sm sm:text-base max-w-md">
            Production-tested libraries, frameworks, database architectures, and engineering principles I use to craft fast, responsive, and robust digital products.
          </p>
        </motion.div>
      </div>

      {/* Full-Screen Edge-to-Edge Infinite Looping Marquee */}
      <div className="w-full relative overflow-hidden py-4 my-6">
        {/* Left & Right Gradient Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-mainBg via-mainBg/90 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-mainBg via-mainBg/90 to-transparent z-20" />

        <div className="space-y-4">
          {/* Marquee Row 1 (Glides Left) */}
          <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {infiniteRow1.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={`row1-${tech.name}-${idx}`}
                  className="mx-2.5 sm:mx-3 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-borderSubtle hover:border-brandAccent/60 hover:bg-surface transition-all duration-300 shadow-md hover:scale-105 group whitespace-nowrap"
                >
                  <Icon className={`text-2xl ${tech.color} group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-left">
                    <p className="text-sm sm:text-base font-bold text-primaryText leading-none">
                      {tech.name}
                    </p>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-mutedText tracking-wider uppercase">
                      {tech.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Marquee Row 2 (Glides Right) */}
          <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
            {infiniteRow2.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={`row2-${tech.name}-${idx}`}
                  className="mx-2.5 sm:mx-3 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-borderSubtle hover:border-brandAccent/60 hover:bg-surface transition-all duration-300 shadow-md hover:scale-105 group whitespace-nowrap"
                >
                  <Icon className={`text-2xl ${tech.color} group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-left">
                    <p className="text-sm sm:text-base font-bold text-primaryText leading-none">
                      {tech.name}
                    </p>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-mutedText tracking-wider uppercase">
                      {tech.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Architecture & Soft Skills Split Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: 3 Stacked Technical Boxes (Opens Strictly on Click) + Language Carousel Below */}
          <div ref={leftStackRef} className="lg:col-span-7 flex flex-col justify-between h-full space-y-4 relative">
            
            {/* Box 1: Frontend & Mobile */}
            <div
              className={`relative rounded-3xl transition-all duration-300 ${
                isBoxOpen("frontend") ? "z-40" : "z-10"
              }`}
            >
              {/* Trigger Base Card */}
              <div
                onClick={() => handleBoxClick("frontend")}
                className={`w-full p-5 sm:p-6 rounded-3xl bg-surface/90 backdrop-blur-md border flex items-center justify-between cursor-pointer transition-all duration-300 shadow-lg select-none group ${
                  isBoxOpen("frontend")
                    ? "border-brandAccent shadow-brandAccent/10 bg-surface"
                    : "border-borderSubtle hover:border-brandAccent/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="p-3 rounded-2xl bg-brandAccent/10 text-brandAccent border border-brandAccent/20 text-xl shadow-inner group-hover:scale-110 transition-transform">
                    <FaLayerGroup />
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-primaryText group-hover:text-brandAccent transition-colors">
                      Frontend & Mobile
                    </h3>
                    <p className="text-xs text-mutedText hidden sm:block">
                      Modular UI systems, React, Next.js & React Native
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-mutedText tracking-widest bg-mainBg px-2.5 py-1 rounded-lg border border-borderSubtle">
                    01 / CORE
                  </span>
                  <RiArrowDownSLine
                    className={`text-2xl text-mutedText transition-transform duration-300 ${
                      isBoxOpen("frontend") ? "rotate-180 text-brandAccent" : "group-hover:text-primaryText"
                    }`}
                  />
                </div>
              </div>

              {/* Floating Foreground Overlay Dropdown */}
              <AnimatePresence>
                {isBoxOpen("frontend") && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-surface/98 backdrop-blur-2xl border border-brandAccent/60 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3">
                      <span className="text-xs font-bold text-brandAccent uppercase tracking-wider">
                        Architecture & Ecosystem
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBox(null);
                        }}
                        aria-label="Close details"
                        className="text-mutedText hover:text-primaryText p-1 rounded-lg hover:bg-mainBg transition-colors"
                      >
                        <RiCloseLine className="text-lg" />
                      </button>
                    </div>

                    <p className="text-sm text-mutedText leading-relaxed">
                      Building modular component architectures with React, Next.js, and React Native with TypeScript & Tailwind CSS for scalable design systems and modern responsive layouts.
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiReact className="text-cyan-400" /> React
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiNextdotjs className="text-primaryText" /> Next.js
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiReact className="text-sky-400" /> React Native
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiTypescript className="text-blue-400" /> TypeScript
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiTailwindcss className="text-sky-400" /> Tailwind
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Box 2: Database & Backend */}
            <div
              className={`relative rounded-3xl transition-all duration-300 ${
                isBoxOpen("backend") ? "z-40" : "z-10"
              }`}
            >
              {/* Trigger Base Card */}
              <div
                onClick={() => handleBoxClick("backend")}
                className={`w-full p-5 sm:p-6 rounded-3xl bg-surface/90 backdrop-blur-md border flex items-center justify-between cursor-pointer transition-all duration-300 shadow-lg select-none group ${
                  isBoxOpen("backend")
                    ? "border-sky-400 shadow-sky-400/10 bg-surface"
                    : "border-borderSubtle hover:border-sky-400/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xl shadow-inner group-hover:scale-110 transition-transform">
                    <FaDatabase />
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-primaryText group-hover:text-sky-400 transition-colors">
                      Database & Backend
                    </h3>
                    <p className="text-xs text-mutedText hidden sm:block">
                      PostgreSQL, Prisma ORM, Node.js & RESTful APIs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-mutedText tracking-widest bg-mainBg px-2.5 py-1 rounded-lg border border-borderSubtle">
                    02 / DATA
                  </span>
                  <RiArrowDownSLine
                    className={`text-2xl text-mutedText transition-transform duration-300 ${
                      isBoxOpen("backend") ? "rotate-180 text-sky-400" : "group-hover:text-primaryText"
                    }`}
                  />
                </div>
              </div>

              {/* Floating Foreground Overlay Dropdown */}
              <AnimatePresence>
                {isBoxOpen("backend") && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-surface/98 backdrop-blur-2xl border border-sky-400/60 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3">
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                        Data & Cloud Infrastructure
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBox(null);
                        }}
                        aria-label="Close details"
                        className="text-mutedText hover:text-primaryText p-1 rounded-lg hover:bg-mainBg transition-colors"
                      >
                        <RiCloseLine className="text-lg" />
                      </button>
                    </div>

                    <p className="text-sm text-mutedText leading-relaxed">
                      Architecting relational and document databases with PostgreSQL and Prisma ORM, backed by Node.js, Express, and Supabase cloud infrastructure for secure high-concurrency systems.
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiPostgresql className="text-sky-300" /> PostgreSQL
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiPrisma className="text-teal-400" /> Prisma ORM
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiNodedotjs className="text-emerald-500" /> Node.js
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiMongodb className="text-green-500" /> MongoDB
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiSupabase className="text-emerald-400" /> Supabase
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Box 3: AI-Driven Workflow */}
            <div
              className={`relative rounded-3xl transition-all duration-300 ${
                isBoxOpen("ai") ? "z-40" : "z-10"
              }`}
            >
              {/* Trigger Base Card */}
              <div
                onClick={() => handleBoxClick("ai")}
                className={`w-full p-5 sm:p-6 rounded-3xl bg-surface/90 backdrop-blur-md border flex items-center justify-between cursor-pointer transition-all duration-300 shadow-lg select-none group ${
                  isBoxOpen("ai")
                    ? "border-amber-400 shadow-amber-400/10 bg-surface"
                    : "border-borderSubtle hover:border-amber-400/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xl shadow-inner group-hover:scale-110 transition-transform">
                    <RiSparklingLine />
                  </span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-primaryText group-hover:text-amber-400 transition-colors">
                      AI-Driven Workflow
                    </h3>
                    <p className="text-xs text-mutedText hidden sm:block">
                      AI-accelerated velocity, LLMs & modern dev toolchains
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-mutedText tracking-widest bg-mainBg px-2.5 py-1 rounded-lg border border-borderSubtle">
                    03 / VELOCITY
                  </span>
                  <RiArrowDownSLine
                    className={`text-2xl text-mutedText transition-transform duration-300 ${
                      isBoxOpen("ai") ? "rotate-180 text-amber-400" : "group-hover:text-primaryText"
                    }`}
                  />
                </div>
              </div>

              {/* Floating Foreground Overlay Dropdown */}
              <AnimatePresence>
                {isBoxOpen("ai") && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[calc(100%+8px)] left-0 right-0 bg-surface/98 backdrop-blur-2xl border border-amber-400/60 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        AI Acceleration & Tooling
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveBox(null);
                        }}
                        aria-label="Close details"
                        className="text-mutedText hover:text-primaryText p-1 rounded-lg hover:bg-mainBg transition-colors"
                      >
                        <RiCloseLine className="text-lg" />
                      </button>
                    </div>

                    <p className="text-sm text-mutedText leading-relaxed">
                      Leveraging AI-assisted engineering tools and LLM integrations to accelerate development velocity, maintain code quality, and translate Figma designs efficiently into production.
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiOpenai className="text-emerald-400" /> OpenAI / LLMs
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiGithub className="text-mutedText" /> Git & GitHub
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiVite className="text-purple-400" /> Vite
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiFigma className="text-pink-500" /> Figma
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mainBg text-primaryText text-xs font-semibold border border-borderSubtle shadow-sm">
                        <SiVercel className="text-primaryText" /> Vercel
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Box 4: Language Infinite Carousel (Fills the space & balances the right column) */}
            <div className="mt-auto pt-2">
              <div className="bg-surface/90 backdrop-blur-md border border-borderSubtle hover:border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl transition-all duration-300 relative overflow-hidden group">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-lg shadow-inner group-hover:scale-110 transition-transform">
                      <RiGlobalLine />
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-primaryText">
                        Languages I Speak
                      </h3>
                      <p className="text-xs text-mutedText">
                        Multilingual communication
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-mutedText tracking-widest bg-mainBg px-2.5 py-1 rounded-lg border border-borderSubtle">
                    05 / GLOBAL
                  </span>
                </div>

                {/* Infinite Looping Language Stream */}
                <div className="relative overflow-hidden py-1">
                  {/* Left & Right Gradient Masks */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-surface to-transparent z-10" />
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-surface to-transparent z-10" />

                  <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing">
                    {infiniteLanguages.map((lang, idx) => (
                      <div
                        key={`lang-${lang.name}-${idx}`}
                        className="mx-2 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-mainBg/90 border border-borderSubtle/80 hover:border-emerald-400/50 transition-all duration-300 shadow-sm hover:scale-105 group/item whitespace-nowrap"
                      >
                        <Image
                          src={lang.flag}
                          alt={lang.name}
                          width={28}
                          height={28}
                          unoptimized
                          className="w-7 h-7 object-cover rounded-full border border-borderSubtle shadow-sm"
                        />
                        <div className="text-left">
                          <p className="text-xs sm:text-sm font-extrabold text-primaryText leading-tight">
                            {lang.name}
                          </p>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block mt-0.5 ${lang.badgeColor}`}
                          >
                            {lang.proficiency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtitle / Footer indicator */}
                <div className="flex items-center justify-between text-[11px] text-mutedText pt-1 border-t border-borderSubtle/50">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <RiCheckDoubleLine className="text-sm" /> 4 Languages
                  </span>
                  <span>Cross-Border & Remote Ready</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Soft Skills & Engineering Mindset Box */}
          <div className="lg:col-span-5 h-full flex flex-col">
            <div className="bg-surface/90 backdrop-blur-md border border-borderSubtle hover:border-brandAccent/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-all duration-300 relative overflow-hidden group h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-borderSubtle/60 pb-5">
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xl shadow-inner group-hover:scale-110 transition-transform">
                    <FaPeopleCarry />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-primaryText">
                      Soft Skills & Mindset
                    </h3>
                    <p className="text-xs text-mutedText">
                      Engineering culture & collaboration
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-mutedText tracking-widest bg-mainBg px-2.5 py-1 rounded-lg border border-borderSubtle">
                  04 / CULTURE
                </span>
              </div>

              {/* Pillars List */}
              <div className="space-y-3.5">
                {/* 1. Problem Solving */}
                <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle/70 flex items-start gap-3.5 hover:border-brandAccent/40 transition-colors">
                  <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 text-base mt-0.5">
                    <FaBolt />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-primaryText">
                      Problem Solving & Debugging
                    </h4>
                    <p className="text-xs text-mutedText leading-relaxed mt-0.5">
                      Systematic root-cause analysis, algorithmic thinking, and rapid bug resolution.
                    </p>
                  </div>
                </div>

                {/* 2. Collaboration & Teamwork */}
                <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle/70 flex items-start gap-3.5 hover:border-purple-400/40 transition-colors">
                  <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 text-base mt-0.5">
                    <FaHandshake />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-primaryText">
                      Cross-Functional Teamwork
                    </h4>
                    <p className="text-xs text-mutedText leading-relaxed mt-0.5">
                      Effective code reviews, agile rituals, and seamless alignment with designers & stakeholders.
                    </p>
                  </div>
                </div>

                {/* 3. Time Management & Agile */}
                <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle/70 flex items-start gap-3.5 hover:border-amber-400/40 transition-colors">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 text-base mt-0.5">
                    <FaRegClock />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-primaryText">
                      Agile Delivery & Ownership
                    </h4>
                    <p className="text-xs text-mutedText leading-relaxed mt-0.5">
                      Prioritization, sprint pacing, and taking end-to-end accountability for features.
                    </p>
                  </div>
                </div>

                {/* 4. Continuous Learning */}
                <div className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle/70 flex items-start gap-3.5 hover:border-emerald-400/40 transition-colors">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-base mt-0.5">
                    <FaBookOpen />
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-primaryText">
                      Continuous Growth
                    </h4>
                    <p className="text-xs text-mutedText leading-relaxed mt-0.5">
                      Constantly exploring cutting-edge developer tools, architectures, and AI workflows.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Badge Summary */}
              <div className="pt-2 flex items-center justify-between text-xs text-mutedText border-t border-borderSubtle/60">
                <span className="flex items-center gap-1.5 text-brandAccent font-bold">
                  <RiCheckDoubleLine className="text-base" /> High Ownership
                </span>
                <span>Adaptable & Communicative</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
