import dynamic from "next/dynamic";
import Hero from "@/components/sections/hero";

// Lazy-load below-the-fold sections to minimize initial JavaScript bundle size
const Services = dynamic(() => import("./components/sections/services"), {
  loading: () => <div className="min-h-[400px] bg-mainBg" />,
});

const MyWorkSection = dynamic(() => import("./components/sections/MyWorkSection"), {
  loading: () => <div className="min-h-[600px] bg-mainBg" />,
});

const Contact = dynamic(() => import("./components/sections/contact"), {
  loading: () => <div className="min-h-[400px] bg-mainBg" />,
});

const Page = () => {
  return (
    <div>
      <Hero />
      <Services />
      <MyWorkSection />
      <Contact />
    </div>
  );
};

export default Page;
