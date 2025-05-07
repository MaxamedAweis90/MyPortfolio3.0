// app/work/ClientProjectGrid.jsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import {
  SiReact,
  SiVite,
  SiNextdotjs,
  SiTailwindcss,
  SiFirebase,
  SiSupabase,
  SiJavascript,
  SiTypescript,
  SiFlutter,
  SiSanity
} from 'react-icons/si'

const TOOL_ICONS = {
  'Vite + React': <><SiVite className="text-purple-500" /><SiReact className="text-blue-500" /></>,
  'Next.js': <SiNextdotjs className="text-black" />,
  Tailwind: <SiTailwindcss className="text-teal-400" />,
  Firebase: <SiFirebase className="text-yellow-500" />,
  Supabase: <SiSupabase className="text-green-500" />,
  JavaScript: <SiJavascript className="text-yellow-400" />,
  TypeScript: <SiTypescript className="text-blue-600" />,
  Flutter: <SiFlutter className="text-blue-400" />,
  'Sanity.io': <SiSanity className="text-red-500" />
}

const LABEL_STYLES = {
  'Hot 🔥': 'bg-red-100 text-red-600',
  'Just for fun': 'bg-purple-100 text-purple-600',
  'For clients': 'bg-yellow-100 text-yellow-600',
  'Experimenting': 'bg-blue-100 text-blue-600',
  'Latest': 'bg-green-100 text-green-600',
}

export default function ClientProjectGrid({ projects }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', 'Web', 'Mobile', 'Design']

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {filtered.map((proj, idx) => (
          <ProjectCard key={proj._id} proj={proj} index={idx} />
        ))}
      </div>
    </>
  )
}

function ProjectCard({ proj, index }) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [hovering, setHovering] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (hovering && proj.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % proj.images.length)
      }, 1500)
    } else {
      clearInterval(intervalRef.current)
      setCurrent(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [hovering, proj.images.length])

  // Build labels array: manual + automatic Latest on newest
  const manualLabels = proj.labels || []
  const isLatest = index === 0
  const allLabels = isLatest ? [...manualLabels, 'Latest'] : manualLabels

  return (
    <div
      onClick={() => router.push(`/work/${proj.slug}`)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02] cursor-pointer"
    >
      <div className="flex justify-between items-start bg-amber-100 px-4 py-4">
        <div className="flex-1 pr-2">
          <h2 className="text-lg font-semibold text-gray-800 flex flex-wrap gap-2">
            {proj.title}
            {allLabels.map(label => (
              <span
                key={label}
                className={`text-xs font-bold px-2 py-1 rounded-full ${LABEL_STYLES[label] || 'bg-gray-100 text-gray-800'}`}
              >
                {label}
              </span>
            ))}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
          {proj.tools?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {proj.tools.map(tool => (
                <span
                  key={tool}
                  className="text-xs inline-flex items-center gap-1 bg-gray-100 border border-gray-300 rounded-full px-2 py-1"
                >
                  {TOOL_ICONS[tool] || '🔧'} <span>{tool}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        <a
          href="https://sheekochat.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </a>
      </div>
      <div className="relative h-96 overflow-hidden">
        {proj.images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${proj.title} screenshot ${idx + 1}`}  
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
    </div>
  )
}