/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9067C6",
        lightGrey: "#ECECEC",
        lightWhite: "#FAFFFD",
        darkPurple: "#48157F",
      },
    },
  },
  plugins: [],
};
