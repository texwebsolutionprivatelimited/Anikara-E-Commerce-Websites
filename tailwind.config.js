/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Note: With Tailwind CSS v4, custom theme extensions (colors, fonts, animations) 
    // are declared directly inside "src/index.css" using the "@theme" directive.
    // This tailwind.config.js serves as a configuration reference and ensures full compatibility
    // with editor linting/autocomplete extensions.
    extend: {},
  },
  plugins: [],
}
