// app/work/[slug]/page.jsx
import { notFound } from "next/navigation";
import Head from 'next/head';
import SwiperGallery from '@/components/SwiperGallery';

const projects = [  
  {
  title: "Portfolio Website",
  slug: "portfolio",
  category: "Web",
  description: "A modern and responsive portfolio to showcase work.",
  longDescription: `This portfolio was built with modern web technologies like Next.js, TailwindCSS, and responsive layouts. It includes dynamic sections, animations, and SEO optimization. The design reflects minimalism and clarity, ensuring that user projects are front and center. This was a collaborative effort to achieve high performance and clean UI/UX.`,
  date: "March 2025",
  time: "2 weeks",
  team: ["Mohamed Aweys", "Ahmed Ali"],
  label: "Latest",
  images: [
    "https://picsum.photos/seed/41/800/500",
    "https://picsum.photos/seed/42/800/500",
    "https://picsum.photos/seed/43/800/500",
  ],
  video: "https://www.w3schools.com/html/mov_bbb.mp4"
},
{
  title: "Creative Logo",
  slug: "logo",
  category: "Design",
  description: "A unique and versatile logo concept for branding.",
  longDescription: "The logo design project involved researching the brand’s core identity, selecting suitable color schemes, and developing scalable vector graphics. Tools used include Adobe Illustrator and Figma. The goal was to create a modern, iconic, and easily recognizable logo that works across all media.",
  date: "January 2025",
  time: "3 days",
  team: ["Mohamed Aweys"],
  images: [
    "https://picsum.photos/seed/31/800/500",
    "https://picsum.photos/seed/32/800/500",
    "https://picsum.photos/seed/33/800/500",
  ],
},
// Add more project entries as needed...
];

export default function ProjectDetails({ params }) {
  const { slug } = params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return notFound();

  return (
    <>
      <Head>
        <title>{project.title} | My Portfolio</title>
        <meta name="description" content={project.description} />
      </Head>

      <div className="w-full bg-amber-100 py-40">
        <h1 className="text-5xl font-extrabold text-black text-center">
          <a href="/work" className="text-blue-600 hover:underline">Work</a> / {project.title}
        </h1>
      </div>

      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
        <p className="text-gray-700 mb-4">{project.description}</p>

        <div className="text-sm text-gray-600 mb-4">
          <p><strong>Category:</strong> {project.category}</p>
          <p><strong>Date:</strong> {project.date}</p>
          <p><strong>Duration:</strong> {project.time}</p>
          <p><strong>Team:</strong> {project.team?.join(', ')}</p>
        </div>

        <SwiperGallery images={project.images} title={project.title} />

        <div className="prose max-w-none mb-10 mt-8">
          <p>{project.longDescription}</p>
        </div>

        {project.video && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Project Video</h2>
            <video
              src={project.video}
              controls
              className="w-full rounded-xl shadow-md"
            />
          </div>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
