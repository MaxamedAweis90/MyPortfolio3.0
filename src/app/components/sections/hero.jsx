"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "@/styles/hero.css";
import Socials from "@/components/socials";

const Hero = () => {
  const [baseRotation, setBaseRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    setBaseRotation((prev) => prev + 180);
  };

  const handleMouseEnter = () => {
    setTimeout(() => {
      setIsHovered(true);
    }, 100); // Small delay to prevent flickering
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section className="bg-amber-100 md:h-lvh hero section relative flex flex-col md:flex-row items-center justify-center h-full text-black px-4 md:gap-12 border-b-4 border-amber-100 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] before:content-[''] before:absolute before:bottom-[-10px] before:left-0 before:w-full before:h-6 before:bg-gradient-to-b before:from-transparent before:to-amber-100 before:opacity-50">
      {/* Flip Image Container */}
      <div
        className="flip-container md:mt-16 mt-7 relative w-full max-w-[600px] md:max-w-[600px] lg:max-w-[600px] h-[600px] md:h-[600px] lg:h-[600px] cursor-pointer"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="flip-card"
          animate={{ rotateY: baseRotation + (isHovered ? 180 : 0) }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Front Image */}
          <div className="flip-card-front">
            <img src="/Hero3DMe.png" alt="Hero Front" className="hero-image" />
          </div>
          {/* Back Image */}
          <div className="flip-card-back">
            <img src="/HeroMe.png" alt="Hero Back" className="hero-image" />
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="info w-full max-w-[600px] -mt-16 md:mt-0 flex flex-col items-start gap-4 px-4 md:px-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold flex flex-row items-center mb-3">
      <span className="lobster-two-font">👋🏼 Kore wa Mo desu</span>
        </h1>

        <p className="text-lg md:text-xl lg:text-2xl flex flex-row items-start gap-3 text-start">
          💻 <span>A passionate tech enthusiast blending coding with creativity to craft innovative solutions.</span>
        </p>

        <p className="  text-lg md:text-xl lg:text-2xl flex flex-row items-start gap-3 text-start">
          🎨 <span>Graduate of Simad University [Coming soon!], Faculty of Computing (IT). Always striving for excellence in development & design.</span>
        </p>

        <Socials />

        <div className="mt-4 md:mt-6 flex flex-wrap justify-start gap-4">
          <Link href="/about" className="inline-block">
            <button className="px-6 py-2 bg-blue-500 text-white rounded border-2 border-blue-500 hover:bg-transparent hover:text-black transition-colors text-lg md:text-xl">
              Read More
            </button>
          </Link>
          <Link href="/hire" className="inline-block">
            <button className="px-6 py-2 border-2 border-blue-500 text-black rounded hover:bg-blue-500 hover:text-white transition-colors text-lg md:text-xl">
              Hire Me
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
