const presetEnv = require("@babel/preset-env");
// const presetTypescript=require( "@babel/preset-typescript");
const proposalThrowExpressions = require("@babel/plugin-proposal-throw-expressions");
const lodash = require("babel-plugin-lodash");

module.exports = {
  presets: [[presetEnv, { targets: { node: "current" } }]],

  plugins: [
    [lodash, {}],
    [proposalThrowExpressions, {}],
  ],
};
