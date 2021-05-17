const path = require("path");
const webpack = require("webpack");

module.exports = (env, options) => {
  return {
    mode: "production",
    entry: "./src/index.ts",
    output: {
      library: "jskf",
      libraryTarget: "umd",
      filename: "jskf.js",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "ts-loader",
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
  };
};
