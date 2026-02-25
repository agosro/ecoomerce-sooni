/** @type {import('tailwindcss').Config} */
// En Tailwind v4 los colores y el tema se definen en src/styles/index.css con @theme.
// Este archivo se mantiene solo para configurar el fontFamily a través del plugin de Vite.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
}
