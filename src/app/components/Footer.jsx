"use client";
import React from 'react';

const Footer = () => {
  return (
    <>
    <div className=" footer mt-12 py-6 text-center backdrop-blur-md rounded-lg">
      <div className="container wrapper flex items-center justify-between flex-col">
        <p className="text-yellow-400">Thank you for stopping by! 👋</p>
        <p className="text-yellow-400 mt-2">Let's connect:</p>
        <div className=" socials flex  space-x-8 max-md:space-x-0 text-nowrap max-md:text-sm  justify-center">
          <a href="mailto:maxamedaweys90@gmail.com" className="hover:text-gray-300 text-nowrap">📧 Email Me</a>
          <a href="https://www.linkedin.com/in/eng-aweis?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BCT9ZMeRSSWyt1kj4vYCoHw%3D%3D" className="hover:text-gray-300">🔗 Linkedin</a>
          <a href="/resume.pdf" className="hover:text-gray-300">📝 Resume</a>
          <a href="/work" className="hover:text-gray-300">💼 Work</a>
          <a href="https://youtube.com/@eng_aweis" className="hover:text-gray-300">🎬 Youtube</a>
          <a href="https://www.instagram.com/yourprofile" className="hover:text-gray-300">📸 Instagram</a>
        </div>
        <p className="text-white mt-4">&copy; {new Date().getFullYear()} EngAweis. All rights reserved. ⚡</p>
      </div>
    </div>
    </>
  );
};

export default Footer;
