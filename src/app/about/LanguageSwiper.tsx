import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwiperMotion = () => {
  type Language = {
    name: string;
    flag: string;
    proficiency: string;
  };

  const languages: Language[] = [
    {
      name: "Somali",
      flag: "https://cdn.sanity.io/images/yf7fdygw/production/15cf319492ff27593cdbf23cba4477452e6b6053-900x600.svg",
      proficiency: "Native",
    },
    {
      name: "English",
      flag: "https://cdn.sanity.io/images/yf7fdygw/production/185cc04330ab35086485332ad93a27cfce298a01-4693x2470.gif",
      proficiency: "Fluent",
    },
    {
      name: "Arabic",
      flag: "https://cdn.sanity.io/images/yf7fdygw/production/5349f152eed497f696305d83fad7927e3ecf7477-1600x1067.png",
      proficiency: "Fluent",
    },
    {
      name: "Japanese",
      flag: "https://cdn.sanity.io/images/yf7fdygw/production/2258514b4b9dc5fdcf8be8aefba40c858760a906-4685x3123.jpg",
      proficiency: "Basic",
    }
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Slide to the left
      setIndex((prev) => (prev + 1) % languages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [languages.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full  mx-auto  overflow-hidden">
        <h3 className="text-3xl font-extrabold text-white mb-4 text-center flex items-center  justify-center">
               Languages I speak
            </h3>
      <div className="relative h-[15.3rem]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={languages[index].name}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="w-full h-full flex flex-col items-center justify-center bg-black/50 p-0 rounded-xl shadow-lg"
          >
            <img
              src={languages[index].flag}
              alt={languages[index].name}
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <h4 className="text-2xl text-white font-semibold mb-2">{languages[index].name}</h4>
            <p className="text-white text-lg">{languages[index].proficiency}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LanguageSwiperMotion;
