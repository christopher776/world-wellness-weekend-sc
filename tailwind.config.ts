import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B2545",
          50: "#EEF2F7",
          100: "#D6E0EC",
          400: "#3A5A82",
          600: "#16345C",
          800: "#0B2545",
          900: "#071A33",
        },
        gold: {
          DEFAULT: "#B8912F",
          50: "#FBF6E9",
          100: "#F3E6C1",
          400: "#C9A227",
          600: "#B8912F",
          700: "#96741F",
        },
        cream: {
          DEFAULT: "#FAF6EE",
          100: "#FFFDF8",
          200: "#F4ECDB",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
