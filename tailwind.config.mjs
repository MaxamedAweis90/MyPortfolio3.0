import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/mageui/**/*.{js,ts,jsx,tsx}", // � Add this line
    "./node_modules/daisyui/dist/**/*.js",
    "./node_modules/daisyui/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
      
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#3b82f6",
          secondary: "#f59e0b",
          accent: "#10b981",
          neutral: "#111827",
          "base-100": "#ffffff",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "light",
      "dark",
    ],
  },
};
