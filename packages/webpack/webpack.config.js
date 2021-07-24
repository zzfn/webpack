const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./lib/webpack.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: ["html-loader","@zzf-webpack/loader"],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({ title: "Hot Module Replacement" })],
  devServer: {
    inline: true,
    // hot:false
    hotOnly: true,
    open: true,
  },
};
