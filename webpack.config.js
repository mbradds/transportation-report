const path = require("path");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

module.exports = {
  // mode: "development",
  mode: "production",
  entry: {
    eng: "./src/index_eng.js",
    fra: "./src/index_fra.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle_[name].js",
  },
  // plugins: [
  //   new BundleAnalyzerPlugin({
  //     analyzerMode: "server",
  //     openAnalyzer: true,
  //     analyzerPort: 8888,
  //   }),
  // ],
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
  devServer: {
    compress: true,
  },
  resolve: {
    extensions: ["*", ".js"],
  },
};
