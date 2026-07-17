import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        card: "#131313",
        card2: "#101010",
        border: "#262626",
        text: "#F2F2F2",
        "text-muted": "#9A9A9A",
        "text-dim": "#6B6B6B",
        accent: {
          DEFAULT: "#9B80FF",
          dark: "#7C5CFF",
          soft: "rgba(155,128,255,0.12)",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
