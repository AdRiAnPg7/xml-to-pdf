/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbff",
          100: "#def6ff",
          500: "#00b3ff",
          700: "#008bd1",
        },
      },
    },
  },
  plugins: [],
};
