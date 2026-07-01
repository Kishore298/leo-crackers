/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: {
          DEFAULT: "#111111", // Cards
          2: "#1A1A1A", // Secondary Cards
        },
        primary: {
          DEFAULT: "#ff6600", // Orange
          dark: "#8b0000", // Dark Maroon
        },
        accent: {
          DEFAULT: "#ffcc33", // Gold
        },
        text: {
          DEFAULT: "#F5F5F5",
          secondary: "#BDBDBD",
        },
        border: "#2A2A2A",
      },
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
        heading: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        golden: "0 4px 14px rgba(255, 204, 51, 0.2)",
        "golden-hover": "0 6px 20px rgba(255, 204, 51, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        fire: "0 4px 14px rgba(139, 0, 0, 0.35)",
      },
      backgroundImage: {
        "fire-gradient": "linear-gradient(140deg, #8b0000, #ff6600, #ffcc33)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-zoom": "fadeZoom 0.8s ease-out forwards",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s infinite",
        "scale-up": "scaleUp 0.3s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "shine": "shine 1s ease-in-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeZoom: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 5px rgba(255, 102, 0, 0.5))" },
          "50%": { opacity: "0.8", filter: "drop-shadow(0 0 15px rgba(255, 102, 0, 0.8))" },
        },
        scaleUp: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.03)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shine: {
          "100%": { transform: "translateX(100%)" },
        }
      },
    },
  },
  plugins: [],
};