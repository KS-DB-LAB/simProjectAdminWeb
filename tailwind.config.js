/** @type {import('tailwindcss').Config} */
const forms = require("@tailwindcss/forms");
const headlessui = require("@headlessui/tailwindcss");
const flowbite = require("flowbite/plugin");
module.exports = {
  content: ["./node_modules/flowbite-react/**/*.js", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media",
  plugins: [flowbite, headlessui, forms],
};
