"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// Dummy data with descriptions
const projects = [
  {
    id: 4,
    title: "Portfolio Website",
    slug: "portfolio", // Changed to use slug
    category: "Web",
    description: "A modern and responsive portfolio to showcase work.",
    label: "Latest",
    images: [
      "https://picsum.photos/seed/41/600/400",
      "https://picsum.photos/seed/42/600/400",
      "https://picsum.photos/seed/43/600/400",
    ],
  },
  {
    id: 3,
    title: "Creative Logo",
    slug: "logo", // Changed to use slug
    category: "Design",
    description: "A unique and versatile logo concept for branding.",
    label: "Latest",
    images: [
      "https://picsum.photos/seed/31/600/400",
      "https://picsum.photos/seed/32/600/400",
      "https://picsum.photos/seed/33/600/400",
    ],
  },
  {
    id: 2,
    title: "Mountain Mobile App",
    slug: "mountain", // Changed to use slug
    category: "Mobile",
    description: "A clean mobile UI for exploring mountain trails.",
    images: [
      "https://picsum.photos/seed/21/600/400",
      "https://picsum.photos/seed/22/600/400",
      "https://picsum.photos/seed/23/600/400",
    ],
  },
  {
    id: 1,
    title: "Sunset Landing Page",
    slug: "sunset", // Changed to use slug
    category: "Web",
    description: "A beautiful landing page with a sunset theme.",
    label: "Hot 🔥",
    images: [
      "https://picsum.photos/seed/11/600/400",
      "https://picsum.photos/seed/12/600/400",
      "https://picsum.photos/seed/13/600/400",
    ],
  },
];

const categories = ["All", "Web", "Mobile", "Design"];

export default function WorkPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const projectRef = useRef(null);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      {/* Banner */}
      <div className="w-full bg-amber-100 py-40">
        <h1 className="text-5xl font-extrabold text-black text-center">My Work</h1>
      </div>

      {/* Projects Section */}
      <div ref={projectRef} className="container mx-auto px-4 py-12">
        {/* Filter Buttons */}
        <div className="sticky top-0 z-10 py-6">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-full px-4 py-2 shadow-md gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {filteredProjects.map((proj) => (
            <ProjectCard key={proj.id} proj={proj} />
          ))}
        </div>
      </div>
    </>
  );
}

function ProjectCard({ proj }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [hovering, setHovering] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (hovering) {
      intervalRef.current = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % proj.images.length);
      }, 1500); // slow loop
    } else {
      clearInterval(intervalRef.current);
      setCurrentImage(0); // reset to first image
    }

    return () => clearInterval(intervalRef.current);
  }, [hovering, proj.images.length]);

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {proj.title}
            {proj.label && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  proj.label === "Hot 🔥"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {proj.label}
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-600">{proj.description}</p>
        </div>
        <Link href={`/work/${proj.slug}`}>
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
            <ExternalLink size={18} />
          </span>
        </Link>
      </div>

      {/* Images */}
      <div className="relative h-96 overflow-hidden">
        {proj.images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={proj.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
