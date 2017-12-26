const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: [
    "react-hot-loader/patch", // use react-hot-loader for HMR
    "./index.js"
  ],
  devServer: {
    contentBase: "./dist",
    hot: true // enable HMR
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]), // to clean the dist-ui folder
    new HtmlWebpackPlugin({
      title: "React Webpack",
      template: "public/index.html"
    }), // to create index.html automatically from template
    new webpack.NamedModulesPlugin(), // to show the name of updated modules in Console
    new webpack.HotModuleReplacementPlugin() // enable HMR
  ],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
  }
};
