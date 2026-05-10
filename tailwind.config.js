/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        caveat: ["Caveat", "cursive"],
        sans: ["Noto Sans TC", "sans-serif"],
      },
      colors: {
        primary: "#E8845A",
        secondary: "#7BAE7F",
        accent: "#87CEEB",
        dark: "#5C3D2E",
        light: "#FDF8F0",
        muted: "#9A7A60",
        border: "#F5E6D3",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float 4s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
}
