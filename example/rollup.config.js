import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import typescript from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "./src/main.js",
  output: [
    {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "./public/build/bundle.js",
    },
  ],
  plugins: [
    postcss({
      extract: true,
    }),
    svelte(),
    resolve({
      browser: true,
      module: true,
      dedupe: (importee) =>
        importee === "svelte" || importee.startsWith("svelte/"),
    }),
    commonjs(),
    !production && serve(),
    !production && livereload("./public"),
    production && terser(),
    typescript(),
    json(),
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
