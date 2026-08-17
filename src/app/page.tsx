import dynamic from "next/dynamic";
import Hero from "@/components/sections/hero";

// Lazy-load below-the-fold sections to minimize initial JavaScript bundle size
const AboutSection = dynamic(() => import("./components/sections/aboutSection"), {
  loading: () => <div className="min-h-[500px] bg-mainBg" />,
});

const SkillsSection = dynamic(() => import("./components/sections/skillsSection"), {
  loading: () => <div className="min-h-[500px] bg-mainBg" />,
});

const MyWorkSection = dynamic(() => import("./components/sections/MyWorkSection"), {
  loading: () => <div className="min-h-[600px] bg-mainBg" />,
});

const ExperienceSection = dynamic(() => import("./components/sections/experienceSection"), {
  loading: () => <div className="min-h-[500px] bg-mainBg" />,
});

const Services = dynamic(() => import("./components/sections/services"), {
  loading: () => <div className="min-h-[400px] bg-mainBg" />,
});

const Contact = dynamic(() => import("./components/sections/contact"), {
  loading: () => <div className="min-h-[400px] bg-mainBg" />,
});

const Page = () => {
  return (
    <div className="w-full">
      <Hero />
      <AboutSection />
      <SkillsSection />
      <MyWorkSection />
      <ExperienceSection />
      <Services />
      <Contact />
    </div>
  );
};

export default Page;
