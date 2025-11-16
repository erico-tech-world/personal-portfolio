import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'navy-dark': '#1a1b4b',
        'navy-darker': '#13143a',
        'navy-medium': '#2c3968',
        'navy-light': '#3E54A3',
        'accent-blue': '#3b82f6',
        'accent-cyan': '#00d1e0',
        'accent-green': '#10b981',
        'accent-green-dark': '#22c55e',
        'accent-amber': '#f59e0b',
        'light-gray': '#e2e8f0',
        'medium-gray': '#4b5563',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      }
    },
  },
  plugins: [],
};
export default config;
