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
        background: "var(--background)",
        foreground: "var(--foreground)",
        wine: {
          50: "#fdf2f4",
          100: "#fce7ea",
          200: "#f8cfd6",
          300: "#f1a8b5",
          400: "#e67389",
          500: "#d64563",
          600: "#b92b4a",
          700: "#9c1d3a",
          800: "#831a33",
          900: "#70172d",
          950: "#440816",
          DEFAULT: "#821832",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
