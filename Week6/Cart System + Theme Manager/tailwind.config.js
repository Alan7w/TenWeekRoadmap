/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Ensure we have good contrast colors
      colors: {
        // Custom light/dark mode colors if needed
      }
    },
  },
  plugins: [],
}