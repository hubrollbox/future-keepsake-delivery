import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: "1rem",
				xs: "1rem",
				sm: "1.5rem",
				md: "2rem",
				lg: "4rem",
				xl: "5rem",
				"2xl": "6rem",
			},
			screens: {
				"2xl": "1400px",
			},
		},
		screens: {
			xs: "475px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			fontSize: {
				hero: ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.1", fontWeight: "700" }],
				"hero-sm": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", fontWeight: "700" }],
				"section-title": ["clamp(2rem, 3.5vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "600" }],
				"section-title-sm": ["clamp(1.5rem, 3vw, 1.875rem)", { lineHeight: "1.2", fontWeight: "600" }],
				subtitle: ["clamp(1.125rem, 2vw, 1.25rem)", { lineHeight: "1.4", fontWeight: "500" }],
				"body-large": ["clamp(1rem, 1.5vw, 1.125rem)", { lineHeight: "1.6", fontWeight: "400" }],
				body: ["clamp(0.875rem, 1.2vw, 1rem)", { lineHeight: "1.6", fontWeight: "400" }],
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				serif: ["Georgia", "serif"],
			},
			spacing: {
				"safe-top": "env(safe-area-inset-top)",
				"safe-bottom": "env(safe-area-inset-bottom)",
				"safe-left": "env(safe-area-inset-left)",
				"safe-right": "env(safe-area-inset-right)",
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",

				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},

				/* === Keepla — única fonte de verdade === */
				keepla: {
					red: {
						DEFAULT: "#DC143C", // Crimson - Igual ao CSS
						deep: "#B01030",    // Deep Crimson - Igual ao CSS
						glow: "#E8365A",    // Glow - Igual ao CSS
					},
					gray: {
						light: "#E0E0E0",
						dark: "#262626",
					},
					black: "#000000",
					white: "#FFFFFF",
				},

				/* Backwards-compatible single-key palette requested */
				"keepla-red": {
					DEFAULT: "#C8102E", // Vermelho Carmesim
					deep: "#A00D25",    // Hover / states
				},
			},
			borderRadius: {
				lg: "12px",
				md: "calc(12px - 2px)",
				sm: "calc(12px - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				"slide-up": {
					"0%": { transform: "translateY(30px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.6s ease-out",
				"scale-in": "scale-in 0.4s ease-out",
				"slide-up": "slide-up 0.5s ease-out",
			},
			boxShadow: {
				keepla: "0 4px 24px rgba(200, 16, 46, 0.25)",
				"keepla-glow": "0 0 40px rgba(200, 16, 46, 0.35)",
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;