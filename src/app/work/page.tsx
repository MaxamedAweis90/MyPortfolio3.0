import ClientProjectGrid from "./ClientProjectGrid";
import BlurText from "../components/BlurText";
import {
  getPublicProjects,
  getPublicProjectCategories,
} from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WorkPage() {
  const [prepared, categories] = await Promise.all([
    getPublicProjects(),
    getPublicProjectCategories(),
  ]);
  const hasProjects = prepared.length > 0;

  return (
    <>
      <div className="flex justify-center items-center text-center w-full bg-surface border-b border-borderSubtle pt-24 md:pt-28 pb-14 md:pb-20 shadow-xl">
        <BlurText
          text="My Work"
          delay={600}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-5xl font-extrabold text-primaryText"
        />
      </div>
      <div className="container mx-auto px-4 py-12 min-h-[50vh]">
        {hasProjects ? (
          <ClientProjectGrid
            projects={prepared}
            initialCategories={categories}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-mutedText">
            <p className="text-lg font-medium">No projects yet. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  );
}
