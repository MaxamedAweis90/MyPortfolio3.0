import { notFound } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import { client as sanityClient } from '../../../sanity/lib/client'
import { urlFor } from '../../../sanity/lib/image'
import { PortableText } from '@portabletext/react'
import SwiperGallery from '@/components/SwiperGallery'

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch(`*[_type=='project'].slug.current`)
  return slugs.map((slug) => ({ slug }))
}

export default async function ProjectDetails({ params }) {
  const { slug } = params
  const project = await sanityClient.fetch(
    `*[_type=='project' && slug.current == $slug][0]{
      title,
      description,
      longDescription,
      category,
      date,
      duration,
      team,
      images,
      video
    }`,
    { slug }
  )

  if (!project) return notFound()

  const formattedDate = new Date(project.date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <Head>
        <title>{`${project.title} | My Portfolio`}</title>
        <meta name="description" content={project.description} />
      </Head>

      {/* Hero Section */}
      <section className="bg-amber-100 py-32">
        <div className="container mx-auto px-4 text-center">
          <Link href="/work" className="text-blue-600 hover:underline font-medium">
            &larr; Back to Work
          </Link>
          <h1 className="mt-6 text-5xl font-extrabold text-black">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Column */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h4 className="text-xl font-semibold mb-4">Project Info</h4>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>
                <strong>Category:</strong> {project.category}
              </li>
              <li>
                <strong>Date:</strong> {formattedDate}
              </li>
              <li>
                <strong>Duration:</strong> {project.duration}
              </li>
              <li>
                <strong>Team:</strong> {project.team?.join(', ')}
              </li>
            </ul>
          </div>
        </aside>
        
        {/* Content Column */}
        <div className="lg:col-span-2 space-y-8">
          <article className="prose max-w-none">
            <h2 className="text-3xl font-bold mb-4">Overview</h2>
            <p>{project.description}</p>
          </article>

          {/* Gallery */}
          {project.images?.length > 0 && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">Gallery</h3>
              <SwiperGallery
                images={project.images.map((img) => urlFor(img).width(900).height(600).url())}
                title={project.title}
              />
            </section>
          )}

          {/* Long Description */}
          <section className="prose max-w-none">
            <h3 className="text-2xl font-semibold mb-4">Details</h3>
            <PortableText value={project.longDescription} />
          </section>

          {/* Video */}
          {project.video && (
            <section>
              <h3 className="text-2xl font-semibold mb-4">Video Preview</h3>
              <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                <video
                  src={project.video}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </section>
          )}
        </div>

        
      </main>
    </>
  )
}
