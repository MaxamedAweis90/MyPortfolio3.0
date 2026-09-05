"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import CertificateCard from "./CertificateCard";
import "react-toastify/dist/ReactToastify.css";
import type { Certificate, CertificateCategory } from "@/types/portfolio";
import { categoriesData } from "@/data/portfolioData";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

type CertificatesProps = {
  certificates?: Certificate[];
};

export default function Certificates({ certificates = [] }: CertificatesProps) {
  const [categories] = useState<CertificateCategory[]>(categoriesData);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filtered =
    activeCategory === "all"
      ? certificates
      : certificates.filter(
          (c) => c.category?._ref === activeCategory
        );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const toggleInView = useInView(toggleRef, { once: true, margin: "0px" });

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    const container = scrollRef.current;
    if (el && container) {
      const offset = el.offsetLeft + el.clientWidth / 2 - container.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  const isVisibleState = isMobile || toggleInView;

  return (
    <div className="Certificates mt-12 px-4">
      {/* Animated Title */}
      <motion.h2
        className="section-header mb-8 text-2xl font-bold text-center"
        variants={fadeUpVariants}
        initial={isMobile ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        My Certificates
      </motion.h2>

      {/* Animated category toggle */}
      <motion.div
        ref={toggleRef}
        className="sticky top-0 z-10 mb-6 py-4"
        variants={fadeUpVariants}
        initial={isMobile ? "visible" : "hidden"}
        animate={isVisibleState ? "visible" : "hidden"}
        transition={{ duration: 0.6 }}
      >
        <div
          ref={scrollRef}
          className=" flex md:inline-flex items-center space-x-3 bg-surface border border-borderSubtle rounded-full shadow-lg py-2
                     overflow-x-auto scrollbar-hide -mx-4 px-4
                     md:overflow-visible md:mx-2 md:px-2 md:justify-center"
        >
          {categories.map((cat, idx) => (
            <motion.button
              id={`cat-${cat._id}`}
              key={cat._id}
              variants={fadeUpVariants}
              initial={isMobile ? "visible" : "hidden"}
              animate={isVisibleState ? "visible" : "hidden"}
              transition={{ duration: 0.4, delay: isMobile ? 0 : idx * 0.1 }}
              onClick={() => handleCategoryClick(cat._id)}
              className={`flex md-shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-medium transition ${
                activeCategory === cat._id
                  ? "bg-brandAccent text-white shadow-md shadow-brandAccent/30"
                  : "bg-mainBg text-mutedText hover:bg-borderSubtle hover:text-primaryText"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat.title}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Certificate grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert, i) => (
            <CertificateCard key={cert._id} cert={cert} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-mutedText">
          <p className="text-sm">No certificates found in this category.</p>
        </div>
      )}
    </div>
  );
}
