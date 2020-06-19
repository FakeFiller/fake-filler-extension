import * as webpack from "webpack";
import * as merge from "webpack-merge";

import webpackConfig from "./webpack.config";

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const developmentConfig: webpack.Configuration = {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.SourceMapDevToolPlugin({
      exclude: /^vendor.*.\.js$/,
      filename: "[file].map",
    }),
  ],
};

export default merge.smart(webpackConfig, developmentConfig);
