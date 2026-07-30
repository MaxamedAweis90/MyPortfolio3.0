import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/mageui/**/*.{js,ts,jsx,tsx}",
    "./node_modules/daisyui/dist/**/*.js",
    "./node_modules/daisyui/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        mainBg: "#11161D",
        surface: "#1D2631",
        borderSubtle: "#2C394B",
        primaryText: "#E2E8F0",
        mutedText: "#94A3B8",
        brandAccent: "#0B82EC",
        secondaryAccent: "#3B82F6",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#0B82EC",
          secondary: "#3B82F6",
          accent: "#2C394B",
          neutral: "#1D2631",
          "base-100": "#11161D",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
      "dark",
      "light",
    ],
  },
};
