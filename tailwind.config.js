/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        navy: {
          50: "#f4f6fb",
          100: "#e5eaf4",
          200: "#cbd5e8",
          700: "#293657",
          800: "#1c263f",
          900: "#121932",
          950: "#0b1021",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        "card-hover":
          "0 12px 24px -6px rgba(18, 25, 50, 0.08), 0 4px 10px -4px rgba(18, 25, 50, 0.04)",
        nav: "0 1px 3px 0 rgba(18, 25, 50, 0.06)",
      },
    },
  },
  plugins: [],
};
