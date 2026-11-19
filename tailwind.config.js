/**
 * Tailwind config for regenerating assets/css/tailwind.css (optional).
 *
 * The site ships a precompiled stylesheet so it stays zero-install and loads
 * ~13 KB of CSS instead of a ~400 KB in-browser compiler. Only run the command
 * below when you add/remove utility classes in index.html or assets/js/main.js:
 *
 *   npx tailwindcss@3 -c tailwind.config.js -i tailwind.input.css -o assets/css/tailwind.css --minify
 *
 * (npx downloads the Tailwind CLI temporarily; nothing is installed globally.)
 */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./assets/js/main.js"],
  theme: {
    extend: {
      screens: {
        xs: "420px",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        neutral: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },
    },
  },
};
