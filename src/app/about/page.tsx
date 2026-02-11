"use client";
import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import "@/styles/about.css";
import BlurText from "../components/BlurText";
import ScrollReveal from "../components/ScrollReveal";

import { GoGoal } from "react-icons/go";
import { IoCreate } from "react-icons/io5";
import { FaPause, FaPlay, FaRegEye } from "react-icons/fa";
import { LucideVerified } from "lucide-react";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";

import Certificates from "./certificates";
import { client as sanityClient } from "../../sanity/lib/client";
import { getCertificatesQuery } from "@/lib/queries";
import type { Certificate } from "@/types/sanity";

import {
  SiVite,
  SiNextdotjs,
  SiMongodb,
  SiExpress,
  SiReact,
  SiNodedotjs,
  SiFlutter,
  SiFigma,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobepremierepro,
  SiCanva,
  SiGithub,
  SiSanity,
  SiFirebase,
  SiSupabase,
} from "react-icons/si";
import { FaLaptopCode, FaPeopleCarry, FaRegClock, FaBolt, FaHandshake, FaPhotoVideo } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import LanguageSwiper from "./LanguageSwiper";


export default function Page() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [played, setPlayed] = useState(0);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    sanityClient
      .fetch<Certificate[]>(getCertificatesQuery)
      .then((data) => setCertificates(data))
      .catch((err) => console.error("Sanity fetch error:", err));
  }, []);

  const togglePlayPause = () => setIsPlaying((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <>
      <div className="flex justify-center items-center text-center w-full bg-amber-100 md:py-32 py-24">
        
        <BlurText
  text="About Me!"
  delay={600}
  animateBy="words"
  direction="top"
  className="text-5xl md:mt-0 mt-10 font-extrabold text-black"
/>

      </div>

      <section className="about-flex-container container section mx-auto flex flex-col md:flex-row gap-6 px-4 md:px-10 py-10">
        {/* Left - Video + Info */}
        <div className="flex-1">
  {/* Video Player */}
  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg">
    <ReactPlayer
      url="https://youtu.be/cVsY9-SPrRc"
      playing={isPlaying}
      muted={isMuted}
      controls={false}
      width="100%"
      height="100%"
      onProgress={({ played }) => setPlayed(played)}
      className="absolute top-0 left-0"
    />
    <div className="absolute inset-0  bg-black/20  flex items-end justify-between px-4">
      <button onClick={toggleMute} className="text-white text-2xl bottom-3">
        {isMuted ? <GiSpeakerOff /> : <GiSpeaker />}
      </button>
      <button onClick={togglePlayPause} className="text-white text-2xl bottom-3">
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
    {/* Progress bar */}
    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
      <div
        className="h-full bg-amber-400"
        style={{ width: `${played * 100}%` }}
      ></div>
    </div>
  </div>

  {/* Info Section (Left Aligned) */}
<div className="leftside bg-white text-black p-6 mt-6 rounded-xl shadow-md text-left space-y-6">
  <img src="./myProfile.png" alt="" className="w-32 h-32 rounded-full mb-4" />

  <ScrollReveal>
    <h2 className="text-lg font-semibold text-amber-700">A BRIEF ABOUT ME</h2>
  </ScrollReveal>

  <ScrollReveal>
    <h1 className="text-2xl font-bold flex items-center gap-2">
      <motion.span
        style={{ display: "inline-block", transformOrigin: "bottom" }}
        animate={{ rotate: [-20, 20, -20, 20, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
      >
        👋🏼
      </motion.span>
      I&apos;m Mohamed Aweys
    </h1>
  </ScrollReveal>

  <ScrollReveal>
    <p>
      A passionate <strong>developer, designer, and tech enthusiast</strong> with a strong focus on
      building seamless digital experiences.
    </p>
    <p>
      As an <strong>IT student at SIMAD University</strong>, I constantly seek new challenges and opportunities.
    </p>
    <p>
      I refine my skills in <strong>web and mobile development, UI/UX design, and problem-solving</strong>.
    </p>
  </ScrollReveal>

  <ScrollReveal>
    <h2 className="text-xl font-semibold flex gap-2 items-center text-gray-800">
      <IoCreate /> <u>What I Do</u>
    </h2>
    <p className="mt-2">
      I specialize in the <strong>MERN stack</strong> (MongoDB, Express, React, Node.js) for
      building scalable and efficient web applications.
    </p>
    <p>
      I&apos;m also advancing in <strong>mobile app development using Flutter</strong>, creating cross-platform apps.
    </p>
    <p>
      Beyond coding, I engage in <strong>graphic design and video editing</strong> to build strong digital brands.
    </p>
  </ScrollReveal>

  <ScrollReveal>
    <h2 className="text-xl font-semibold flex gap-2 items-center text-gray-800">
      <FaRegEye /> <u>Vision</u>
    </h2>
    <p className="mt-2">
      To <strong>innovate and create impactful digital solutions</strong> that improve efficiency,
      </p>
      <p>
      enhance user experiences, and simplify everyday tasks through{" "}
    </p>
    <p>
      <strong>cutting-edge technology and design</strong>.
    </p>
    </ScrollReveal>

  <ScrollReveal>
    <h2 className="text-xl font-semibold flex gap-2 items-center text-gray-800">
      <GoGoal /> <u>Mission</u>
    </h2>
    </ScrollReveal>
    <ul className="mt-2 space-y-1 list-disc list-inside">
    <ScrollReveal>
      <li><strong>Build high-quality web and mobile applications</strong> that solve real-world problems.</li>
      </ScrollReveal>
      <ScrollReveal>
      <li><strong>Enhance user experiences</strong> with intuitive UI/UX design and engaging visuals.</li>
      </ScrollReveal>
      <ScrollReveal>
      <li><strong>Continuously learn and adapt</strong> to emerging technologies.</li>
      </ScrollReveal>
      <ScrollReveal>
      <li><strong>Empower brands and individuals</strong> through creative graphic design and video editing.</li>
      </ScrollReveal>
    </ul>
  

  <ScrollReveal>
    <h2 className="text-xl font-semibold flex gap-2 items-center text-gray-800">
      <LucideVerified /> <u>Values</u>
    </h2>
  </ScrollReveal>
    <ul className="mt-2 space-y-1 list-disc list-inside">
    <ScrollReveal>
      <li>🚀 <strong>Innovation</strong> – Always pushing boundaries to explore new possibilities.</li>
      </ScrollReveal>
      <ScrollReveal>
      <li>🎯 <strong>Excellence</strong> – Striving for high-quality work in everything I create.</li>
      </ScrollReveal>
      <ScrollReveal>
      <li>🔗 <strong>Collaboration</strong> – Believing in teamwork and knowledge-sharing.</li>
      </ScrollReveal>
      <ScrollReveal>
      <li>📈 <strong>Growth</strong> – Constantly learning and improving to stay ahead in tech.</li>
      </ScrollReveal>
    </ul>
</div>



</div>

        {/* Glowing Divider - Vertical (Desktop) */}
<div className="hidden md:flex items-center justify-center px-4 relative">
  <div className="w-1 h-full bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_#8b5cf6] animate-pulse" />
  <div className="absolute top-0 w-2 h-2 bg-purple-500 rounded-full shadow-md animate-ping" />
  <div className="absolute bottom-0 w-2 h-2 bg-pink-500 rounded-full shadow-md animate-ping" />
</div>

{/* Glowing Divider - Horizontal (Mobile) */}
<div className="flex md:hidden justify-center items-center py-4 relative">
  <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_#8b5cf6] animate-pulse" />
  <div className="absolute left-0 w-2 h-2 bg-blue-500 rounded-full shadow-md animate-ping" />
  <div className="absolute right-0 w-2 h-2 bg-pink-500 rounded-full shadow-md animate-ping" />
</div>


        {/* Right - Tools */}
<div className="flex-1">
  <div className="bg-gradient-to-br from-gray-800 to-blue-950 text-white p-6 rounded-xl shadow-lg">
    <h3 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
      <FaLaptopCode className="text-blue-400" /> Skills & Tools
    </h3>

    <div className="space-y-10">
      {/* Pro Skills */}
      <div>
        <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-300">
          <FaLaptopCode /> Professional Skills
        </h4>
        <div className="grid grid-cols-3 gap-3 justify-items-center">
          <ToolCard icon={SiNextdotjs} color="text-cyan-400" text="Next.js" percent={97} />
          <ToolCard
  icon={() => (
    <div className="flex gap-2 text-3xl">
      <SiReact className="text-cyan-400" />
      <SiVite className="text-purple-300" />
    </div>
  )}
  text="React + Vite"
  percent={93}
/>

          <ToolCard icon={SiMongodb} color="text-green-500" text="MongoDB" percent={90} />
          <ToolCard icon={SiFlutter} color="text-sky-400" text="Flutter" percent={80} />
          <ToolCard icon={SiExpress} color="text-gray-400" text="Express.js" percent={85} />
          <ToolCard icon={SiReact} color="text-cyan-400" text="React" percent={88} />
          <ToolCard icon={SiNodedotjs} color="text-green-600" text="Node.js" percent={87} />
          <ToolCard icon={SiFigma} color="text-pink-500" text="Figma" percent={78} />
          <ToolCard icon={FaLaptopCode} color="text-indigo-400" text="UI/UX Design" percent={75} />
        </div>
      </div>

      {/* Soft Skills */}
      <div>
        <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-yellow-300">
          <FaPeopleCarry /> Soft Skills
        </h4>
        <div className="grid grid-cols-3 gap-3 justify-items-center">
          <ToolCard icon={FaRegClock} color="text-yellow-400" text="Time Management" percent={92} />
          <ToolCard icon={FaBolt} color="text-blue-400" text="Problem Solving" percent={88} />
          <ToolCard icon={FaPeopleCarry} color="text-purple-400" text="Collaboration" percent={90} />
          <ToolCard icon={FaHandshake} color="text-red-400" text="Communication" percent={86} />
        </div>
      </div>

      {/* Design Tools */}
      <div>
        <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-pink-300">
          <FaPhotoVideo /> Graphic Design Tools
        </h4>
        <div className="grid grid-cols-3 gap-3 justify-items-center">
          <ToolCard icon={SiAdobephotoshop} color="text-blue-300" text="Photoshop" percent={87} />
          <ToolCard icon={SiAdobeillustrator} color="text-blue-300" text="Photoshop" percent={94} />
          <ToolCard icon={SiAdobepremierepro} color="text-purple-400" text="Premiere Pro" percent={75} />
          <ToolCard icon={SiCanva} color="text-blue-500" text="Canva" percent={90} />
        </div>
      </div>

      {/* CMS & Cloud */}
      <div>
        <h4 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-teal-300">
          <CgWebsite /> CMS & Cloud Tools
        </h4>
        <div className="grid grid-cols-3 gap-3 justify-items-center">
          <ToolCard icon={SiGithub} color="text-gray-300" text="Git & GitHub" percent={85} />
          <ToolCard icon={SiSanity} color="text-orange-400" text="Sanity CMS" percent={70} />
          <ToolCard icon={SiFirebase} color="text-yellow-500" text="Firebase" percent={76} />
          <ToolCard icon={SiSupabase} color="text-emerald-400" text="Supabase" percent={78} />
        </div>
      </div>
    </div>
  </div>

  <div className="mt-6 bg-gradient-to-br from-indigo-800 to-black p-5 rounded-xl shadow-md">
    <LanguageSwiper />
  </div>
</div>




      </section>

      <div className="container section text-center w-full -mt-20">
        <Certificates certificates={certificates} />
      </div>
    </>
  );
}

type ToolCardProps = {
  icon: IconType;
  text: string;
  percent: number;
  color?: string;
};

const ToolCard = ({ icon: Icon, text, percent, color = "text-purple-400" }: ToolCardProps) => (
  <div className=" cursor-target flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer select-none group w-full max-w-[100px] xs:max-w-[110px] sm:max-w-[120px] md:max-w-[140px] lg:max-w-[150px]">
    <div className="group-hover:bg-[#2a1454] w-full flex flex-col justify-center items-center gap-4 border-slate-800 group-hover:border-[#8750f7] bg-[#140b1c] px-4 py-6 border border-transparent rounded-3xl transition-all duration-500">
      <div className="group-hover:scale-110 group-hover:grayscale-0 transition-all duration-500 sm:grayscale object-contain text-3xl sm:text-4xl md:text-5xl">
        <Icon className={color} />
      </div>
      <p className="group-hover:text-purple-500 font-bold text-slate-500 text-sm sm:text-base transition-colors duration-500">
        {percent}%
      </p>
    </div>
    <p className="text-xs sm:text-sm md:text-base font-light text-cyan-200 group-hover:text-opacity-100 tracking-tight transition-colors duration-500 text-center">
      {text}
    </p>
  </div>
);






