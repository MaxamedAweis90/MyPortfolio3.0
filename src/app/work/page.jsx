// Re-generate this page in the background at most once every 60 seconds
export const revalidate = 60

import { client as sanityClient } from '../../sanity/lib/client'

import { urlFor } from '../../sanity/lib/image'
import ClientProjectGrid from './ClientProjectGrid'

export default async function WorkPage() {
  const projects = await sanityClient.fetch(
    `*[_type == "project"] | order(orderRank){
      _id,
      title,
      "slug": slug.current,
      category,
      labels,
      tools,
      description,
      images,
      liveProjectUrl
    }`
  )

  const prepared = projects.map((p) => ({
    ...p,
    images: Array.isArray(p.images)
      ? p.images.map((img) => urlFor(img).width(600).height(400).url())
      : [],
  }))

  return (
    <>
      <div className="w-full bg-amber-100 md:py-32 py-24">
        <h1 className="text-5xl md:mt-0 mt-10 font-extrabold text-black text-center">
          My Work
        </h1>
      </div>
      <div className="container mx-auto px-4 py-12">
        <ClientProjectGrid projects={prepared} />
      </div>
    </>
  )
}