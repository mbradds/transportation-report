const path = require('path')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js"],
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    compress: true,
    port: 8080,
    historyApiFallback: true,
    contentBase: './'
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "./" }],
    }),
  ],
};
