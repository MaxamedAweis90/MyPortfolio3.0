"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RiMoonClearLine, RiSunLine } from "react-icons/ri";
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

type NavItem = {
  id: string;
  label: string;
  href: string;
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Left Navigation Links (Home, About, Skills, Work)
  const leftNavItems: NavItem[] = [
    { id: "hero", label: "Home", href: "/#hero" },
    { id: "about", label: "About", href: "/#about" },
    { id: "skills", label: "Skills", href: "/#skills" },
    { id: "work", label: "Work", href: "/#work" },
  ];

  // Right Navigation Links (Experience, Services) - Contact handled specially
  const rightNavItems: NavItem[] = [
    { id: "experience", label: "Experience", href: "/#experience" },
    { id: "services", label: "Services", href: "/#services" },
  ];

  const contactItem: NavItem = { id: "contact", label: "Contact", href: "/#contact" };

  const allNavItems = [...leftNavItems, ...rightNavItems, contactItem];

  // Initialize theme from localStorage / defaults to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "mytheme") {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "mytheme");
      document.documentElement.classList.remove("light");
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode; // true = going to dark, false = going to light
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

  // Handle ScrollSpy and sticky navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (pathname === "/") {
        const sectionIds = ["hero", "about", "skills", "work", "experience", "services", "contact"];
        const scrollPosition = window.scrollY + 180;

        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const sectionId = sectionIds[i];
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(sectionId);
              return;
            }
          }
        }
        setActiveSection("hero");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Handle initial hash scrolling when navigating between pages
  useEffect(() => {
    if (pathname === "/" && typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const navOffset = 80;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, elementPosition - navOffset);
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
          setActiveSection(targetId);
        }
      }, 100);
    }
  }, [pathname]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    e.preventDefault();
    setMenuOpen(false);

    if (pathname === "/") {
      const el = document.getElementById(item.id);
      if (el) {
        const navOffset = 80;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = Math.max(0, elementPosition - navOffset);
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", `#${item.id}`);
        setActiveSection(item.id);
      }
    } else {
      router.push(`/#${item.id}`);
    }
  };

  const isLinkActive = (item: NavItem) => {
    // When on external or out of home screen, no section links are highlighted
    if (pathname !== "/") {
      return false;
    }
    return activeSection === item.id;
  };

  /**
   * THEME & SCROLL INVERSION ARCHITECTURE
   * ======================================
   * Dark mode:
   *   unscrolled (top) → Dark Glass Nav
   *   scrolled         → Light Floating Nav (rose accent border)
   *
   * Light mode (EXACT INVERSE):
   *   unscrolled (top) → Light Glass Nav (slate accent border)
   *   scrolled         → Dark Floating Nav (cyan/blue accent border)
   */
  const isNavDark = isDarkMode ? !isScrolled : isScrolled;

  const getLinkClass = (item: NavItem) => {
    const active = isLinkActive(item);
    if (active) {
      return isNavDark
        ? "nav-link cursor-pointer bg-[#1D2631]/90 text-brandAccent font-bold px-3 py-1 rounded-xl border border-[#2C394B] shadow-sm relative overflow-hidden text-xs lg:text-sm"
        : "nav-link cursor-pointer bg-blue-600/10 text-blue-600 font-bold px-3 py-1 rounded-xl border border-blue-600/20 shadow-sm relative overflow-hidden text-xs lg:text-sm";
    }
    return isNavDark
      ? "nav-link cursor-pointer text-slate-300 hover:text-brandAccent px-3 py-1 font-semibold transition-colors duration-200 text-xs lg:text-sm"
      : "nav-link cursor-pointer text-slate-700 hover:text-blue-600 px-3 py-1 font-semibold transition-colors duration-200 text-xs lg:text-sm";
  };

  return (
    <>
      <nav className="fixed top-3 md:top-5 px-4 sm:px-5 w-full z-[99] transition-all duration-300">
        <div
          className={`container wrapper p-2.5 sm:p-3 px-5 md:px-7 flex justify-between md:justify-center items-center rounded-lg transition-all duration-300 ${
            isScrolled
              ? isDarkMode
                ? "bg-white/85 backdrop-blur-lg shadow-lg border border-rose-300 text-slate-900"
                : "bg-[#11161D]/90 backdrop-blur-md shadow-2xl border border-[#2C394B] text-[#E2E8F0]"
              : isDarkMode
                ? "bg-[#11161D] backdrop-blur-md border-b-2 border-[#2C394B] text-[#E2E8F0] shadow-2xl"
                : "bg-transparent border-b-2 border-slate-200 text-slate-900"
          }`}
        >
          {/* Mobile Logo */}
          <div className="flex md:hidden text-xl font-bold">
            <Link
              href="/"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <Image src="/logoR2.png" width={50} height={20} alt="Logo" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden w-full md:flex px-2 lg:px-6 md:justify-between items-center font-medium">
            {/* Left Nav Group: Home, About, Skills, Work */}
            <div className="flex items-center space-x-1 lg:space-x-2">
              {leftNavItems.map((item) => (
                <li key={item.id} className="relative flex items-center justify-center">
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={getLinkClass(item)}
                  >
                    <span>{item.label}</span>
                    {isLinkActive(item) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full bg-brandAccent shadow-[0_0_6px_#0B82EC] block z-20 pointer-events-none" />
                    )}
                  </a>
                </li>
              ))}
            </div>

            {/* Centered Animated Logo */}
            <div className="text-xl font-bold px-2">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <motion.div
                  onMouseEnter={() => {
                    if (isScrolled) setIsHovered(true);
                  }}
                  onMouseLeave={() => setIsHovered(false)}
                  className="relative"
                  style={{ width: "130px", height: "28px" }}
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
                        <Image
                          src="/myLogo.png"
                          alt="Hovered Logo"
                          width={130}
                          height={28}
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
                        <Image
                          src="/logoR2.png"
                          alt="Logo"
                          width={45}
                          height={18}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </div>

            {/* Right Nav Group: Experience, Services, Distinct Contact Button, Dark Mode Toggle */}
            <div className="flex items-center space-x-1.5 lg:space-x-3">
              {rightNavItems.map((item) => (
                <li key={item.id} className="relative flex items-center justify-center">
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={getLinkClass(item)}
                  >
                    <span>{item.label}</span>
                    {isLinkActive(item) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2.5px] rounded-full bg-brandAccent shadow-[0_0_6px_#0B82EC] block z-20 pointer-events-none" />
                    )}
                  </a>
                </li>
              ))}

              {/* Distinct High-Impact Contact Button */}
              <li className="relative flex items-center justify-center">
                <a
                  href={contactItem.href}
                  onClick={(e) => handleNavClick(e, contactItem)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs lg:text-sm transition-all duration-300 shadow-md hover:scale-105 active:scale-95 ${
                    isNavDark
                      ? isLinkActive(contactItem)
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border border-cyan-300 shadow-[0_0_18px_rgba(11,130,236,0.6)]"
                        : "bg-gradient-to-r from-blue-600/90 to-cyan-600/90 text-white border border-cyan-400/40 shadow-[0_0_14px_rgba(11,130,236,0.35)] hover:shadow-[0_0_22px_rgba(11,130,236,0.6)] hover:border-cyan-300"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                  }`}
                >
                  <span>{contactItem.label}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </a>
              </li>

              {/* Enhanced Dark / Light Mode Switcher with tailored UI/UX styling */}
              <button
                onClick={toggleTheme}
                aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className={`p-2 rounded-xl border transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center ${
                  isDarkMode
                    ? isNavDark
                      ? "bg-[#1D2631]/90 border-[#2C394B] text-amber-400 hover:border-amber-400/60 hover:bg-amber-400/10 hover:shadow-[0_0_14px_rgba(251,191,36,0.35)] shadow-inner"
                      : "bg-amber-50/90 border-amber-200 text-amber-600 hover:border-amber-400 hover:bg-amber-100 hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] shadow-sm"
                    : isNavDark
                      ? "bg-[#1D2631]/90 border-[#2C394B] text-indigo-400 hover:border-indigo-400/60 hover:bg-indigo-500/10 hover:shadow-[0_0_14px_rgba(99,102,241,0.35)] shadow-inner"
                      : "bg-slate-100/90 border-slate-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/80 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)] shadow-sm"
                }`}
              >
                {isDarkMode ? (
                  <RiSunLine className="text-base sm:text-lg animate-[spin_12s_linear_infinite]" />
                ) : (
                  <RiMoonClearLine className="text-base sm:text-lg" />
                )}
              </button>
            </div>
          </ul>

          {/* Mobile Right Controls: Dark Mode Toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-300 active:scale-95 flex items-center justify-center ${
                isDarkMode
                  ? isNavDark
                    ? "bg-[#1D2631] border-[#2C394B] text-amber-400"
                    : "bg-amber-50 border-amber-200 text-amber-600"
                  : isNavDark
                    ? "bg-[#1D2631] border-[#2C394B] text-indigo-400"
                    : "bg-slate-100 border-slate-300 text-indigo-600"
              }`}
            >
              {isDarkMode ? (
                <RiSunLine className="text-base" />
              ) : (
                <RiMoonClearLine className="text-base" />
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="focus:outline-none z-50 p-1"
            >
              <div className="bar flex flex-col gap-1 w-6 h-5">
                <span
                  className={`bar-list ${
                    isNavDark ? "bg-[#E2E8F0]" : "bg-[#0F172A]"
                  } h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? "rotate-45 translate-y-1" : ""
                  }`}
                />
                <span
                  className={`bar-list ${
                    isNavDark ? "bg-[#E2E8F0]" : "bg-[#0F172A]"
                  } h-0.5 w-full rounded transition duration-400 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`bar-list ${
                    isNavDark ? "bg-[#E2E8F0]" : "bg-[#0F172A]"
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
            className={`fixed inset-0 backdrop-blur-xl z-[100000] flex flex-col justify-center items-center text-center p-6 ${
              isDarkMode
                ? "bg-[#1D2631]/98 text-[#E2E8F0]"
                : "bg-white/98 text-slate-900 border-l border-slate-200"
            }`}
          >
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close Navigation Menu"
              className="absolute top-5 right-6 text-5xl focus:outline-none hover:text-brandAccent transition-colors"
            >
              &times;
            </button>

            <ul className="space-y-5 text-xl font-bold flex flex-col items-center w-full max-w-xs">
              {allNavItems.map((item) => {
                const active = isLinkActive(item);
                const isContact = item.id === "contact";

                if (isContact) {
                  return (
                    <li key={`mobile-${item.id}`} className="w-full pt-2">
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item)}
                        className="block py-2.5 px-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg border border-cyan-400/40 text-center"
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={`mobile-${item.id}`} className="w-full">
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      className={`block py-2 px-4 rounded-xl transition-all duration-200 ${
                        active
                          ? "bg-brandAccent/15 text-brandAccent border border-brandAccent/30"
                          : isDarkMode
                            ? "text-[#E2E8F0] hover:text-brandAccent hover:bg-[#11161D]"
                            : "text-slate-800 hover:text-blue-600 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
