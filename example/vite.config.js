import { defineConfig } from "vite";
import svelte from "@sveltejs/vite-plugin-svelte";
// import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import ts from "@wessberg/rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

export default defineConfig({
  build: {
    rollupOptions: {
      // input: "./src/main.js",
      // output: [
      //   {
      //     sourcemap: true,
      //     format: "iife",
      //     name: "app",
      //     file: "./public/build/bundle.js",
      //   },
      // ],
      // plugins: [
      //   postcss({
      //     extract: true,
      //   }),
      //   svelte(),
      //   resolve({
      //     browser: true,
      //     module: true,
      //     dedupe: (importee) =>
      //       importee === "svelte" || importee.startsWith("svelte/"),
      //   }),
      //   commonjs(),
      //   json(),
      // ],

      input: "./src/main.js",
      output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: "./public/build/bundle.js",
      },
      plugins: [
        svelte(),
        resolve({
          browser: true,
          module: true,
          dedupe: (importee) =>
            importee === "svelte" || importee.startsWith("svelte/"),
        }),
        // commonjs(),
        json(),
        postcss({
          extract: true,
        }),
      ],
      // watch: {
      //   clearScreen: false,
      // },
    },
    outDir: "/public/build/dist",
    commonjsOptions: commonjs(),
  },
  // resolve: {
  //   dedupe: (importee) =>
  //     importee === "svelte" || importee.startsWith("svelte/"),
  // },
  publicDir: "/public/build",
  server: {
    base: "/pubilc",
    port: 5000,
  },
});
