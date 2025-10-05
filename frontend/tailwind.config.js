/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scan all React files
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0f172a",
        primary: "#6d28d9",
        secondary: "#3b82f6",
      },
      backgroundImage: {
        "gradient-glass":
          "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(59,130,246,0.25))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
