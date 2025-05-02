// next.config.mjs
export default {
  images: {
    unoptimized: true, // Prevent Next.js from optimizing images on static export (if using Netlify/Vercel)
  },
  // If using next.js with Sanity Studio, do not use 'output: export'
};
