/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7f5',
          100: '#b3ebe5',
          200: '#80dfd5',
          300: '#4dd3c5',
          400: '#1ac7b5',
          500: '#00b8a5',
          600: '#009688',
          700: '#007469',
          800: '#00524a',
          900: '#00302b',
        },
        secondary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00b8a5 0%, #2196f3 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #009688 0%, #1e88e5 100%)',
      },
    },
  },
  plugins: [],
}

