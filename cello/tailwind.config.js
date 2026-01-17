/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D9488",
        secondary: "#14B8A6",

        // Fun / onboarding colors
        funOrange: "#F59E42",
        funTeal: "#14B8A6",
        funPink: "#F472B6",
        funBlue: "#3B82F6",

        // Subject colors
        biology: "#10B981",
        chemistry: "#8B5CF6",
        physics: "#3B82F6",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        gradient: "gradient 6s ease infinite",
      },
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        baloo: ["Baloo 2", "cursive"],
      },
    },
  },
  plugins: [],
};
