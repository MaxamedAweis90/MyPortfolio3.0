import ClientProjectGrid from './ClientProjectGrid';
import BlurText from '../components/BlurText';
import { projectsData } from "@/data/portfolioData";

export default function WorkPage() {
  const prepared = projectsData;
  const hasProjects = prepared.length > 0;

  return (
    <>
      <div className="flex justify-center items-center text-center w-full bg-surface border-b border-borderSubtle md:py-32 py-24 shadow-xl">
        <BlurText
          text="My Work"
          delay={600}
          animateBy="words"
          direction="top"
          className="text-5xl md:mt-0 mt-10 font-extrabold text-primaryText"
        />
      </div>
      <div className="container mx-auto px-4 py-12 min-h-[50vh]">
        {hasProjects ? (
          <ClientProjectGrid projects={prepared} />
        ) : (
          <div className="flex items-center justify-center h-full text-center text-mutedText">
            <p className="text-lg font-medium">No projects yet. Check back soon!</p>
          </div>
        )}
      </div>
    </>
  );
}
