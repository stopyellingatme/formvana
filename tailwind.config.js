const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
      textColor: ["visited"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    //     {
    //   layout: 'sidebar',
    // }
  ],
  // purge: {
  //   enabled: true,
  //   content: ['./src/**/*.html'],
  //   content: ['./src/**/*.svelte'],
  // },
};
