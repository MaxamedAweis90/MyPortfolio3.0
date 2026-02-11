// app/components/CertificateCard.jsx
"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiClipboard } from "react-icons/fi";
import { toast } from "react-toastify";
import type { Certificate } from "@/types/sanity";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

type CertificateCardProps = {
  cert: Certificate;
  index: number;
};

export default function CertificateCard({ cert, index }: CertificateCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const isLatest = index === 0;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Code copied to clipboard!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    });
  };

  return (
    <motion.div
      ref={ref}
      className="rounded-lg overflow-hidden shadow-lg bg-amber-100"
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
        <div className="aspect-w-full aspect-h-9">
          {cert.imageRef?.image?.asset?.url ? (
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={cert.imageRef.image.asset.url}
                alt={`Certificate: ${cert.title}`}
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
          Issued by <strong>{cert.issuer}</strong>{" "}
          {cert.issuedDate && (
            <span className="text-xs text-gray-500 ml-1">
              ({formatDate(cert.issuedDate)})
            </span>
          )}
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

          {cert.verificationCode && (
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-gray-700">
                Credential ID:
              </p>
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg shadow-sm">
                <code className="text-sm font-mono text-gray-800">
                  {cert.verificationCode}
                </code>
                <button
                  onClick={() =>
                    cert.verificationCode && handleCopy(cert.verificationCode)
                  }
                  className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  aria-label="Copy Credential ID"
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
}
