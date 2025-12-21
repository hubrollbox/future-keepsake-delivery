import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        keepla: {
          black: "#000000",
          white: "#FFFFFF",

          red: {
            DEFAULT: "#E63946",
          },

          gray: {
            900: "#262626", // texto principal
            700: "#4A4A4A", // texto secundário
            500: "#7A7A7A", // meta / labels
            200: "#E5E5E5", // borders
            100: "#F5F5F5", // backgrounds suaves
          },
        },

        // Aliases SEMÂNTICOS (usar estes nas páginas)
        background: "#FFFFFF",
        foreground: "#262626",
        border: "#E5E5E5",
        muted: "#7A7A7A",
        
        // Brand compliance: compatibilidade com componentes antigos
        // MAPS: steel-blue → keepla-gray-900, earthy-burgundy → keepla-red, misty-gray → keepla-gray-500
        "steel-blue": "#262626",    // texto principal (keepla-gray-900)
        "earthy-burgundy": "#E63946", // destaque emocional (keepla-red)
        "misty-gray": "#7A7A7A",     // texto secundário (keepla-gray-500)
      },

      fontSize: {
        h1: ["3rem", { lineHeight: "1.1" }],
        h2: ["2.25rem", { lineHeight: "1.15" }],
        h3: ["1.75rem", { lineHeight: "1.2" }],
      },

      spacing: {
        "section-xs": "2rem",   // gentle spacing
        "section-md": "4rem",   // standard section spacing
        "section-lg": "5rem",   // emotional / hero spacing
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
        georgia: ["Georgia", "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
