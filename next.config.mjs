// next.config.mjs
export default {
    output: 'export', // Enables static export for Netlify
    images: {
      unoptimized: true, // Fixes issues with Next.js images on Netlify
    },
  };
  