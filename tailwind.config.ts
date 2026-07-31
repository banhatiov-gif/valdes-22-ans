import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        plum: "rgb(var(--plum-rgb) / <alpha-value>)",
        "plum-deep": "rgb(var(--plum-deep-rgb) / <alpha-value>)",
        "plum-light": "rgb(var(--plum-light-rgb) / <alpha-value>)",
        gold: "rgb(var(--gold-rgb) / <alpha-value>)",
        coral: "rgb(var(--coral-rgb) / <alpha-value>)",
        teal: "rgb(var(--teal-rgb) / <alpha-value>)",
        cream: "rgb(var(--cream-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)"],
        body: ["var(--font-manrope)"],
        mono: ["var(--font-space-mono)"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.06)" },
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(var(--drift-x, 20px), var(--drift-y, -30px), 0)" },
        },
        flicker: {
          "0%, 100%": { transform: "scaleY(1) rotate(-1deg)", opacity: "1" },
          "50%": { transform: "scaleY(1.08) rotate(1.5deg)", opacity: "0.9" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 4.5s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite alternate",
        flicker: "flicker 0.9s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
