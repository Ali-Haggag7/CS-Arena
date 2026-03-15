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
			screens: {
				xs: "475px",
			},
			colors: {
				primary: {
					"100": "#FFE8F0",
					DEFAULT: "#EE2B69",
				},
				secondary: "#FBE843",
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
				300: "2px 2px 0px 2px rgb(238, 43, 105)",
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "100%",
						color: "inherit",
						a: {
							color: "#EE2B69",
							"&:hover": { color: "#c41e52" },
						},
						"h1, h2, h3, h4": {
							color: "inherit",
						},
						code: {
							color: "#EE2B69",
							backgroundColor: "#FFE8F0",
							borderRadius: "4px",
							padding: "2px 6px",
						},
						"code::before": { content: '""' },
						"code::after": { content: '""' },
						blockquote: {
							borderLeftColor: "#EE2B69",
							color: "inherit",
						},
					},
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