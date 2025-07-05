/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#6366F1', // Indigo
        secondary: '#8B5CF6', // Violet
        accent: '#EC4899', // Pink
        background: '#F9FAFB', // Almost white
        'sidebar-bg': '#1F2937', // Dark Gray
        'sidebar-text': '#D1D5DB', // Light Gray
      },
    },
  },
  plugins: [],
};