/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', 
    theme: {
      extend: {
        colors: {
          mirage: '#16232A',
          blaze: '#FF5B04',
          deepsea: '#075056',
          wildsand: '#E4EEF0',
        }
      },
    },
    plugins: [],
  }