import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import typescript from "@rollup/plugin-typescript";
// import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.js",
  output: [
    {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "public/build/bundle.js",
    },
    { file: pkg.module, format: "es", sourcemap: true },
    { file: pkg.main, format: "umd", name: "Formvana", sourcemap: true },
  ],
  plugins: [
    postcss({
      extract: true,
    }),
    svelte({
      dev: !production,
      css: (css) => {
        css.write("public/build/bundle.css");
      },
    }),
    resolve({
      browser: true,
      module: true,
      dedupe: (importee) =>
        importee === "svelte" || importee.startsWith("svelte/"),
    }),
    commonjs(),
    !production && serve(),
    !production && livereload("public"),
    production && terser(),
    typescript(),
    // json(),
  ],
  watch: {
    clearScreen: false,
  },
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        });
      }
    },
  };
}
