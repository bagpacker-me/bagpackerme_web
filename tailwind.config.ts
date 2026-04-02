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
        cyan: '#0ED2E9', // Electric Cyan Highlight
        ice: '#F0FCFE',  // Base Ice White
        lime: '#C1EA00', // Acid Lime
        teal: '#285056', // Deep Slate
        void: '#221E2A', // Dark Navy
        surface: {
          lowest: '#FFFFFF',
          DEFAULT: '#F0FCFE',
          container: '#E4F0F2',
          high: '#D8E8EA',
          highest: '#CCE2E5',
        }
      },
      fontFamily: {
        // MASTER.md §2 — canonical font roles
        display: ['var(--font-display)', 'Outfit', 'Josefin Sans', 'Raleway', 'sans-serif'],
        body:    ['var(--font-body)',    'DM Sans',       'sans-serif'],
        sans:    ['var(--font-body)',    'DM Sans',       'sans-serif'],
        accent:  ['var(--font-accent)', 'Cormorant Garamond', 'Georgia', 'serif'],
        // heading alias — kept for existing className="font-heading" usage
        heading: ['var(--font-display)', 'Outfit', 'Josefin Sans', 'Raleway', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.22em',
      },
      boxShadow: {
        'card-teal':       '0 8px 32px rgba(40,80,86,0.12), 0 2px 8px rgba(40,80,86,0.08)',
        'card-teal-hover': '0 20px 60px rgba(40,80,86,0.20), 0 8px 24px rgba(40,80,86,0.12)',
        'glow-lime':       '0 0 24px rgba(193,234,0,0.18)',
        'glow-lime-sm':    '0 4px 16px rgba(193,234,0,0.15)',
        'glow-cyan':       '0 0 24px rgba(14,210,233,0.15)',
        'diffuse':         '0 40px 60px rgba(18,29,31,0.06)',
      },
      borderColor: {
        'subtle':  'rgba(34,30,42,0.03)', // Ghost border 
        'medium':  'rgba(34,30,42,0.10)', // 10% outline variant
        'strong':  'rgba(34,30,42,0.15)',
      },
      keyframes: {
        'underline-in': {
          '0%':   { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'underline-in': 'underline-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
