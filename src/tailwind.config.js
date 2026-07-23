/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './hooks/**/*.{js,jsx,ts,tsx}', './lib/**/*.{js,jsx,ts,tsx}', './constants/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        khmer: {
          50: '#FFF8EE',
          100: '#F8E8C8',
          200: '#EFD19A',
          300: '#E4B86B',
          400: '#D59B3C',
          500: '#B97A1E',
          600: '#955F18',
          700: '#7B1113',
          800: '#581013',
          900: '#3F0D10',
        },
      },
    },
  },
  plugins: [],
};
