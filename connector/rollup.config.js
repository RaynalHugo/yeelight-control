const commonjs = require(`rollup-plugin-commonjs`);
const resolve = require(`rollup-plugin-pnp-resolve`);
import babel from "rollup-plugin-babel";

module.exports = {
  plugins: [resolve(), babel(), commonjs()],
  input: "./src/index.js",
  external: ["lodash/fp"],
  output: {
    file: "lib/index.cjs.js",
    format: "cjs",
  },
};
