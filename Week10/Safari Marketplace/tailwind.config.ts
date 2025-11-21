import { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'safari-pink': '#E91E63',
        'safari-pink-dark': '#C2185B',
        'safari-pink-light': '#FCE4EC',
      },
    },
  },
} satisfies Config;