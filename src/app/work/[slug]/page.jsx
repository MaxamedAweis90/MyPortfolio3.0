// // app/project/[slug]/page.js

// // Re-generate this page in the background at most once every 60 seconds
// export const revalidate = 60

// import { notFound } from 'next/navigation'
// import { client as sanityClient } from '../../../sanity/lib/client'
// import { urlFor } from '../../../sanity/lib/image'
// import { PortableText } from '@portabletext/react'
// import SwiperGallery from '@/components/SwiperGallery'
// import {
//   SiReact,
//   SiVite,
//   SiNextdotjs,
//   SiTailwindcss,
//   SiFirebase,
//   SiSupabase,
//   SiJavascript,
//   SiTypescript,
//   SiFlutter,
//   SiSanity,
// } from 'react-icons/si'

// // Tool icon mapping
// const TOOL_ICONS = {
//   'Vite + React': (
//     <>
//       <SiVite className="text-purple-500" />
//       <SiReact className="text-blue-500" />
//     </>
//   ),
//   'Next.js': <SiNextdotjs className="text-black" />,
//   Tailwind: <SiTailwindcss className="text-teal-400" />,
//   Firebase: <SiFirebase className="text-yellow-500" />,
//   Supabase: <SiSupabase className="text-green-500" />,
//   JavaScript: <SiJavascript className="text-yellow-400" />,
//   TypeScript: <SiTypescript className="text-blue-600" />,
//   Flutter: <SiFlutter className="text-blue-400" />,
//   'Sanity.io': <SiSanity className="text-red-500" />,
// }

// // 1️⃣ Specify which slugs to pre-render at build time
// export async function generateStaticParams() {
//   const slugs = await sanityClient.fetch(
//     `*[_type == "project"].slug.current`
//   )
//   return slugs.map((slug) => ({ slug }))
// }

// // 2️⃣ Optional: per-page <head> metadata
// export async function generateMetadata({ params }) {
//   const { slug } = params
//   const project = await sanityClient.fetch(
//     `*[_type == "project" && slug.current == $slug][0]{ title, description }`,
//     { slug }
//   )
//   if (!project) return {}
//   return {
//     title: `${project.title} | My Portfolio`,
//     description: project.description,
//   }
// }

// // 3️⃣ The actual page component
// export default async function ProjectDetails({ params }) {
//   const { slug } = params

//   const project = await sanityClient.fetch(
//     `*[_type == "project" && slug.current == $slug][0]{
//       title,
//       description,
//       longDescription,
//       category,
//       date,
//       duration,
//       team,
//       tools,
//       images,
//       video,
//       liveProjectUrl
//     }`,
//     { slug }
//   )

//   if (!project) {
//     notFound()
//   }

//   const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
//     month: 'long',
//     year: 'numeric',
//   })

//   return (
//     <section className="bg-amber-100 py-24">
//       <div className="container mx-auto px-4 max-w-6xl mt-12">
//         {/* Header */}
//         <div className="space-y-6">
//           <div className="flex flex-col space-y-2">
//             <h4 className="text-gray-700 text-sm font-medium">
//               Duration: {project.duration} • {formattedDate}
//             </h4>
//             <h1 className="text-4xl font-extrabold text-black">
//               {project.title}
//             </h1>
//           </div>

//           {/* Info Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-6">
//             <div className="text-start text-gray-800">
//               {project.description}
//             </div>

//             <div className="text-start">
//               <h4 className="font-semibold mb-2">Team:</h4>
//               <ul className="text-gray-700">
//                 {project.team?.map((member, i) => (
//                   <li key={i}>{member}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="text-start">
//               <h4 className="font-semibold mb-2">Tools Used:</h4>
//               <div className="flex flex-wrap gap-3">
//                 {project.tools?.map((tool, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center gap-2 text-sm bg-gray-100 border border-gray-300 rounded-full px-4 py-1"
//                   >
//                     {TOOL_ICONS[tool] || '🔧'}
//                     <span>{tool}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Live Project Link */}
//         {project.liveProjectUrl && (
//           <div className="mt-6">
//             <a
//               href={project.liveProjectUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block bg-blue-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
//             >
//               Preview Live Project
//             </a>
//           </div>
//         )}

//         {/* Image Gallery */}
//         {project.images?.length > 0 && (
//           <div className="mt-10">
//             <SwiperGallery
//               images={project.images.map((img) =>
//                 urlFor(img).width(900).height(600).url()
//               )}
//               title={project.title}
//             />
//           </div>
//         )}

//         {/* Long Description */}
//         <div className="prose max-w-none mt-12">
//           <h3 className="text-2xl font-semibold mb-4">Details</h3>
//           <PortableText value={project.longDescription} />
//         </div>

//         {/* Video Preview */}
//         {project.video && (
//           <div className="mt-12">
//             <h3 className="text-2xl font-semibold mb-4">Video Preview</h3>
//             <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
//               <video
//                 src={project.video}
//                 controls
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   )
// }
