"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "@/styles/services.css";
import { FaLaptopCode, FaMobileAlt, FaPaintBrush, FaVideo } from "react-icons/fa";
import type { IconType } from "react-icons";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

type ServiceCardProps = {
  bgClass: string;
  Icon: IconType;
  title: string;
  subtitle: string;
  delay?: number;
};

const ServiceCard = ({ bgClass, Icon, title, subtitle, delay = 0 }: ServiceCardProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="card"
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.6, delay }}
    >
      <div className="flip-inner">
        {/* FRONT */}
        <div className={`flip-front ${bgClass}`}>
          <div className="e-card playing">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="infotop">
              <Icon className="icon" />
              <br />
              {title}
              <br />
              <div className="name">{subtitle}</div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className=' flip-back'>
          <h4>{title}</h4>
          <p>
            We provide {title.toLowerCase()} tailored to your needs — scalable, performant, and modern.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => (
  <section className="section">
    <div className="container text-center">
      <motion.h2
        className="section-header"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        My Services
      </motion.h2>

      <div className="cards flex flex-col lg:flex-row gap-4 justify-center items-center">
        <ServiceCard bgClass="red" Icon={FaLaptopCode} title="Web Development" subtitle="Responsive Websites" delay={0.1} />
        <ServiceCard bgClass="blue" Icon={FaMobileAlt} title="Mobile App Development" subtitle="Engaging Mobile Apps" delay={0.2} />
        <ServiceCard bgClass="green" Icon={FaPaintBrush} title="Graphic Designing" subtitle="Creative Designs" delay={0.3} />
        <ServiceCard bgClass="purple" Icon={FaVideo} title="Video Editing" subtitle="Professional Editing" delay={0.4} />
      </div>
    </div>
  </section>
);

export default Services;
