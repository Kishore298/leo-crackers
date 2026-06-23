/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D90429", // Festive Red
          dark: "#8D0801", // Deep Red
          light: "#EF233C", // Bright Red
        },
        accent: {
          DEFAULT: "#FFB703", // Sparkle Gold
          light: "#FFD166", // Bright Gold
        },
        surface: {
          DEFAULT: "#FFF9F0", // Warm Cream
          2: "#FFF0DF", // Darker Cream
        },
        border: "#FDE2CD",
        flame: "#FFB703", // keep flame for backwards compatibility with previous code
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        primary: "0 4px 14px rgba(141, 8, 1, 0.35)",
        "primary-lg": "0 8px 32px rgba(141, 8, 1, 0.25)",
      },
      backgroundImage: {
        "fire-gradient": "linear-gradient(140deg, #8D0801, #D90429, #FFB703)",
        "fire-gradient-hover":
          "linear-gradient(140deg, #6B0500, #BA0322, #E5A302)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease",
        "bounce-subtle": "bounceSubtle 1s ease infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};