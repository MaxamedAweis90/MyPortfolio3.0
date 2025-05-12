"use client";
import React, { useEffect, useState } from 'react';
import { client as sanityClient } from '../../sanity/lib/client'; // Correct import

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      const query = '*[_type == "appContext"][0]';
      const result = await sanityClient.fetch(query); // Use sanityClient.fetch instead of client.fetch
      setFooterData(result);
    };

    fetchFooterData();
  }, []);

  if (!footerData) return <p>Loading...</p>;

  return (
    <div className="footer mt-12 py-6 text-center backdrop-blur-md rounded-lg">
      <div className="container wrapper flex items-center justify-between flex-col">
        <p className="text-yellow-400">Thank you for stopping by! 👋</p>
        <p className="text-yellow-400 mt-2">Let's connect:</p>
        <div className="socials flex space-x-8 max-md:space-x-0 text-nowrap max-md:text-sm justify-center">
          {footerData.email && (
            <a href={`mailto:${footerData.email}`} className="hover:text-gray-300 text-nowrap">
              📧 Email Me
            </a>
          )}
          {footerData.socialLinks?.linkedin && (
            <a href={footerData.socialLinks.linkedin} className="hover:text-gray-300">
              🔗 Linkedin
            </a>
          )}
          {footerData.resume && (
            <a href={footerData.resume} className="hover:text-gray-300">
              📝 Resume
            </a>
          )}
          <a href="/work" className="hover:text-gray-300">
            💼 Work
          </a>
          {footerData.socialLinks?.youtube && (
            <a href={footerData.socialLinks.youtube} className="hover:text-gray-300">
              🎬 Youtube
            </a>
          )}
          {footerData.socialLinks?.instagram && (
            <a href={footerData.socialLinks.instagram} className="hover:text-gray-300">
              📸 Instagram
            </a>
          )}
        </div>
        <p className="text-white mt-4">&copy; {new Date().getFullYear()} {footerData.name}. All rights reserved. ⚡</p>
      </div>
    </div>
  );
};

export default Footer;
