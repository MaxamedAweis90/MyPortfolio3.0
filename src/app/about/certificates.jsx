"use client";
import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import CertificateCard from "./CertificateCard";
import "react-toastify/dist/ReactToastify.css";

// reuse the same fadeUpVariants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function Certificates({ certificates = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Web", "Mobile", "Design"];

  // filter by category
  const filtered =
    activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);

  // hook for toggle animation
  const toggleRef = useRef(null);
  const toggleInView = useInView(toggleRef, { once: false, margin: "-100px" });

  return (
    <div className="Certificates mt-12 px-4">
      {/* Animated Title */}
      <motion.h2
        className="section-header mb-8 text-2xl font-bold text-center"
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
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
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-full px-4 py-2 shadow gap-2">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                variants={fadeUpVariants}
                initial="hidden"
                animate={toggleInView ? "visible" : "hidden"}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-blue-100"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
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
