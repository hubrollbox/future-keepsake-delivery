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
            900: "#262626",
            700: "#4A4A4A",
            500: "#7A7A7A",
            200: "#E5E5E5",
            100: "#F5F5F5",
          },
        },

        // Semantic tokens (HSL format for Tailwind)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
      },

      boxShadow: {
        "keepla": "0 4px 20px -2px rgba(230, 57, 70, 0.15)",
        "keepla-intense": "0 8px 30px -4px rgba(230, 57, 70, 0.25)",
        "keepla-sm": "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      },

      fontSize: {
        h1: ["3rem", { lineHeight: "1.1" }],
        h2: ["2.25rem", { lineHeight: "1.15" }],
        h3: ["1.75rem", { lineHeight: "1.2" }],
      },

      spacing: {
        "section-xs": "2rem",
        "section-md": "4rem",
        "section-lg": "5rem",
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
        georgia: ["Georgia", "serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
