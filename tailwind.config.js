/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,tsx,jsx,js}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#F4B400",
        secondary: "#0B2C5F",
        "background-light": "#F9FAFB",
        "background-dark": "#111827",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1F2937",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        barlow: ["Barlow", "sans-serif"],
        rubik: ["Rubik", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: ["Rubik", "sans-serif"],
            h1: {
              fontFamily: ["Barlow", "sans-serif"],
            },
            h2: {
              fontFamily: ["Barlow", "sans-serif"],
            },
            h3: {
              fontFamily: ["Barlow", "sans-serif"],
            },
            h4: {
              fontFamily: ["Barlow", "sans-serif"],
            },
            h5: {
              fontFamily: ["Barlow", "sans-serif"],
            },
            h6: {
              fontFamily: ["Barlow", "sans-serif"],
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
