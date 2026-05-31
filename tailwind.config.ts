import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff3131',
        'bg-light': '#ffffff',
        'bg-light-alt': '#d3d3d3',
        'bg-dark': '#0a0a0a',
        'text-light': '#111111',
        'text-light-dim': '#1c1c1c',
        'text-dark': '#ffffff',
        'text-dark-dim': '#d3d3d3',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'custom-red': '0 4px 14px 0 rgba(255, 49, 49, 0.18)',
      },
    },
  },
  plugins: [],
};
export default config;
