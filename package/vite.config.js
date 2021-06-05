import { defineConfig } from "vite";
// import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import svelte from "@sveltejs/vite-plugin-svelte";

import pkg from "./package.json";

const name = `@${pkg.name}`;

export default defineConfig({
  build: {
    rollupOptions: {
      // input: "./lib/index.ts",
      // external: ["svelte"],
      // output: [
      //   { file: pkg.module, format: "es", sourcemap: true },
      //   { file: pkg.main, format: "umd", name, sourcemap: true },
      //   // { file: pkg.types, format: "ts", name, sourcemap: true },
      // ],
      // plugins: [
      //   resolve({
      //     browser: true,
      //     module: true,
      //   }),
      //   commonjs(),
      //   typescript(),
      //   svelte(),
      // terser(),
      // ],
    },
    outDir: "./build/",
    lib: {
      name: name,
      formats: ["es", "umd", "cjs"],
      entry: "./lib/index.ts",
    },
  },
  plugins: [svelte()],
  // server: {
  //   port: 5000,
  // },
});
