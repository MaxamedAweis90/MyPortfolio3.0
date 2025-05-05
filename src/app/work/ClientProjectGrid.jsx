// app/work/ClientProjectGrid.jsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function ClientProjectGrid({ projects }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', 'Web', 'Mobile', 'Design']

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter(p => p.category === activeCategory)

  return (
    <>
      {/* Filter Buttons */}
      <div className="sticky top-0 z-10 py-6 ">
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-full px-4 py-2 shadow-md gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition duration-300 ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-100'
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
        {filtered.map(proj => (
          <ProjectCard key={proj._id} proj={proj} />
        ))}
      </div>
    </>
  )
}

function ProjectCard({ proj }) {
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (hovering) {
      ref.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % proj.images.length)
      }, 1500)
    } else {
      clearInterval(ref.current)
      setCurrent(0)
    }
    return () => clearInterval(ref.current)
  }, [hovering, proj.images.length])

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
                  proj.label === 'Hot 🔥'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
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

      {/* Images carousel */}
      <div className="relative h-96 overflow-hidden">
        {proj.images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={proj.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
