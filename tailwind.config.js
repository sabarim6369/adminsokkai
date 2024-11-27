/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // Pages directory (for older Next.js structure)
    "./src/**/*.{js,ts,jsx,tsx}", // Src directory (for Next.js apps using `src`)
    "./components/**/*.{js,ts,jsx,tsx}", // Components directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
