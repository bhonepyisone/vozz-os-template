// FILE: tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // A nice blue for active states
        secondary: '#8B5CF6',
        accent: '#EC4899',
        // Neumorphism Colors from your example
        'neo-bg': '#e0e5ec',
        'neo-light': '#ffffff',
        'neo-dark': '#c2c8d0',
      },
      // Custom box shadows to match the Neumorphism effect
      boxShadow: {
        'neo-lg': '10px 10px 30px #c2c8d0, -10px -10px 30px #ffffff',
        'neo-md': '6px 6px 10px #c2c8d0, -6px -6px 10px #ffffff',
        'neo-inset': 'inset 4px 4px 6px #c8ccd1, inset -4px -4px 6px #f0f5fa',
        'neo-inset-active': 'inset 2px 2px 5px #bec4cb, inset -2px -2px 5px #f0f5fa',
      },
    },
  },
  plugins: [],
};
