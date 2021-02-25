const path = require("path");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  target: "es5",
  entry: {
    eng: "./src/index_eng.js",
    fra: "./src/index_fra.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle_[name].js",
  },
  // plugins: [new BundleAnalyzerPlugin()],
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
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ["*", ".js"],
  },
};
