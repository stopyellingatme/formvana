import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import typescript from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

// const prod = !process.env.NODE_ENV === "production";

const name = `@${pkg.name}`;

export default {
  input: "./lib/index.ts",
  external: ["svelte"],
  output: [
    { file: pkg.module, format: "es", sourcemap: true },
    { file: pkg.main, format: "umd", name, sourcemap: true },
    // { file: pkg.types, format: "ts", name, sourcemap: true },
  ],
  plugins: [
    postcss({
      extract: true,
    }),
    resolve({
      browser: true,
      module: true,
    }),
    commonjs(),
    typescript(),
    svelte(),
    terser(),
  ],
};
