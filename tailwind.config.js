/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        neo: "8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff",
        "neo-inset": "inset 4px 4px 10px #d1d9e6, inset -4px -4px 10px #ffffff",
        "neo-dark": "8px 8px 16px #1a1a1a, -8px -8px 16px #2e2e2e",
        "neo-inset-dark":
          "inset 4px 4px 10px #1a1a1a, inset -4px -4px 10px #2e2e2e",
      },
    },
  },
  plugins: [],
};
