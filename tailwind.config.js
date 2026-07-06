/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', 'sans-serif'],
        display: ['"Gowun Dodum"', '"Noto Sans KR"', 'sans-serif'],
      },
      colors: {
        cinema: {
          50: '#fdf6ec',
          100: '#f9e8cd',
          500: '#e0762c',
          600: '#c95f1d',
          700: '#a74a18',
          900: '#5c2a12',
        },
      },
    },
  },
  plugins: [],
}
