module.exports = {
  mode: "jit",
  purge: ["./src/*.{ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
