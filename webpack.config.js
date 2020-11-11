const path = require("path");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
var nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "production",
  entry: ["core-js/stable","regenerator-runtime/runtime", "./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  externals: [nodeExternals()],
  // plugins: [new BundleAnalyzerPlugin()],
  // optimization: {
  //   minimize: true,
  //   minimizer: [new JsonMinimizerPlugin()],
  // },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [/node_modules/,/\bcore-js\b/,/\bwebpack\/buildin\b/],
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
};
