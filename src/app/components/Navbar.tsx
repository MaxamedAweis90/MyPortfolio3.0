"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-3 md:top-5 px-5 w-full z-[99] transition-all duration-300">
        <div
          className={`container wrapper p-4 px-10 flex justify-between md:justify-center items-center ${
            isScrolled
              ? "bg-white/80 backdrop-blur-lg shadow-lg border border-rose-300"
              : "bg-amber-100 border-b-2 border-rose-300"
          } rounded-lg`}
        >
          {/* Mobile Logo */}
          <div className="flex md:hidden text-xl font-bold">
            <Link href="/">
              <Image src="/logoR2.png" width={50} height={20} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden w-full md:flex px-10 md:justify-between items-center">
            <div className="flex space-x-6">
              <TransitionLink
                href="/"
                label="Home"
                className="cursor-target nav-link hover:text-gray-400"
              />
              <TransitionLink
                href="/work"
                label="Work"
                className="cursor-target nav-link hover:text-gray-400"
              />
            </div>

            {/* Animated Logo */}
            <div className="cursor-target text-xl font-bold">
              <Link href="/">
                <motion.div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative"
                  style={{ width: "150px", height: "30px" }}
                >
                  <AnimatePresence>
                    {isHovered ? (
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

            <div className="flex space-x-6">
            <TransitionLink
                href="/about"
                label="About"
                className="cursor-target nav-link hover:text-gray-400"
              />
              {/* <TransitionLink
                href="/blog"
                label="Blog"
                className="cursor-target nav-link hover:text-gray-400"
              /> */}
              <div className="cursor-target tooltip-container">
                <a className="hover:text-gray-400 nav-link">Gallery</a>
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
                  className={`bar-list bg-black h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                />
                <span
                  className={`bar-list bg-black h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`bar-list bg-black h-0.5 w-full rounded transition duration-400 ${
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
            className="fixed inset-0 bg-white z-[100000] flex flex-col justify-center items-center text-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-6xl focus:outline-none"
            >
              &times;
            </button>

            <ul className="space-y-8">
              <TransitionLink
                href="/"
                label="Home"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              />
              <TransitionLink
                href="/work"
                label="Work"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              />
              <li className="relative">
                <div className="tooltip-container">
                  <a className="nav-link block text-gray-800">Gallery</a>
                  <span className="tooltip">Coming Soon!</span>
                </div>
              </li>
              <TransitionLink
                href="/about"
                label="About"
                className="nav-link"
                onClick={() => setMenuOpen(false)}
              />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


