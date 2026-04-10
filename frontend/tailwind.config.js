/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A2E',      // Deep Navy
        secondary: '#E94560',    // Vibrant Pink-Red
        accent: '#FFC107',       // Gold/Warmth
        african: '#2E7D32',      // African Green
        kitenge: '#9C27B0',      // Purple accent
        dark: '#1E1E2F',
        light: '#F9F9F9',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'african-pattern': "url('/src/assets/pattern.svg')",
        'hero-bg': "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)",
      },
    },
  },
  plugins: [],
}