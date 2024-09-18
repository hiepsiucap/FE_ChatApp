/**
 * @format
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#38D7E7",
        primary2: "#F9F7F1",
        secondary: "#EE316B",
        background: "#842D72",
        button: "#04ABFF",
        bg1: "#171717",
        bg2: "#222222",
        bg3: "#414141",
        text: "#747579",
        // ...
      },
      backgroundImage: {
        "my-image":
          "url('https://res.cloudinary.com/dhhuv7n0h/image/upload/v1714202688/div.background_h76wu5.png')",
      },
    },
  },
  plugins: [],
};
