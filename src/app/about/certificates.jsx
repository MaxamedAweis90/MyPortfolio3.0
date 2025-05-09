// app/components/Certificates.jsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';

const vp = { once: false, amount: 0.3 };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Certificates() {
  return (
    <div className="Certificates mt-12">
      <h2 className="section-header mb-8">My Certificates</h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        variants={containerVariants}
      >
        {[1, 2, 3].map(n => (
          <motion.div
            key={n}
            className="bg-white rounded-lg overflow-hidden shadow hover:scale-105 transition-transform"
            variants={itemVariants}
          >
            <img
              src={`https://via.placeholder.com/400x250?text=Certificate+${n}`}
              alt={`Certificate ${n}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-left">
              <h3 className="font-semibold text-lg">Certificate {n}</h3>
              <p className="text-sm text-gray-600 mt-1">Issued by XYZ Academy</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
