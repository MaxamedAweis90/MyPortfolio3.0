"use client";
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  blurStrength = 4,
  rotation = 3,
  animationEnd = "bottom bottom"
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const lines = el.querySelectorAll('.reveal-line');

    // Fade in lines
    gsap.fromTo(
      lines,
      { opacity: baseOpacity },
      {
        opacity: 1,
        stagger: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=20%',
          end: animationEnd,
          scrub: true,
        },
      }
    );

    // Blur lines
    if (enableBlur) {
      gsap.fromTo(
        lines,
        { filter: `blur(${blurStrength}px)` },
        {
          filter: 'blur(0px)',
          stagger: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=20%',
            end: animationEnd,
            scrub: true,
          },
        }
      );
    }

    // Rotate parent slightly
    gsap.fromTo(
      el,
      { rotate: rotation, transformOrigin: 'left center' },
      {
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [baseOpacity, blurStrength, enableBlur, rotation, animationEnd]);

  return (
    <div ref={containerRef} className="space-y-4">
      {React.Children.map(children, (child, i) =>
        <div key={i} className="reveal-line will-change-auto">{child}</div>
      )}
    </div>
  );
};

export default ScrollReveal;
