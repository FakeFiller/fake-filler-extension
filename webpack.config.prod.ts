import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

import webpackConfig from './webpack.config';

const productionConfig: webpack.Configuration = {
  mode: 'production',
  devtool: false,
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'dist')],
    }),
  ],
};

export default merge.smart(webpackConfig, productionConfig);
