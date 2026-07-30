"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TransitionLink from "@/components/TransitionLink";
import { motion, AnimatePresence } from "framer-motion";
import "@/styles/menu.css";

// Variants for mobile sidebar fade animation
const sidebarVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
  },
  exit: { opacity: 0, scale: 0.9 },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getLinkClass = (href: string) => {
    const active = isLinkActive(href);
    if (active) {
      return isScrolled
        ? "nav-link bg-blue-600/10 text-blue-600 font-bold px-3.5 py-1 rounded-xl border border-blue-600/20 shadow-sm relative overflow-hidden"
        : "nav-link bg-surface/90 text-brandAccent font-bold px-3.5 py-1 rounded-xl border border-borderSubtle shadow-sm relative overflow-hidden";
    }
    return isScrolled
      ? "nav-link text-slate-700 hover:text-blue-600 px-3.5 py-1 font-semibold transition-colors duration-200"
      : "nav-link text-mutedText hover:text-brandAccent px-3.5 py-1 font-semibold transition-colors duration-200";
  };

  return (
    <>
      <nav className="fixed top-3 md:top-5 px-5 w-full z-[99] transition-all duration-300">
        <div
          className={`container wrapper p-3 px-8 flex justify-between md:justify-center items-center ${
            isScrolled
              ? "bg-white/80 backdrop-blur-lg shadow-lg border border-rose-300 text-slate-900"
              : "bg-mainBg backdrop-blur-md border-b-2 border-borderSubtle text-primaryText shadow-2xl"
          } rounded-lg`}
        >
          {/* Mobile Logo */}
          <div className="flex md:hidden text-xl font-bold">
            <Link href="/">
              <Image src="/logoR2.png" width={50} height={20} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden w-full md:flex px-10 md:justify-between items-center font-medium">
            <div className="flex items-center space-x-4">
              <TransitionLink
                href="/"
                label="Home"
                isActive={isLinkActive("/")}
                className={getLinkClass("/")}
              />
              <TransitionLink
                href="/work"
                label="Work"
                isActive={isLinkActive("/work")}
                className={getLinkClass("/work")}
              />
            </div>

            {/* Animated Logo */}
            <div className="text-xl font-bold">
              <Link href="/">
                <motion.div
                  onMouseEnter={() => {
                    if (isScrolled) setIsHovered(true);
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative"
                  style={{ width: "150px", height: "30px" }}
                >
                  <AnimatePresence>
                    {isScrolled && isHovered ? (
                      <motion.div
                        key="hoveredLogo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <img
                          src="/myLogo.png"
                          alt="Hovered Logo"
                          width={150}
                          height={30}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="defaultLogo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <img
                          src="/logoR2.png"
                          alt="Logo"
                          width={50}
                          height={20}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <TransitionLink
                href="/about"
                label="About"
                isActive={isLinkActive("/about")}
                className={getLinkClass("/about")}
              />
              <div className="tooltip-container">
                <a
                  className={`nav-link px-3 py-1.5 ${
                    isScrolled
                      ? "hover:text-blue-600"
                      : "hover:text-brandAccent"
                  }`}
                >
                  Gallery
                </a>
                <span className="tooltip">Coming Soon!</span>
              </div>
            </div>
          </ul>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="focus:outline-none z-50"
            >
              <div className="bar flex flex-col gap-1 w-6 h-5">
                <span
                  className={`bar-list ${
                    isScrolled ? "bg-black" : "bg-primaryText"
                  } h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                />
                <span
                  className={`bar-list ${
                    isScrolled ? "bg-black" : "bg-primaryText"
                  } h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`bar-list ${
                    isScrolled ? "bg-black" : "bg-primaryText"
                  } h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className="fixed inset-0 bg-surface text-primaryText z-[100000] flex flex-col justify-center items-center text-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-6xl focus:outline-none text-primaryText"
            >
              &times;
            </button>

            <ul className="space-y-8 text-xl font-bold flex flex-col items-center">
              <TransitionLink
                href="/"
                label="Home"
                isActive={isLinkActive("/")}
                className={`nav-link ${isLinkActive("/") ? "text-brandAccent font-bold" : "hover:text-brandAccent"}`}
                onClick={() => setMenuOpen(false)}
              />
              <TransitionLink
                href="/work"
                label="Work"
                isActive={isLinkActive("/work")}
                className={`nav-link ${isLinkActive("/work") ? "text-brandAccent font-bold" : "hover:text-brandAccent"}`}
                onClick={() => setMenuOpen(false)}
              />
              <TransitionLink
                href="/about"
                label="About"
                isActive={isLinkActive("/about")}
                className={`nav-link ${isLinkActive("/about") ? "text-brandAccent font-bold" : "hover:text-brandAccent"}`}
                onClick={() => setMenuOpen(false)}
              />
              <li className="relative">
                <div className="tooltip-container">
                  <a className="nav-link block text-primaryText">Gallery</a>
                  <span className="tooltip">Coming Soon!</span>
                </div>
              </li>
              <TransitionLink
                href="/about"
                label="About"
                className="nav-link hover:text-brandAccent"
                onClick={() => setMenuOpen(false)}
              />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
