"use client";
import React, { useEffect, useRef } from "react";
import {
  RiGlobalLine,
  RiSmartphoneLine,
  RiServerLine,
  RiArrowRightLine,
  RiCheckLine,
} from "react-icons/ri";

const Services = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const servicesData = [
    {
      id: "web-dev",
      title: "Web Application Development",
      subtitle: "Full-Stack Web Architecture",
      icon: <RiGlobalLine className="text-3xl text-brandAccent" />,
      accentColor: "from-brandAccent/20 to-sky-500/10",
      borderColor: "hover:border-brandAccent/60",
      badgeColor: "bg-brandAccent/10 text-brandAccent border-brandAccent/30",
      tags: ["Next.js 15", "TypeScript", "TailwindCSS", "REST / GraphQL"],
      features: [
        "High-performance SSR & SSG web architectures",
        "Responsive glassmorphic UI/UX interfaces",
        "Core Web Vitals & SEO optimization",
      ],
      projectType: "Web Development",
      defaultTitle: "Web Application Project",
      defaultMessage:
        "Hi Eng_Aweis, I am interested in your Web Application Development service.",
    },
    {
      id: "mobile-dev",
      title: "Mobile App Development",
      subtitle: "Cross-Platform Mobile Products",
      icon: <RiSmartphoneLine className="text-3xl text-secondaryAccent" />,
      accentColor: "from-secondaryAccent/20 to-blue-600/10",
      borderColor: "hover:border-secondaryAccent/60",
      badgeColor:
        "bg-secondaryAccent/10 text-secondaryAccent border-secondaryAccent/30",
      tags: ["React Native", "Flutter", "iOS & Android", "Redux / Zustand"],
      features: [
        "Native performance cross-platform iOS & Android apps",
        "Offline-first architecture & push notifications",
        "Intuitive gestures & smooth UI animations",
      ],
      projectType: "Mobile Development",
      defaultTitle: "Mobile App Project",
      defaultMessage:
        "Hi Eng_Aweis, I am interested in your Mobile App Development service.",
    },
    {
      id: "system-arch",
      title: "System Architecture & APIs",
      subtitle: "Scalable Backend & Cloud Systems",
      icon: <RiServerLine className="text-3xl text-cyan-400" />,
      accentColor: "from-cyan-500/20 to-teal-500/10",
      borderColor: "hover:border-cyan-400/60",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-400/30",
      tags: [
        "Node.js / Express",
        "PostgreSQL",
        "Database Design",
        "Cloud Infrastructure",
      ],
      features: [
        "Secure API design & database query optimization",
        "Microservices & enterprise workflow systems",
        "High-concurrency backend stability & security",
      ],
      projectType: "Software Engineering",
      defaultTitle: "Enterprise System Project",
      defaultMessage:
        "Hi Eng_Aweis, I am interested in your System Architecture & API service.",
    },
  ];

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
            }

            // Trigger Anime.js animations ONCE cleanly on desktop (>= 768px)
            if (typeof window !== "undefined" && (window as any).anime) {
              const anime = (window as any).anime;

              // Header animation
              anime({
                targets: ".services-header-anim",
                translateY: [35, 0],
                opacity: [0, 1],
                duration: 700,
                easing: "easeOutQuad",
              });

              // Cards staggered entrance animation
              anime({
                targets: ".service-card-item",
                translateY: [45, 0],
                opacity: [0, 1],
                scale: [0.96, 1],
                delay: anime.stagger(140, { start: 100 }),
                duration: 750,
                easing: "easeOutQuad",
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = (service: (typeof servicesData)[0]) => {
    // Dispatch event to pre-fill project request form
    window.dispatchEvent(
      new CustomEvent("select-project-type", {
        detail: {
          projectType: service.projectType,
          defaultTitle: service.defaultTitle,
          defaultMessage: service.defaultMessage,
        },
      }),
    );
    // Smooth scroll down to contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMouseEnter = (cardId: string) => {
    if (typeof window !== "undefined" && (window as any).anime) {
      const anime = (window as any).anime;
      anime({
        targets: `#icon-${cardId}`,
        scale: [1, 1.18],
        rotate: [0, 8],
        duration: 350,
        easing: "easeOutBack",
      });
    }
  };

  const handleMouseLeave = (cardId: string) => {
    if (typeof window !== "undefined" && (window as any).anime) {
      const anime = (window as any).anime;
      anime({
        targets: `#icon-${cardId}`,
        scale: 1,
        rotate: 0,
        duration: 300,
        easing: "easeOutQuad",
      });
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 px-4 sm:px-8 lg:px-16 bg-none border-b border-borderSubtle relative overflow-hidden"
    >
      {/* Background ambient lighting aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brandAccent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="services-header-anim text-center max-w-2xl mx-auto mb-16 opacity-100 md:opacity-0 space-y-3">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brandAccent">
            What I Offer
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-primaryText tracking-tight">
            Specialized Engineering Services
          </h2>
          <p className="text-mutedText text-sm sm:text-base leading-relaxed">
            Delivering scalable full-stack applications, cross-platform mobile
            apps, and enterprise system architectures crafted with precision.
          </p>
        </div>

        {/* 3 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className={`service-card-item opacity-100 md:opacity-0 bg-surface/90 backdrop-blur-md border border-borderSubtle ${service.borderColor} rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl relative group transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden`}
              onClick={() => handleCardClick(service)}
              onMouseEnter={() => handleMouseEnter(service.id)}
              onMouseLeave={() => handleMouseLeave(service.id)}
            >
              {/* Subtle card hover background gradient glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative z-10 space-y-6">
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div
                    id={`icon-${service.id}`}
                    className="p-3.5 rounded-2xl bg-mainBg border border-borderSubtle shadow-inner"
                  >
                    {service.icon}
                  </div>
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${service.badgeColor}`}
                  >
                    {service.subtitle}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-primaryText group-hover:text-brandAccent transition-colors">
                    {service.title}
                  </h3>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-mainBg/80 border border-borderSubtle/60 text-mutedText"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Key Feature Bullets */}
                <ul className="space-y-2.5 pt-2 border-t border-borderSubtle/60">
                  {service.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-primaryText/90 font-medium"
                    >
                      <span className="p-0.5 rounded-full bg-brandAccent/20 text-brandAccent mt-0.5 shrink-0">
                        <RiCheckLine className="text-xs" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer CTA Button */}
              <div className="relative z-10 pt-6 mt-6 border-t border-borderSubtle/50 flex items-center justify-between text-brandAccent font-extrabold text-sm group-hover:text-white transition-colors">
                <span>Request Project</span>
                <span className="p-2 rounded-full bg-mainBg border border-borderSubtle group-hover:bg-brandAccent group-hover:border-brandAccent transition-all duration-300 group-hover:translate-x-1">
                  <RiArrowRightLine className="text-base" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
