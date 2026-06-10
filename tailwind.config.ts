import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: {
          base: "#0a0a0f",
          card: "rgba(255, 255, 255, 0.05)",
        },
        neon: {
          blue: "#00d4ff",
          purple: "#8b5cf6",
        },
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        "particle-drift": "drift 20s infinite linear",
        "aurora-blob-1": "aurora-blob-1 20s ease-in-out infinite",
        "aurora-blob-2": "aurora-blob-2 25s ease-in-out infinite",
        "aurora-blob-3": "aurora-blob-3 18s ease-in-out infinite",
        "aurora-blob-4": "aurora-blob-4 22s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-20px) translateX(10px)" },
          "50%": { transform: "translateY(-10px) translateX(-10px)" },
          "75%": { transform: "translateY(-30px) translateX(5px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
        "aurora-blob-1": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "33%": { transform: "translate(15%, 20%) scale(1.1)" },
          "66%": { transform: "translate(-5%, 10%) scale(0.95)" },
        },
        "aurora-blob-2": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "25%": { transform: "translate(-20%, 10%) scale(1.05)" },
          "50%": { transform: "translate(-10%, -15%) scale(1.1)" },
          "75%": { transform: "translate(5%, -5%) scale(0.95)" },
        },
        "aurora-blob-3": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "30%": { transform: "translate(10%, -20%) scale(1.05)" },
          "60%": { transform: "translate(-15%, -10%) scale(1.1)" },
        },
        "aurora-blob-4": {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "40%": { transform: "translate(-10%, 15%) scale(1.08)" },
          "70%": { transform: "translate(10%, -10%) scale(0.92)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
