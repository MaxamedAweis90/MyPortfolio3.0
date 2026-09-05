import nextDynamic from "next/dynamic";
import Hero from "@/components/sections/hero";
import { getPublicProjects, getPublicExperiences } from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Lazy-load below-the-fold sections to minimize initial JavaScript bundle size
const AboutSection = nextDynamic(() => import("./components/sections/aboutSection"), {
  loading: () => <div className="min-h-[500px] bg-mainBg" />,
});

const SkillsSection = nextDynamic(() => import("./components/sections/skillsSection"), {
  loading: () => <div className="min-h-[500px] bg-mainBg" />,
});

const MyWorkSection = nextDynamic(() => import("./components/sections/MyWorkSection"), {
  loading: () => <div className="min-h-[600px] bg-mainBg" />,
});

const ExperienceSection = nextDynamic(() => import("./components/sections/experienceSection"), {
  loading: () => <div className="min-h-[500px] bg-mainBg" />,
});

const Services = nextDynamic(() => import("./components/sections/services"), {
  loading: () => <div className="min-h-[400px] bg-mainBg" />,
});

const Contact = nextDynamic(() => import("./components/sections/contact"), {
  loading: () => <div className="min-h-[400px] bg-mainBg" />,
});

const Page = async () => {
  const [liveProjects, liveExperiences] = await Promise.all([
    getPublicProjects(),
    getPublicExperiences(),
  ]);

  return (
    <div className="w-full">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <MyWorkSection initialProjects={liveProjects} />
      <ExperienceSection initialExperiences={liveExperiences} />
      <Services />
      <Contact />
    </div>
  );
};

export default Page;
