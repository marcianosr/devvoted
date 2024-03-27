/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@devvoted/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@devvoted/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
