"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FiClipboard } from "react-icons/fi";
import { toast } from "react-toastify";
import type { Certificate } from "@/types/portfolio";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

type CertificateCardProps = {
  cert: Certificate;
  index: number;
};

export default function CertificateCard({ cert, index }: CertificateCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const imageSrc = cert.imageUrl;
  const showCardState = isMobile || isInView;

  return (
    <motion.div
      ref={ref}
      className="rounded-xl overflow-hidden shadow-md bg-surface border border-borderSubtle hover:border-brandAccent/50 hover:shadow-xl transition-all duration-300 text-primaryText"
      variants={fadeUpVariants}
      initial={isMobile ? "visible" : "hidden"}
      animate={showCardState ? "visible" : "hidden"}
      transition={{ duration: 0.6, delay: isMobile ? 0 : index * 0.1 }}
    >
      <div className="relative">
        {isLatest && (
          <span className="absolute top-3 left-3 bg-brandAccent text-white text-xs font-bold uppercase px-2.5 py-1 rounded-full shadow-md z-10">
            Latest
          </span>
        )}
        <div className="aspect-w-full aspect-h-9">
          {imageSrc ? (
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative"
            >
              <Image
                src={imageSrc}
                alt={`Certificate: ${cert.title}`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
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
        <h3 className="font-bold text-lg text-primaryText">{cert.title}</h3>
        <p className="text-sm text-mutedText mt-1">
          Issued by <strong className="text-primaryText">{cert.issuer}</strong>{" "}
          {cert.issuedDate && (
            <span className="text-xs text-mutedText/80 ml-1">
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
              className="inline-block px-4 py-2 border border-brandAccent text-brandAccent rounded-lg hover:bg-brandAccent hover:text-white transition-colors text-sm font-semibold"
            >
              Verify
            </a>
          )}

          {cert.verificationCode && (
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-mutedText">
                ID:
              </p>
              <div className="flex items-center space-x-2 bg-mainBg border border-borderSubtle px-3 py-1.5 rounded-lg shadow-sm">
                <code className="text-xs font-mono text-primaryText">
                  {cert.verificationCode}
                </code>
                <button
                  onClick={() =>
                    cert.verificationCode && handleCopy(cert.verificationCode)
                  }
                  className="p-1 bg-brandAccent text-white rounded hover:bg-secondaryAccent transition-colors duration-200"
                  aria-label="Copy Credential ID"
                >
                  <FiClipboard className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
