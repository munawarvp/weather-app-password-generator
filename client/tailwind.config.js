const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        myimage: "url('/src/assets/background_one.jpg')",
        loginbackground: "url('/src/assets/background_two.jpg')",
        registerbackground: "url('/src/assets/background_three.png')",
      }
    },
  },
  plugins: [],
}