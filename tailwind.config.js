/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./src/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  prefix: "ak-",
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        xxs: ["0.6875rem", "1.125rem"], // 11px
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
