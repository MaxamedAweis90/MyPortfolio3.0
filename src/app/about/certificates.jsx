"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiClipboard } from "react-icons/fi"; // Importing clipboard icon
import { toast } from "react-toastify"; // Importing toast for success messages
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Certificates = ({ certificates = [] }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Code copied to clipboard!", {
        position: "top-center", // Positioning the toast at the top-center of the screen
        autoClose: 2000, // Auto-close after 2 seconds
        hideProgressBar: true,
        theme: "colored", // The toast will have a colored theme
      });
    });
  };

  return (
    <div className="Certificates mt-12 px-4">
      <motion.h2
        className="section-header mb-8 text-2xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        My Certificates
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => {
          const imageUrl = cert.imageRef?.image?.asset?.url;
          const isLatest = index === 0;
          const verificationCode = cert.verificationCode; // Accessing verification code
          const ref = useRef(null);
          const isInView = useInView(ref, { once: false, margin: "-100px" });

          return (
            <motion.div
              key={cert._id}
              ref={ref}
              className="block rounded-lg overflow-hidden shadow-lg bg-amber-100"
              variants={fadeUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="relative">
                {isLatest && (
                  <span className="absolute top-2 left-2 bg-amber-400 text-black text-xs font-semibold uppercase px-2 py-1 rounded">
                    Latest
                  </span>
                )}
                <div className="aspect-w-16 aspect-h-9">
                  {imageUrl ? (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <img
                        src={imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 text-left">
                <h3 className="font-semibold text-lg">{cert.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Issued by <strong>{cert.issuer}</strong>
                </p>

                <div className="mt-3 flex items-center space-x-2">
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors text-sm"
                    >
                      Verify
                    </a>
                  )}

                  {/* Conditionally display the Verification Code and Copy Button */}
                  {verificationCode && (
  <div className="flex items-center space-x-4 ">
    <p className="text-sm font-semibold text-gray-700">Credential ID:</p>
    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-sm">
      <code className="text-sm font-mono text-gray-800">{verificationCode}</code>
      <button
        onClick={() => handleCopy(verificationCode)}
        className="flex items-center justify-center p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <FiClipboard className="w-5 h-5" />
      </button>
    </div>
  </div>
)}

                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Certificates;
