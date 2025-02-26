import React from 'react';
import '@/styles/services.css'
import { FaLaptopCode, FaMobileAlt, FaPaintBrush, FaVideo } from 'react-icons/fa';

const ServiceCard = ({ bgClass, Icon, title, subtitle }) => {
  return (
    // The outer .card uses your previous styling.
    <div className={`card ${bgClass} relative`}>
      {/* e-card background overlay */}
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
      {/* (Optional) Additional content could go here */}
    </div>
  );
};

const Services = () => {
  return (
    <section className="section">
      <div className="container">
      <h2 className="section-header">My Services</h2>
        <div className="cards flex flex-col lg:flex-row gap-4 justify-center items-center">
          <ServiceCard
            bgClass="red"
            Icon={FaLaptopCode}
            title="Web Development"
            subtitle="Responsive Websites"
          />
          <ServiceCard
            bgClass="blue"
            Icon={FaMobileAlt}
            title="Mobile App Development"
            subtitle="Engaging Mobile Apps"
          />
          <ServiceCard
            bgClass="green"
            Icon={FaPaintBrush}
            title="Graphic Designing"
            subtitle="Creative Designs"
          />
          <ServiceCard
            bgClass="purple"
            Icon={FaVideo}
            title="Video Editing"
            subtitle="Professional Editing"
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
