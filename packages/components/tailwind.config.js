/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx}",
    "./src/**/*.stories.tsx",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["selector", '[data-mode="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
};
