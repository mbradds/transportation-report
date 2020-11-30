const path = require("path");
const JsonMinimizerPlugin = require("json-minimizer-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  target: "es5",
  //entry: "./src/index_eng.js",
  entry: {
    eng: "./src/index_eng.js",
    fra: "./src/index_fra.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle_[name].js",
    //filename: "bundle.js",
  },

  //plugins: [new BundleAnalyzerPlugin(),new JsonMinimizerPlugin()],
  plugins: [new JsonMinimizerPlugin()],

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
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
