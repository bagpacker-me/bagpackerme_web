import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyan: '#0ED2E9',
        ice: '#E9F5F7',
        lime: '#C1EA00',
        teal: '#285056',
        void: '#221E2A',
      },
      fontFamily: {
        display: ['"Arista 2.0 Alternate"', 'var(--font-baloo)', 'Baloo 2', 'sans-serif'],
        body: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        accent: ['var(--font-baloo)', 'Baloo 2', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.22em',
      }
    },
  },
  plugins: [],
};
export default config;
