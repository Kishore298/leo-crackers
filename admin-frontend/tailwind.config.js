/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#111111",
        "surface-2": "#1A1A1A",
        primary: {
          DEFAULT: "#ff6600",
          dark: "#8b0000",
          light: "#ffcc33",
        },
        accent: {
          DEFAULT: "#ffcc33",
          light: "#ffe066",
        },
        border: "#333333",
        flame: "#ff6600",
        text: {
          DEFAULT: "#F5F5F5",
          secondary: "#BDBDBD",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        primary: "0 4px 14px rgba(255, 102, 0, 0.25)",
        "primary-lg": "0 8px 32px rgba(139, 0, 0, 0.4)",
        golden: "0 8px 30px rgba(255, 204, 51, 0.15)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "fire-gradient": "linear-gradient(140deg, #8b0000, #ff6600, #ffcc33)",
        "fire-gradient-hover": "linear-gradient(140deg, #6B0500, #cc5200, #e6b800)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease forwards",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 5px rgba(255, 102, 0, 0.5))" },
          "50%": { opacity: "0.8", filter: "drop-shadow(0 0 15px rgba(255, 102, 0, 0.8))" },
        },
      },
    },
  },
  plugins: [],
};