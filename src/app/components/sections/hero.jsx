"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import "@/styles/hero.css";
import Socials from "@/components/socials";
import { client as sanityClient } from "../../sanity/lib/client";
import { FaExternalLinkAlt } from "react-icons/fa";

const Hero = () => {
  const [baseRotation, setBaseRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [footerData, setFooterData] = useState(null);
  useEffect(() => {
    const fetchFooterData = async () => {
      const query = '*[_type == "appContext"][0]';
      const result = await sanityClient.fetch(query);
      setFooterData(result);
    };
    fetchFooterData();
  }, []);

  // Ref and InView detection
  const flipRef = useRef(null);
  const infoRef = useRef(null);
  const isFlipInView = useInView(flipRef, { once: false, margin: "-100px" });
  const isInfoInView = useInView(infoRef, { once: false, margin: "-100px" });

  const handleClick = () => setBaseRotation((prev) => prev + 180);
  const handleMouseEnter = () => setTimeout(() => setIsHovered(true), 100);
  const handleMouseLeave = () => setIsHovered(false);

  if (!footerData) return null;

  return (
    <div className="bg-amber-100 md:h-lvh hero section relative border-b-4 border-amber-100 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] before:content-[''] before:absolute before:bottom-[-10px] before:left-0 before:w-full before:h-6 before:bg-gradient-to-b before:from-transparent before:to-amber-100 before:opacity-50">
      <section className="flex flex-col-reverse md:flex-row items-center justify-center h-full text-black px-4 md:gap-12">

        {/* Flip Image Container */}
        <motion.div
          ref={flipRef}
          className="flip-container md:mt-16 mt-0 relative w-full max-w-[600px] h-[600px] cursor-pointer"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, x: -100 }}
          animate={isFlipInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="flip-card"
            animate={{ rotateY: baseRotation + (isHovered ? 180 : 0) }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <div className="flip-card-front">
              <img src="/Hero3DMe.png" alt="Hero Front" className="hero-image" />
            </div>
            <div className="flip-card-back">
              <img src="/HeroMe.png" alt="Hero Back" className="hero-image" />
            </div>
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          ref={infoRef}
          className="info w-full max-w-[600px] md:mt-16 mt-32 flex flex-col items-center md:items-start gap-4 px-4 md:px-0"
          initial={{ opacity: 0, x: 100 }}
          animate={isInfoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold flex flex-row items-center mb-3">
            <motion.span
              style={{ display: "inline-block", transformOrigin: "bottom" }}
              animate={{ rotate: [-20, 20, -20, 20, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            >
              👋🏼
            </motion.span>
            <span className="lobster-two-font ml-2">Watashi wa Mo desu</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-start">
            💻 A passionate tech enthusiast blending coding with creativity to craft innovative solutions.
          </p>

          <p className="text-lg md:text-xl lg:text-2xl text-start">
            🎨 Graduate of Simad University [Coming soon!], Faculty of Computing (IT). Always striving for excellence in development & design.
          </p>

          <div className="links flex w-full flex-col-reverse md:gap-3 gap-2">
            <Socials socialLinks={footerData.socialLinks} name={footerData.name} />
          </div>

          <div className="mt-4 md:mt-6 flex flex-wrap gap-14 md:gap-4 items-center w-full">
            <Link href="/work" className="inline-block">
              <button className="cursor-target px-6 py-2 bg-blue-500 text-white rounded border-2 border-blue-500 hover:bg-transparent hover:text-black transition-colors text-lg md:text-xl">
                Work Done
              </button>
            </Link>
            {footerData.resume && (
              <Link
                href={footerData.resume}
                className="inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="cursor-target flex items-center gap-1 px-3 py-2 border-2 border-blue-500 text-black rounded hover:bg-blue-500 hover:text-white transition-colors text-lg md:text-xl">
                  Resume <FaExternalLinkAlt />
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* Scroll Cue */}
      <motion.div
        className="scroll-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="mouse">
          <span className="scroll-ball"></span>
        </div>
        <div className="chevrons">
          <div className="chevrondown"></div>
          <div className="chevrondown"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
