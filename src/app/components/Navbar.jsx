'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/menu.css';

// Faded animation variants
const sidebarVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: 'easeIn' } },
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-3 md:top-5 px-5 md:px-0 w-full z-[99999] transition-all duration-300">
        <div
          className={`container wrapper p-4 px-10 flex justify-between items-center ${
            isScrolled
              ? 'bg-white/80 backdrop-blur-lg shadow-lg border border-rose-300'
              : 'bg-transparent border-b-2 rounded-none border-rose-300'
          } rounded-lg`}
        >
          {/* Logo */}
          <div className="text-xl font-bold">
            <Link href="/">
              <Image src="/logoR2.png" width={50} height={20} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            <li>
              <Link href="/" className="nav-link hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/work" className="nav-link hover:text-gray-400">
                Work
              </Link>
            </li>
            <li>
              <div className="tooltip-container">
                <a className="hover:text-gray-400 nav-link">Gallery</a>
                <span className="tooltip">Coming Soon!</span>
              </div>
            </li>
            <li>
              <Link href="/about" className="nav-link hover:text-gray-400">
                About
              </Link>
            </li>
          </ul>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="focus:outline-none z-50"
            >
              <div className="bar flex flex-col gap-1 w-6 h-5">
                <span
                  className={`bar-list bg-black h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? 'rotate-45 translate-y-1' : ''
                  }`}
                ></span>
                <span
                  className={`bar-list bg-black h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`bar-list bg-black h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar with Fade Animation */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className="fixed inset-0 bg-white z-[100000] flex flex-col justify-center items-center text-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-6xl focus:outline-none"
            >
              &times;
            </button>

            {/* Centered Links */}
            <ul className="space-y-8">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="nav-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  onClick={() => setMenuOpen(false)}
                  className="nav-link"
                >
                  Work
                </Link>
              </li>
              <li className="relative">
                <div className="tooltip-container">
                  <a className="nav-link block text-gray-800">Gallery</a>
                  <span className="tooltip">Coming Soon!</span>
                </div>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className="nav-link"
                >
                  About
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
