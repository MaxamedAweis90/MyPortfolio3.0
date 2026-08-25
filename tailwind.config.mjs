/** @type {import('tailwindcss').Config} */
const config = {
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
        // Dark mode defaults (mytheme)
        mainBg: "var(--color-mainBg)",
        surface: "var(--color-surface)",
        borderSubtle: "var(--color-borderSubtle)",
        primaryText: "var(--color-primaryText)",
        mutedText: "var(--color-mutedText)",
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

export default config;
