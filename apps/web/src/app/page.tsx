import Hero from "@/components/sections/hero";
import AboutSection from "@/components/sections/aboutSection";
import SkillsSection from "@/components/sections/skillsSection";
import MyWorkSection from "@/components/sections/MyWorkSection";
import ExperienceSection from "@/components/sections/experienceSection";
import Services from "@/components/sections/services";
import Contact from "@/components/sections/contact";
import {
  getCachedSettings,
  getCachedExperiences,
  getCachedProjects,
} from "@portfolio/database";

export const revalidate = 86400; // 24-hour ISR fallback (revalidated on-demand via webhook)

const Page = async () => {
  const [settings, experiences, projects] = await Promise.all([
    getCachedSettings(),
    getCachedExperiences(),
    getCachedProjects(),
  ]);

  return (
    <div className="w-full">
      <Hero settings={settings} />
      <AboutSection />
      <MyWorkSection projects={projects} />
      <SkillsSection />
      <ExperienceSection experiences={experiences} />
      <Services settings={settings} />
      <Contact />
    </div>
  );
};

export default Page;
