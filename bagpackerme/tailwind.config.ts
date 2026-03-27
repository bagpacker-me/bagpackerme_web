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
        display: ['Josefin Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif'],
      },
      letterSpacing: {
        widest: '0.22em',
      }
    },
  },
  plugins: [],
};
export default config;
