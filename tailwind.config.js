/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      minWidth :{
        'md' : '28rem'
      }
    },
  },
  plugins: [ require('@tailwindcss/forms'), require('@tailwindcss/typography') , require('flowbite/plugin')],
}
