const { sveltePreprocess } = require("svelte-preprocess/dist/autoProcess");

module.exports = {
  preprocess: [
    sveltePreprocess({
      defaults: { style: "postcss" },
      postcss: true,
    }),
  ],
};
