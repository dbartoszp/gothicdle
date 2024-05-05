/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-gothic)'] },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'default-text': 'var(--default-text)',
        'default-border': 'var(--default-border)',
        'default-background': 'var(--default-background)',
      },
      animation: {
        fade: 'fadeIn .5s ease-in-out',
        hflip: 'flipHorizontal 1s ease-in',
        flipFadeIn: 'flipFadeIn .5s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        flipHorizontal: {
          '50%': { transform: 'rotateY(180deg)' },
        },
        flipFadeIn: {
          '0%': {
            opacity: 0,
            transform: 'rotateY(90deg)',
          },

          '100%': {
            opacity: 1,
            transform: 'rotateY(0deg)',
          },
        },
      },
    },
  },
  plugins: [],
};
// export default config;
