// app/work/page.jsx
import { client as sanityClient } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/image'
import ClientProjectGrid from './ClientProjectGrid'

export const revalidate = 60  // ISR: re‑fetch every 60 seconds

export default async function WorkPage() {
  // 1. Fetch once on the server
  const projects = await sanityClient.fetch(
    `*[_type == "project"] | order(date desc){
      _id,
      title,
      "slug": slug.current,
      category,
      label,
      description,
      images
    }`
  )

  // 2. Pre‑map the image URLs so the client doesn’t need to call urlFor()
  const prepared = projects.map(p => ({
    ...p,
    images: p.images.map(img => urlFor(img).width(600).height(400).url())
  }))

  return (
    <>
      {/* Banner */}
      <div className="w-full bg-amber-100 py-40">
        <h1 className="text-5xl font-extrabold text-black text-center">
          My Work
        </h1>
      </div>

      {/* Grid + Filters (client‑side interactive) */}
      <div className="container mx-auto px-4 py-12">
        <ClientProjectGrid projects={prepared} />
      </div>
    </>
  )
}
