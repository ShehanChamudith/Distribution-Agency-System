/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        PoppinsR: ["Poppins-Regular"],
        PoppinsB: ["Poppins-Bold"],
        PoppinsM: ["Poppins-Medium"],
        PoppinsL: ["Poppins-Light"]
      },
    },
  },
  plugins: [],
}

