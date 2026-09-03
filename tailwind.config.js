export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F9F7F2',
          surface: '#FBF9F4',
          container: '#F0EEE9',
          dim: '#DBDAD5',
          border: '#E4E2DD',
        },
        ochre: {
          light: '#FFB869',
          DEFAULT: '#BA7517',
          dark: '#855000',
          container: '#A76500',
        },
        tea: {
          light: '#B5F086',
          DEFAULT: '#386A0E',
          dark: '#265100',
        },
        maroon: {
          light: '#FFDBD0',
          DEFAULT: '#9C3E1F',
          dark: '#802A0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      minHeight: {
        'touch': '64px',
      },
      minWidth: {
        'touch': '64px',
      }
    },
  },
  plugins: [],
}
