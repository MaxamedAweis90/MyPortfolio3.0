"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import CertificateCard from "./CertificateCard";
import { client as sanityClient } from '../../sanity/lib/client';
import "react-toastify/dist/ReactToastify.css";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollRef = useRef(null);
  const toggleRef = useRef(null);
  const toggleInView = useInView(toggleRef, { once: false, margin: "-100px" });

  // fetch data
  useEffect(() => {
    async function fetchData() {
      const certs = await sanityClient.fetch(`
        *[_type == "certificate"] | order(orderRank asc){
          _id,
          title,
          issuer,
          issuedDate,
          link,
          verificationUrl,
          verificationCode,
          "category": category->title,
          "imageUrl": imageRef.asset->url
        }
      `);
      setCertificates(certs);

      const cats = await sanityClient.fetch(`
        *[_type == "category"] | order(title asc){ title }
      `);
      setCategories(["All", ...cats.map((c) => c.title)]);
    }
    fetchData();
  }, []);

  // handle category click: scroll horizontally only the pill container
  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    const el = document.getElementById(`cat-${cat}`);
    const container = scrollRef.current;
    if (el && container) {
      const offset = el.offsetLeft + el.clientWidth / 2 - container.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  const filtered =
    activeCategory === "All"
      ? certificates
      : certificates.filter((c) => c.category === activeCategory);

  return (
    <div className="Certificates mt-12 px-4">
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
          className="flex items-center space-x-3 bg-gray-100 rounded-full shadow py-2
                         overflow-x-auto scrollbar-custom -mx-4 px-4
                         md:overflow-visible md:mx-2 md:px-2 md:justify-center"
        >
          {categories.map((cat, idx) => (
            <motion.button
              id={`cat-${cat}`}
              key={cat}
              variants={fadeUpVariants}
              initial="hidden"
              animate={toggleInView ? "visible" : "hidden"}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => handleCategoryClick(cat)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full font-medium transition
                             ${
                               activeCategory === cat
                                 ? "bg-blue-600 text-white"
                                 : "bg-white text-gray-700 hover:bg-blue-100"
                             }
                           `}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cert, i) => (
          <CertificateCard
            key={cert._id}
            cert={cert}
            index={i}
            imageUrl={cert.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
