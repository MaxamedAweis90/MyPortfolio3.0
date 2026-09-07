import sharedConfig from "@portfolio/config/tailwind";

/** @type {import('tailwindcss').Config} */
const config = {
  ...sharedConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/daisyui/dist/**/*.js",
    "./node_modules/daisyui/**/*.js",
  ],
};

export default config;
