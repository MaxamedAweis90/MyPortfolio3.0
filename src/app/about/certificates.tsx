"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import CertificateCard from "./CertificateCard";
import { client as sanityClient } from '../../sanity/lib/client';
import "react-toastify/dist/ReactToastify.css";
import type { Certificate } from "@/types/sanity";

// reuse the same fadeUpVariants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

type Category = { _id: string; title: string };

type CertificatesProps = {
  certificates?: Certificate[];
};

export default function Certificates({ certificates = [] }: CertificatesProps) {
  // categories as array of objects [{ _id, title }]
  const [categories, setCategories] = useState<Category[]>([
    { _id: "all", title: "All" },
  ]);
  const [activeCategory, setActiveCategory] = useState("all"); // store selected category _id

  // fetch categories from Sanity on mount
  useEffect(() => {
    async function loadCategories() {
      const cats = await sanityClient.fetch<Category[]>(`
        *[_type == "category"] | order(orderRank asc) { _id, title }
      `);
      setCategories([{ _id: "all", title: "All" }, ...cats]);
    }
    loadCategories();
  }, []);

  // filter by category, 'all' shows all certificates
  const filtered =
    activeCategory === "all"
      ? certificates
      : certificates.filter(
          (c) => c.category?._ref === activeCategory
        );

  // refs for scroll and animation
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const toggleInView = useInView(toggleRef, { once: false, margin: "-100px" });

  // scroll active pill into view when clicked
  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    const container = scrollRef.current;
    if (el && container) {
      const offset = el.offsetLeft + el.clientWidth / 2 - container.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="Certificates mt-12 px-4">
      {/* Animated Title */}
      <motion.h2
        className="section-header mb-8 text-2xl font-bold text-center"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
      >
        My Certificates
      </motion.h2>

      {/* Animated category toggle */}
      <motion.div
        ref={toggleRef}
        className="sticky top-0 z-10 mb-6 py-4"
        variants={fadeUpVariants}
        initial="hidden"
        animate={toggleInView ? "visible" : "hidden"}
        transition={{ duration: 0.6 }}
      >
        <div
          ref={scrollRef}
          className=" flex md:inline-flex items-center space-x-3 bg-gray-100 rounded-full shadow py-2
                     overflow-x-auto scrollbar-hide -mx-4 px-4
                     md:overflow-visible md:mx-2 md:px-2 md:justify-center"
        >
          {categories.map((cat, idx) => (
            <motion.button
              id={`cat-${cat._id}`}
              key={cat._id}
              variants={fadeUpVariants}
              initial="hidden"
              animate={toggleInView ? "visible" : "hidden"}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => handleCategoryClick(cat._id)}
              className={`flex md-shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-medium transition ${
                activeCategory === cat._id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat.title}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Certificate grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cert, i) => (
          <CertificateCard key={cert._id} cert={cert} index={i} />
        ))}
      </div>
    </div>
  );
}
