import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as webpack from "webpack";
import * as merge from "webpack-merge";

import webpackConfig from "./webpack.config";

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
