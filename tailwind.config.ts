import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#09090b", // Rich Black (Zinc 950)
                secondary: "#f4f4f5", // Zinc 100 - Light Gray
                accent: "#8B5CF6", // Light Violet (Violet 500)
                "accent-hover": "#7C3AED", // Darker Violet (Violet 600)
                background: "#ffffff",
                surface: "#ffffff",
                "text-main": "#09090b",
                "text-muted": "#71717a",
            },
            fontFamily: {
                display: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-montserrat)', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
            },
        },
    },
    plugins: [],
};

export default config;
