import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
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
        // MASTER.md §2 — canonical font roles
        display: ['var(--font-display)', 'Josefin Sans', 'Raleway', 'sans-serif'],
        body:    ['var(--font-body)',    'DM Sans',       'sans-serif'],
        sans:    ['var(--font-body)',    'DM Sans',       'sans-serif'],
        accent:  ['var(--font-accent)', 'Cormorant Garamond', 'Georgia', 'serif'],
        // heading alias — kept for existing className="font-heading" usage
        heading: ['var(--font-display)', 'Josefin Sans', 'Raleway', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.22em',
      },
    },
  },
  plugins: [],
};
export default config;
