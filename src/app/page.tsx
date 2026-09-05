import Hero from "@/components/sections/hero";
import AboutSection from "./components/sections/aboutSection";
import SkillsSection from "./components/sections/skillsSection";
import MyWorkSection from "./components/sections/MyWorkSection";
import ExperienceSection from "./components/sections/experienceSection";
import Services from "./components/sections/services";
import Contact from "./components/sections/contact";
import {
  getPublicProjects,
  getPublicExperiences,
} from "@/lib/portfolio-service";

export const revalidate = 3600; // Edge cached with ISR (revalidated hourly or on-demand)

const Page = async () => {
  const [liveProjects, liveExperiences] = await Promise.all([
    getPublicProjects(),
    getPublicExperiences(),
  ]);

  return (
    <div className="w-full">
      <Hero />
      <AboutSection />
      <MyWorkSection initialProjects={liveProjects} />
      <SkillsSection />
      <ExperienceSection initialExperiences={liveExperiences} />
      <Services />
      <Contact />
    </div>
  );
};

export default Page;
