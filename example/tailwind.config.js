const defaultTheme = require("tailwindcss/defaultTheme");
const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");

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

  purge: {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    options: {
      defaultExtractor: (content) => [
        // If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
      ],
      keyframes: true,
    },
  },
};
