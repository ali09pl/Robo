/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#e67e22',
        accent: '#f1c40f',
        success: '#2ecc71',
        danger: '#e74c3c',
        dark: '#2c3e50',
        light: '#ecf0f1',
      },
    },
  },
  plugins: [],
}
