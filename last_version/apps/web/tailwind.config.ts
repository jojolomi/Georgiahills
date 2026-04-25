import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./messages/**/*.{js,ts,jsx,tsx,mdx,json}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f172a",
          accent: "#2563eb"
        }
      }
    }
  },
  plugins: []
};

export default config;
