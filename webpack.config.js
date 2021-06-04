const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
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
  plugins: [
    //   new BundleAnalyzerPlugin({
    //     analyzerMode: "server",
    //     openAnalyzer: true,
    //     analyzerPort: 8888,
    //   }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "main.css"),
          to: path.resolve(__dirname, "dist", "main.css"),
        },
        {
          from: path.resolve(__dirname, "src", "eng.html"),
          to: path.resolve(__dirname, "dist", "eng.html"),
        },
        {
          from: path.resolve(__dirname, "src", "fra.html"),
          to: path.resolve(__dirname, "dist", "fra.html"),
        },
        {
          from: path.resolve(__dirname, "src", "GCWeb"),
          to: path.resolve(__dirname, "dist", "GCWeb"),
        },
        {
          from: path.resolve(__dirname, "src", "wet-boew"),
          to: path.resolve(__dirname, "dist", "wet-boew"),
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
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
