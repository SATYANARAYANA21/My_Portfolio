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
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        jp: ["var(--font-jp)"],
        mono: ["var(--font-mono)"],
        comic: ["var(--font-comic)"],
        light: ["var(--font-light)"],
      },
      letterSpacing: {
        tighter2: "-0.04em",
        tightest: "-0.06em",
        ultrawide: "0.15em",
      },
      fontSize: {
        "step--2": "clamp(0.69rem, calc(0.66rem + 0.18vw), 0.80rem)",
        "step--1": "clamp(0.83rem, calc(0.78rem + 0.29vw), 1.00rem)",
        "step-0": "clamp(1.00rem, calc(0.91rem + 0.43vw), 1.25rem)",
        "step-1": "clamp(1.20rem, calc(1.07rem + 0.63vw), 1.56rem)",
        "step-2": "clamp(1.44rem, calc(1.26rem + 0.89vw), 1.95rem)",
        "step-3": "clamp(1.73rem, calc(1.48rem + 1.24vw), 2.44rem)",
        "step-4": "clamp(2.07rem, calc(1.73rem + 1.70vw), 3.05rem)",
        "step-5": "clamp(2.49rem, calc(2.03rem + 2.31vw), 3.82rem)",
        display: "clamp(4rem, 12vw, 10rem)",
      },
      animation: {
        "word-rise": "wordRise 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "curtain-l": "curtainL 0.9s cubic-bezier(0.76,0,0.24,1) both",
        "curtain-r": "curtainR 0.9s cubic-bezier(0.76,0,0.24,1) both",
        "seam-out": "seamOut 0.9s cubic-bezier(0.76,0,0.24,1) both",
      },
      keyframes: {
        wordRise: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        curtainL: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        curtainR: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        seamOut: {
          "0%": { opacity: "1", transform: "scaleY(1)" },
          "100%": { opacity: "0", transform: "scaleY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
