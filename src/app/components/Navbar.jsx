'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/menu.css'

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

          {/* Mobile Hamburger Button (only visible on small screens) */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
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

      {/* Sidebar Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-slate-500 transition-opacity duration-300 z-[999999] ${
          menuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed text-center top-0 left-0 h-full w-64 bg-white z-[999999] transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        <ul className="flex flex-col p-6 space-y-4">

          {/* Logo */}
          <div className="text-xl font-bold">
            <Link href="/">
              <Image src="/myLogo.png" width={200} height={20} alt="Logo" />
            </Link>
          </div>

          <li>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block text-xl text-gray-800 hover:text-gray-600"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/work"
              onClick={() => setMenuOpen(false)}
              className="nav-link block text-xl text-gray-800 hover:text-gray-600"
            >
              Work
            </Link>
          </li>
          <li className=' relative'>
            <div className="tooltip-container">
              <a className="nav-link block text-xl text-gray-800">Gallery</a>
              <span className="tooltip">Coming Soon!</span>
            </div>
          </li>
          <li>
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className=" nav-link block text-xl text-gray-800 hover:text-gray-600"
            >
              About
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
