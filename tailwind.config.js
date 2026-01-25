/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        primary: {
          DEFAULT: '#F0B100',
          dark: '#D49B00',
          light: '#F5C84C',
        },
        background: {
          DEFAULT: '#F9F7F1',
          dark: '#1E293B',
        },
        accent: {
          green: '#10B981',
          blue: '#3B82F6',
          indigo: '#6366F1',
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
        'premium-lg': '0 20px 60px -15px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
};
