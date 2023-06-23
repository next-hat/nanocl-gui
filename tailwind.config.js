const defaultTheme = require("nanocl-gui-toolkit/tailwind.config").theme

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "node_modules/nanocl-gui-toolkit/**/*.{ts,tsx}",
  ],
  theme: {
    ...(defaultTheme || {}),
  },
  plugins: [require("tailwindcss-animate")],
}
