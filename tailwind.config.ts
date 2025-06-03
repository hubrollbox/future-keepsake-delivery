
import type { Config } from "tailwindcss";

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
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontSize: {
				'hero': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '800' }],
				'hero-sm': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', fontWeight: '800' }],
				'section-title': ['clamp(2rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
				'section-title-sm': ['clamp(1.5rem, 3vw, 1.875rem)', { lineHeight: '1.2', fontWeight: '700' }],
				'subtitle': ['clamp(1.125rem, 2vw, 1.25rem)', { lineHeight: '1.4', fontWeight: '500' }],
				'body-large': ['clamp(1rem, 1.5vw, 1.125rem)', { lineHeight: '1.6', fontWeight: '400' }],
				'body': ['clamp(0.875rem, 1.2vw, 1rem)', { lineHeight: '1.6', fontWeight: '400' }],
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Novas cores da paleta
				beige: '#F5F5F5',
				gold: {
					DEFAULT: '#FFD700',
					50: '#FFFBE0', // Mais claro
					100: '#FFF7C0',
					200: '#FFF3A0',
					300: '#FFEF80',
					400: '#FFE040',
					500: '#FFD700', // Dourado principal
					600: '#CCAE00',
					700: '#998200',
					800: '#665700',
					900: '#332B00' // Mais escuro
				},
				pastelBlue: '#B3CDE0',
				darkGray: '#333333',
				white: '#FFFFFF',
			},
			borderRadius: {
				lg: '8px',
				md: 'calc(8px - 2px)',
				sm: 'calc(8px - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(30px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(-5%)'
					},
					'50%': {
						transform: 'translateY(0)'
					}
				},
				'pulse-gold': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.4s ease-out',
				'slide-up': 'slide-up 0.5s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite',
				'pulse-gold': 'pulse-gold 2s infinite'
			},
			boxShadow: {
				'gold': '0 4px 14px 0 rgba(255, 215, 0, 0.39)',
				'gold-lg': '0 10px 25px 0 rgba(255, 215, 0, 0.3)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
