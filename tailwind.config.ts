import type { Config } from "tailwindcss";
import { withUIKit } from "tailwindcss-uikit-colors";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"*.{js,ts,jsx,tsx,mdx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				// Base typography defaults
				sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
				serif: ["Spectral", "Noto Serif SC", "serif"],
				mono: [
					"Maple Mono",
					"Maple Mono NF",
					"Maple Mono SC",
					"ui-monospace",
					"SFMono-Regular",
					"Menlo",
					"Monaco",
					"Consolas",
					"Liberation Mono",
					"Courier New",
					"monospace",
				],

				// Chinese typography - following W3C CLREQ guidelines
				"zh-sans": [
					"IBM Plex Sans",
					"-apple-system",
					"BlinkMacSystemFont",
					"Noto Sans SC",
					"Source Han Sans SC",
					"PingFang SC",
					"Hiragino Sans GB",
					"Microsoft YaHei",
					"WenQuanYi Micro Hei",
					"system-ui",
					"sans-serif",
				],
				"zh-serif": [
					"Noto Serif SC",
					"Spectral",
					"Source Han Serif SC",
					"Songti SC",
					"SimSun",
					"NSimSun",
					"FangSong",
					"STSong",
					"serif",
				],

				// Traditional Chinese
				"zh-hant-sans": [
					"IBM Plex Sans",
					"-apple-system",
					"BlinkMacSystemFont",
					"Noto Sans TC",
					"Noto Sans SC",
					"Source Han Sans TC",
					"Source Han Sans SC",
					"PingFang TC",
					"PingFang SC",
					"Microsoft JhengHei",
					"Microsoft YaHei",
					"WenQuanYi Micro Hei",
					"system-ui",
					"sans-serif",
				],
				"zh-hant-serif": [
					"Noto Serif TC",
					"Noto Serif SC",
					"Spectral",
					"Source Han Serif TC",
					"Source Han Serif SC",
					"PMingLiU",
					"MingLiU",
					"Songti TC",
					"Songti SC",
					"serif",
				],

				// Japanese typography - following W3C JLREQ guidelines
				"ja-sans": [
					"IBM Plex Sans",
					"-apple-system",
					"BlinkMacSystemFont",
					"Noto Sans JP",
					"Source Han Sans JP",
					"Hiragino Kaku Gothic ProN",
					"Hiragino Sans",
					"Yu Gothic",
					"Meiryo",
					"Takao Gothic",
					"IPAexGothic",
					"IPAPGothic",
					"VL PGothic",
					"system-ui",
					"sans-serif",
				],
				"ja-serif": [
					"Noto Serif JP",
					"Spectral",
					"Source Han Serif JP",
					"Hiragino Mincho ProN",
					"Hiragino Mincho Pro",
					"Yu Mincho",
					"YuMincho",
					"Times New Roman",
					"serif",
				],

				// Korean typography - following W3C KLREQ guidelines
				"ko-sans": [
					"IBM Plex Sans",
					"-apple-system",
					"BlinkMacSystemFont",
					"Noto Sans KR",
					"Source Han Sans KR",
					"Apple SD Gothic Neo",
					"Malgun Gothic",
					"Nanum Gothic",
					"Dotum",
					"system-ui",
					"sans-serif",
				],
				"ko-serif": [
					"Noto Serif KR",
					"Spectral",
					"Source Han Serif KR",
					"Nanum Myeongjo",
					"Batang",
					"serif",
				],
			},

			// Enhanced letter spacing for different scripts
			letterSpacing: {
				zh: "-0.02em", // Chinese characters need tighter spacing
				ja: "-0.01em", // Japanese mixed scripts
				ko: "-0.015em", // Korean Hangul spacing
				en: "-0.01em", // English optimal spacing
				wide: "0.025em",
				wider: "0.05em",
				widest: "0.1em",
			},

			// Line heights optimized for different scripts
			lineHeight: {
				zh: "1.7", // Chinese needs more line height for readability
				ja: "1.75", // Japanese mixed scripts need extra space
				ko: "1.6", // Korean is more compact
				en: "1.5", // English standard
				title: "1.2", // Titles across all languages
				tight: "1.25",
				snug: "1.375",
				normal: "1.5",
				relaxed: "1.625",
				loose: "1.75",
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
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				xl: "calc(var(--radius) + 2px)",
				"2xl": "calc(var(--radius) + 8px)",
			},
			keyframes: {
				"accordion-down": {
					from: {
						height: "0",
					},
					to: {
						height: "var(--radix-accordion-content-height)",
					},
				},
				"accordion-up": {
					from: {
						height: "var(--radix-accordion-content-height)",
					},
					to: {
						height: "0",
					},
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"slide-up": {
					from: { transform: "translateY(20px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-in-out",
				"slide-up": "slide-up 0.5s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default withUIKit(config);
