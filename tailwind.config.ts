import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./sanity/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			screens: { xs: "475px" },
			colors: {
				primary: {
					"100": "#dbeafe",
					"200": "#bfdbfe",
					DEFAULT: "#3b82f6",
					"600": "#2563eb",
					"700": "#1d4ed8",
				},
				secondary: "#06b6d4",
				dark: {
					"100": "#0d0d0f",
					"200": "#111114",
					"300": "#18181c",
					"400": "#1e1e24",
					"500": "#27272f",
				},
				black: {
					"100": "#333333",
					"200": "#141413",
					"300": "#7D8087",
					DEFAULT: "#000000",
				},
				white: {
					"100": "#F7F7F7",
					DEFAULT: "#FFFFFF",
				},
			},
			fontFamily: {
				"work-sans": ["var(--font-work-sans)"],
				cairo: ["var(--font-cairo)"],
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				100: "2px 2px 0px 0px rgb(0, 0, 0)",
				200: "2px 2px 0px 2px rgb(0, 0, 0)",
				300: "2px 2px 0px 2px #3b82f6",
				glow: "0 0 20px rgba(59, 130, 246, 0.3)",
				"glow-lg": "0 0 40px rgba(59, 130, 246, 0.2)",
				glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-dark": "linear-gradient(135deg, #0d0d0f 0%, #18181c 100%)",
				"gradient-blue": "linear-gradient(135deg, #1d4ed8 0%, #06b6d4 100%)",
				"grid-pattern":
					"linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)",
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "100%",
						color: "inherit",
						a: {
							color: "#3b82f6",
							"&:hover": { color: "#60a5fa" },
						},
						"h1, h2, h3, h4": { color: "inherit" },
						code: {
							color: "#60a5fa",
							backgroundColor: "rgba(59,130,246,0.1)",
							borderRadius: "4px",
							padding: "2px 6px",
						},
						"code::before": { content: '""' },
						"code::after": { content: '""' },
						blockquote: {
							borderLeftColor: "#3b82f6",
							color: "inherit",
						},
					},
				},
			},
			keyframes: {
				shimmer: {
					'100%': { transform: 'translateX(100%)' },
				},
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
	],
};

export default config;