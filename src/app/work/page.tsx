// Re-generate this page in the background at most once every 60 seconds
export const revalidate = 60;

import { client as sanityClient } from '../../sanity/lib/client';
import { urlFor } from '../../sanity/lib/image';
import ClientProjectGrid from './ClientProjectGrid';
import BlurText from '../components/BlurText';
import type { Project } from "@/types/sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
type ProjectWithSanityImages = Omit<Project, "images" | "appIconUrl" | "screenshots" | "apkUrl"> & {
  images?: SanityImageSource[];
  appIcon?: SanityImageSource;
  screenshots?: SanityImageSource[];
  apkFile?: { asset?: { url?: string } };
  shortTagline?: string;
};

export default async function WorkPage() {
  const projects = await sanityClient.fetch<ProjectWithSanityImages[]>(
    `*[_type in ["webProject", "mobileProject", "designProject"]] | order(orderRank){
      _id,
      title,
      "slug": slug.current,
      "category": select(
        _type == "webProject" => "Web",
        _type == "mobileProject" => "Mobile",
        _type == "designProject" => "Design"
      ),
      tools[]->{
        _id,
        title,
        icon,
        color
      },
      description,
      images,
      liveProjectUrl,
      shortTagline,
      appIcon,
      apkFile,
      screenshots
    }`
  );

  const prepared: Project[] = projects.map((p) => ({
    ...p,
    images: Array.isArray(p.images)
      ? p.images.map((img) => urlFor(img).width(600).height(400).url())
      : [],
    appIconUrl: p.appIcon ? urlFor(p.appIcon).width(128).height(128).url() : undefined,
    apkUrl: p.apkFile?.asset?.url,
    screenshots: Array.isArray(p.screenshots)
      ? p.screenshots.map((img) => urlFor(img).width(1200).height(800).url())
      : [],
  }));
  const hasProjects = prepared.length > 0;

  return (
    <>
      <div className="flex justify-center items-center text-center w-full bg-amber-100 md:py-32 py-24">
        
        <BlurText
  text="My Work"
  delay={600}
  animateBy="words"
  direction="top"
  className="text-5xl md:mt-0 mt-10 font-extrabold text-black"
/>

      </div>
      <div className="container mx-auto px-4 py-12 min-h-[50vh]">
        {hasProjects ? (
          <ClientProjectGrid projects={prepared} />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-gray-700">
            <p className="text-lg font-medium">No projects yet. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  );
}
