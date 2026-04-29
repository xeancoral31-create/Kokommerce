/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-color': '#7c2d12', // Match your branding if needed
        'koko-gold': '#eca840',
      }
    },
  },
  plugins: [],
}
