"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/hero.css";
import TextType from "@/components/TextType";
import { appContextData } from "@/data/portfolioData";
import { FaFileDownload } from "react-icons/fa";
import { SiNextdotjs, SiReact } from "react-icons/si";
import {
  RiCodeSSlashLine,
  RiEyeLine,
  RiSendPlaneLine,
  RiArrowDownSLine,
  RiGlobalLine,
  RiSmartphoneLine,
  RiServerLine,
  RiLightbulbLine,
  RiCloseLine,
} from "react-icons/ri";

const Hero = () => {
  const router = useRouter();
  const [resumeUrl, setResumeUrl] = useState(appContextData.resume || "/resume.pdf");
  const displayName = appContextData.name || "Eng_Aweis";

  // Fetch live settings and listen for real-time updates
  useEffect(() => {
    const fetchLiveResume = async () => {
      try {
        const res = await fetch(`/api/ugaas/settings?t=${Date.now()}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (data.success && data.settings?.resumeUrl) {
          setResumeUrl(data.settings.resumeUrl);
        }
      } catch {}
    };

    fetchLiveResume();

    const handleUpdate = (e: any) => {
      if (e.detail?.settings?.resumeUrl) {
        setResumeUrl(e.detail.settings.resumeUrl);
      } else {
        fetchLiveResume();
      }
    };

    window.addEventListener("social_links_updated", handleUpdate);
    return () => window.removeEventListener("social_links_updated", handleUpdate);
  }, []);

  const greetings = [
    "Hello, I'm",
    "Asc, waa",
    "مرحبا, انا",
    "Ohayo, Watashi wa",
    "Hallo, Ich bin",
    "Bonjour, Je suis",
  ];

  // Dynamic Role Rotator array
  const roles = ["Software Engineer", "Mobile App Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const projectTypes = [
    {
      label: "Web Application",
      icon: <RiGlobalLine className="text-brandAccent" />,
      projectType: "Web Development",
      defaultTitle: "Web Application Project",
      defaultMessage:
        "Hi Eng_Aweis, I would like to request a high-performance Web Application project tailored to my business requirements.",
    },
    {
      label: "Mobile App",
      icon: <RiSmartphoneLine className="text-secondaryAccent" />,
      projectType: "Mobile Development",
      defaultTitle: "Mobile App Project",
      defaultMessage:
        "Hi Eng_Aweis, I am looking to build a cross-platform Mobile Application using React Native / Flutter.",
    },
    {
      label: "System",
      icon: <RiServerLine className="text-cyan-400" />,
      projectType: "Software Engineering",
      defaultTitle: "Enterprise System Project",
      defaultMessage:
        "Hi Eng_Aweis, I need an Enterprise System solution engineered for high performance and scalability.",
    },
    {
      label: "Custom Solution",
      icon: <RiLightbulbLine className="text-amber-400" />,
      projectType: "Custom Solution",
      defaultTitle: "Custom Solution Project",
      defaultMessage:
        "Hi Eng_Aweis, I have a custom digital solution requirement that I would like to discuss with you.",
    },
  ];

  const handleSelectProjectType = (item: (typeof projectTypes)[0]) => {
    setDropdownOpen(false);
    // Dispatch custom event to pre-fill contact form
    window.dispatchEvent(
      new CustomEvent("select-project-type", {
        detail: {
          projectType: item.projectType,
          defaultTitle: item.defaultTitle,
          defaultMessage: item.defaultMessage,
        },
      }),
    );
    // Smooth scroll down to contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      id="hero"
      className="bg-mainBg min-h-screen lg:h-screen relative flex flex-col justify-between overflow-x-hidden border-b border-borderSubtle shadow-2xl"
    >
      {/* 1. Hero Headline & CTAs Container */}
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 min-h-fit lg:min-h-0 lg:h-full flex flex-col justify-between relative z-20 pointer-events-none">
        {/* Left-Aligned Headline Stack */}
        <div className="w-full max-w-xl lg:max-w-2xl pt-28 sm:pt-32 lg:pt-28 pb-6 my-auto text-left space-y-4 pointer-events-auto">
          {/* Row 1: Animated Waving Hand 👋🏼 + High-Contrast Yellow Greeting Text */}
          <div className="inline-flex items-center gap-2.5 text-amber-300 font-semibold text-base sm:text-xl tracking-wide">
            <span className="animate-wave text-2xl sm:text-3xl">👋🏼</span>
            <TextType
              text={greetings}
              typingSpeed={70}
              pauseDuration={2000}
              showCursor={true}
              cursorCharacter="|"
              textColors={["#FACC15"]}
              as="span"
              className="text-amber-300 font-bold"
            />
          </div>

          {/* Row 2: Main Prominent Name Heading (Eng_Aweis) */}
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extrabold text-primaryText leading-[1.02] tracking-tight">
            <span>{displayName}</span>
          </h1>

          {/* Row 3: Dynamic Role Rotator Component */}
          <div className="flex items-center gap-3 text-xl sm:text-4xl font-black h-12 my-1">
            <span className="p-2 rounded-xl bg-surface border border-borderSubtle text-brandAccent shadow-md flex items-center justify-center">
              <RiCodeSSlashLine className="text-lg sm:text-2xl" />
            </span>
            <div className="relative overflow-hidden h-full flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-gradient-to-r from-brandAccent via-secondaryAccent to-sky-400 bg-clip-text text-transparent block whitespace-nowrap"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Row 4: Brief Bio Summary */}
          <p className="text-mutedText text-sm sm:text-lg max-w-lg leading-relaxed pt-1">
            Building scalable full-stack web applications, mobile apps, and
            robust systems with clean modern architecture.
          </p>

          {/* Row 5: Action Buttons Layout (Mobile: Row 1 = 2 side-by-side buttons, Row 2 = Full-width Resume button) */}
          <div className="pt-3 flex flex-col w-full max-w-md lg:max-w-none space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:gap-4 z-40">
            {/* Line 1 (Mobile): Side-by-side row containing View Work & Request A Project */}
            <div className="flex flex-row w-full gap-2.5 sm:gap-4 lg:w-auto lg:inline-flex">
              {/* Button 1: View Work */}
              <button
                onClick={() => {
                  const workEl = document.getElementById("work");
                  if (workEl) {
                    workEl.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push("/#work");
                  }
                }}
                className="flex-1 w-1/2 lg:w-auto inline-flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-brandAccent to-secondaryAccent text-white font-extrabold text-xs sm:text-base hover:shadow-brandAccent/30 transition-all duration-300 shadow-lg shadow-brandAccent/20 hover:scale-105 border border-brandAccent/40 whitespace-nowrap"
              >
                <span>View Work</span>
                <RiEyeLine className="text-base sm:text-lg" />
              </button>

              {/* Button 2: Request A Project Dropdown Trigger */}
              <div
                className="flex-1 w-1/2 lg:w-auto relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-3.5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-surface border border-borderSubtle text-primaryText font-extrabold text-xs sm:text-base hover:bg-borderSubtle hover:border-brandAccent transition-all duration-300 shadow-md group whitespace-nowrap"
                >
                  <RiSendPlaneLine className="text-base sm:text-lg text-brandAccent group-hover:scale-110 transition-transform" />
                  <span>Request A Project</span>
                  <RiArrowDownSLine
                    className={`text-base sm:text-lg transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180 text-brandAccent" : ""
                    }`}
                  />
                </button>

                {/* Desktop Inline Dropdown Popup (hidden on mobile < lg) */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="hidden lg:block absolute top-full left-0 mt-2 w-64 bg-surface/95 backdrop-blur-md border border-borderSubtle rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] p-2 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-mutedText border-b border-borderSubtle/60 mb-1">
                        Select Project Type
                      </div>
                      {projectTypes.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleSelectProjectType(item)}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold text-primaryText hover:bg-mainBg hover:text-brandAccent transition-colors duration-200 group"
                        >
                          <span className="text-lg p-1.5 rounded-lg bg-mainBg group-hover:bg-surface border border-borderSubtle">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Line 2 (Mobile Only): Resume Button spanning exact combined width of Row 1 above */}
            <div className="w-full lg:hidden">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download or View Resume PDF"
                className="w-full flex items-center justify-center gap-3 py-2.5 sm:py-3 rounded-full bg-brandAccent/90 backdrop-blur-md border border-brandAccent/50 text-white font-extrabold text-xs sm:text-sm hover:bg-brandAccent transition-all duration-300 shadow-xl shadow-brandAccent/30 hover:scale-[1.02] group"
              >
                <span className="tracking-wider">RESUME</span>
                <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-brandAccent group-hover:rotate-12 shadow-sm">
                  <FaFileDownload className="text-xs" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Resume CTA Button Pinned Inside Container Grid at Bottom-Right for Desktop lg: */}
        <div className="hidden lg:flex w-full justify-end pb-6 sm:pb-8 pointer-events-auto z-40">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download or View Resume PDF"
            className="inline-flex items-center gap-3.5 pl-5 pr-2 py-2 rounded-full bg-brandAccent/90 backdrop-blur-md border border-brandAccent/50 text-white font-extrabold text-xs sm:text-sm hover:bg-brandAccent transition-all duration-300 shadow-xl shadow-brandAccent/30 hover:scale-105 group"
          >
            <span className="tracking-wider">RESUME</span>
            <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-brandAccent group-hover:rotate-12 shadow-sm">
              <FaFileDownload className="text-xs" />
            </span>
          </a>
        </div>
      </div>

      {/* 2. Avatar Showcase (Positioned directly below text on mobile, merged side-by-side on desktop lg:) */}
      <div className="min-h-[75vh] lg:min-h-0 w-full flex flex-col justify-end items-center relative lg:absolute lg:inset-0 pointer-events-none overflow-hidden mt-2 lg:mt-0">
        {/* Rectangle Card Background Base Layer (z-5) */}
        <div className="hidden lg:flex absolute top-[44%] left-[63%] -translate-y-1/2 z-5 pointer-events-none items-center">
          {/* Background Card Base */}
          <div className="absolute top-0 bottom-0 right-0 -left-28 sm:-left-32 md:-left-36 lg:-left-40 xl:-left-44 bg-surface/95 backdrop-blur-md border border-borderSubtle shadow-[0_20px_40px_rgba(0,0,0,0.5)] rounded-[28px] sm:rounded-[32px] -z-10" />

          {/* Dummy layout spacer */}
          <div className="relative flex flex-col items-center gap-1.5 sm:gap-2 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 opacity-0">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider block text-center">
              Main Tools
            </span>
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full" />
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full" />
            </div>
          </div>
        </div>

        {/* Avatar Image Layer anchored flush to bottom-0 (z-10) */}
        <div className="absolute bottom-0 left-1/2 lg:left-[54%] -translate-x-1/2 z-10 flex justify-center items-end w-full max-w-[380px] sm:max-w-[440px] lg:max-w-2xl h-[78vh] lg:h-[88vh] pointer-events-none">
          {/* Glowing Electric Blue aura backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] bg-brandAccent/20 rounded-full blur-[120px] -z-0 pointer-events-none animate-pulse" />

          {/* Main Portrait Image anchored directly at bottom 0 */}
          <Image
            src="/me.png"
            alt="Eng_Aweis"
            priority={true}
            quality={80}
            sizes="(max-width: 640px) 340px, (max-width: 1024px) 440px, 672px"
            width={672}
            height={800}
            className="h-full w-auto object-contain object-bottom align-bottom block drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)] pointer-events-auto transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>

        {/* Interactive Main Tools Card & Responsive Line Pointer Tooltips (z-30) */}
        <div className="absolute bottom-10 lg:bottom-auto lg:top-[44%] left-1/2 lg:left-[63%] -translate-x-1/2 lg:-translate-x-0 lg:-translate-y-1/2 z-30 pointer-events-auto flex items-center">
          <div className="relative flex flex-col items-center gap-1.5 sm:gap-2 px-5 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-5  lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none border border-borderSubtle lg:border-none rounded-2xl lg:rounded-none shadow-2xl lg:shadow-none">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-brandAccent block text-center">
              Main Tools
            </span>
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              {/* Circle 1: Next.js */}
              <div className="relative group cursor-pointer">
                {/* Pulsing Hint Radius Aura */}
                <div className="absolute inset-0 rounded-full bg-brandAccent/30 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                {/* Tool Icon Badge */}
                <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-mainBg border border-borderSubtle flex items-center justify-center text-primaryText shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:border-brandAccent group-hover:shadow-[0_0_20px_rgba(11,130,236,0.5)]">
                  <SiNextdotjs className="text-xl sm:text-2xl lg:text-3xl text-primaryText" />
                </div>

                {/* Mobile Responsive Floating Tooltip (hidden on lg) */}
                <div className="flex lg:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 flex-col items-center">
                  <div className="bg-surface/95 backdrop-blur-md border border-borderSubtle text-primaryText p-2.5 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[140px] text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1.5 text-brandAccent font-extrabold text-xs">
                      <SiNextdotjs />
                      <span>Next.js 15</span>
                    </div>
                    <p className="text-[10px] text-mutedText font-medium">
                      Full-Stack Web App Framework
                    </p>
                  </div>
                  <div className="w-[2px] h-3 bg-gradient-to-b from-brandAccent to-transparent relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brandAccent shadow-[0_0_4px_#0B82EC]" />
                  </div>
                </div>

                {/* Desktop 1-to-1 Angled Pointer Line & Far-Right Text Box Tooltip (hidden below lg) */}
                <div className="hidden lg:flex absolute bottom-1/2 left-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 items-end">
                  <div className="relative left-2 w-64 h-32 flex flex-col justify-end">
                    {/* SVG Diagonal to Horizontal Line Path */}
                    <svg
                      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                      viewBox="0 0 240 100"
                    >
                      <path
                        d="M 12 88 L 68 28 L 220 28"
                        fill="none"
                        stroke="#0B82EC"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_#0B82EC]"
                      />
                      <circle cx="12" cy="88" r="3" fill="#0B82EC" />
                    </svg>

                    {/* Text Box Resting Directly Above the Horizontal Line */}
                    <div className="relative ml-[68px] mb-[74px] bg-surface/95 backdrop-blur-md border border-borderSubtle text-primaryText p-3 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[160px] space-y-1">
                      <div className="flex items-center gap-1.5 text-brandAccent font-extrabold text-sm">
                        <SiNextdotjs />
                        <span>Next.js 15</span>
                      </div>
                      <p className="text-[11px] text-mutedText font-medium leading-tight">
                        Full-Stack Web App Framework
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Circle 2: React Native */}
              <div className="relative group cursor-pointer">
                {/* Pulsing Hint Radius Aura */}
                <div className="absolute inset-0 rounded-full bg-secondaryAccent/30 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                {/* Tool Icon Badge */}
                <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-secondaryAccent/15 border border-secondaryAccent/40 flex items-center justify-center text-secondaryAccent shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-secondaryAccent/30 group-hover:border-secondaryAccent group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <SiReact className="text-xl sm:text-2xl lg:text-3xl" />
                </div>

                {/* Mobile Responsive Floating Tooltip (hidden on lg) */}
                <div className="flex lg:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 flex-col items-center">
                  <div className="bg-surface/95 backdrop-blur-md border border-borderSubtle text-primaryText p-2.5 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[140px] text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1.5 text-secondaryAccent font-extrabold text-xs">
                      <SiReact />
                      <span>React Native</span>
                    </div>
                    <p className="text-[10px] text-mutedText font-medium">
                      Cross-Platform Mobile Apps
                    </p>
                  </div>
                  <div className="w-[2px] h-3 bg-gradient-to-b from-secondaryAccent to-transparent relative">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondaryAccent shadow-[0_0_4px_#3B82F6]" />
                  </div>
                </div>

                {/* Desktop 1-to-1 Angled Pointer Line & Far-Right Text Box Tooltip (hidden below lg) */}
                <div className="hidden lg:flex absolute bottom-1/2 left-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 items-end">
                  <div className="relative left-2 w-64 h-32 flex flex-col justify-end">
                    {/* SVG Diagonal to Horizontal Line Path */}
                    <svg
                      className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                      viewBox="0 0 240 100"
                    >
                      <path
                        d="M 12 88 L 68 28 L 220 28"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_#3B82F6]"
                      />
                      <circle cx="12" cy="88" r="3" fill="#3B82F6" />
                    </svg>

                    {/* Text Box Resting Directly Above the Horizontal Line */}
                    <div className="relative ml-[68px] mb-[74px] bg-surface/95 backdrop-blur-md border border-borderSubtle text-primaryText p-3 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.9)] whitespace-nowrap min-w-[160px] space-y-1">
                      <div className="flex items-center gap-1.5 text-secondaryAccent font-extrabold text-sm">
                        <SiReact />
                        <span>React Native</span>
                      </div>
                      <p className="text-[11px] text-mutedText font-medium leading-tight">
                        Cross-Platform Mobile Apps
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Top Sheet Modal Dropdown Picker (hidden on desktop lg:) */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 px-4 pointer-events-auto"
            onClick={() => setDropdownOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm bg-surface border border-borderSubtle rounded-3xl shadow-2xl p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-borderSubtle/70 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brandAccent">
                  Select Project Type
                </span>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="p-1.5 rounded-full bg-mainBg text-mutedText hover:text-primaryText transition-colors"
                >
                  <RiCloseLine className="text-xl" />
                </button>
              </div>

              <div className="space-y-2.5">
                {projectTypes.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSelectProjectType(item)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-2xl text-left bg-mainBg/80 border border-borderSubtle text-primaryText font-bold text-sm hover:bg-brandAccent hover:text-white dark:hover:text-white transition-all duration-200 group"
                  >
                    <span className="text-xl p-2 rounded-xl bg-surface border border-borderSubtle group-hover:bg-white/20">
                      {item.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-mutedText group-hover:text-white/80 font-normal">
                        {item.defaultTitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator cue (z-50) floating over the bottom center */}
      <div className="scroll-container absolute bottom-2 left-1/2 -translate-x-1/2 z-50 pointer-events-auto hidden lg:flex">
        <div className="mouse shadow-md bg-surface/60 backdrop-blur-sm border border-borderSubtle">
          <span className="scroll-ball bg-primaryText"></span>
        </div>
        <div className="chevrons">
          <div className="chevrondown border-primaryText"></div>
          <div className="chevrondown border-primaryText"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
