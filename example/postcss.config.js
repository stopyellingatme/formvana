// const production = !process.env.ROLLUP_WATCH
// const purgecss = require('@fullhuman/postcss-purgecss')
// const cssnano = require('cssnano')

// module.exports = {
//   plugins: [
//     require('postcss-import')(),
//     require('tailwindcss'),
//     require('autoprefixer'),
//     cssnano({
//       autoprefixer: false,
//       preset: ['default'],
//     }),
//     // Only purge css on production
//     false &&
//       purgecss({
//         content: ['./**/*.html', './src/**/*.svelte'],
//         defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g || []),
//       }),
//   ],
// }

const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    !dev &&
      cssnano({
        preset: "default",
      }),
  ],
};
