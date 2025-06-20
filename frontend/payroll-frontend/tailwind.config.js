import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // include all your React files
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // Use imported plugin
};
