"use client";
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import { motion } from "framer-motion";
import '@/styles/about.css';
import { GoGoal } from "react-icons/go";
import { IoCreate } from "react-icons/io5";
import { FaPause, FaPlay, FaRegEye } from 'react-icons/fa';
import { LucideVerified } from 'lucide-react';
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import Certificates from './certificates';

const Page = () => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <>
      <section className="topvideo overflow-hidden  bg-amber-100 md:h-lvh h-50 hero section relative flex flex-col items-center justify-center text-black px-4 md:gap-12 border-b-4 border-amber-100 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] before:content-[''] before:absolute before:bottom-[-10px] before:left-0 before:w-full before:h-6 before:bg-gradient-to-b before:from-transparent before:to-amber-100 before:opacity-50">
        <div className="video-container">
          <ReactPlayer
            ref={playerRef}
            url="https://youtu.be/cVsY9-SPrRc"
            playing={isPlaying}
            muted={isMuted}
            controls={false}
            width="100%"
            height="100%"
            className="video-element"
          />
          <div className="video-overlay">
            <h2 className="intro-text">The Intro</h2>
            <button onClick={toggleMute} className="sound-control">
              {isMuted ? <GiSpeakerOff /> : <GiSpeaker />}
            </button>
            <button onClick={togglePlayPause} className="play-control">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>
        </div>
        <div className="scroll-container">
          <div className="mouse">
            <span className="scroll-ball"></span>
          </div>
          <div className="chevrons">
            <div className="chevrondown"></div>
            <div className="chevrondown"></div>
          </div>
        </div>
      </section>
      <div className="container section text-center w-full mt-0">
        <div className="about-container">
          <div className="leftside">
            <img src="./myProfile.png" alt="" className="profilepic" />
            <h2>A BRIEF ABOUT ME</h2>
            <h1 className="space-x-2">
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
              <span>I'm, Mohamed Aweys</span>
            </h1>
            <div className="info">
              <p>
                a passionate <strong>developer, designer, and tech enthusiast</strong> with a strong focus on
                building seamless digital experiences. As an <strong>IT student at SIMAD University</strong>,
                I constantly seek new challenges and opportunities to refine my skills in <strong>web
                and mobile development, UI/UX design, and problem-solving.</strong>
              </p>
              <h2 className='flex gap-2 items-center '><IoCreate /> <u>What I Do</u></h2>
              <p>
                I specialize in the <strong>MERN stack</strong> (MongoDB, Express, React, Node.js) for building scalable and efficient web applications.
                I’m currently in progress with <strong>mobile app development using Flutter</strong>, working on creating cross-platform applications that offer smooth user experiences. <br />
                Beyond development, I bring creativity to the table through <strong>graphic design and video editing</strong>, creating visually appealing content that enhances user engagement and brand identity.
              </p>
              <h2 className='flex gap-2 items-center '><FaRegEye /><u>Vision</u></h2>
              <p>
                To <strong>innovate and create impactful digital solutions</strong> that improve efficiency,
                enhance user experiences, and simplify everyday tasks through <strong>cutting-edge technology and design.</strong>
              </p>
              <h2 className='flex gap-2 items-center '><GoGoal /> <u>Mission</u></h2>
              <p>
                🔹 <strong>Build high-quality web and mobile applications</strong> that solve real-world problems. <br />
                🔹 <strong>Enhance user experiences</strong> with intuitive UI/UX design and engaging visuals. <br />
                🔹 <strong>Continuously learn and adapt</strong> to emerging technologies. <br />
                🔹 <strong>Empower brands and individuals</strong> through creative graphic design and video editing.
              </p>
              <h2 className='flex gap-2 items-center '><LucideVerified /> <u>Values</u></h2>
              <p>
                🚀 <strong>Innovation</strong> → Always pushing boundaries to explore new possibilities.<br />
                🎯 <strong>Excellence</strong> → Striving for high-quality work in everything I create.<br />
                🔗 <strong>Collaboration</strong> → Believing in teamwork and knowledge-sharing to drive success.<br />
                📈 <strong>Growth</strong> → Constantly learning and improving to stay ahead in the ever-evolving tech world.
              </p>
            </div>
          </div>
          <div className="rightside">
            <div className="boxes">yes</div>
            <div className="recBox">ggg</div>
          </div>
        </div>
       
       {/* Certificates */}
       < Certificates />

       
      </div>
    </>
  );
};

export default Page;
