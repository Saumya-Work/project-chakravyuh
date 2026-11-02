import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: "#090D16",
          surface: "#0F1624",
          card: "#141D2F",
          elevated: "#1A263D",
          border: "#22314E",
          teal: "#0EA5E9",
          cyan: "#14B8A6",
          amber: "#F59E0B",
          emerald: "#10B981",
          rose: "#EF4444",
          muted: "#94A3B8"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;

