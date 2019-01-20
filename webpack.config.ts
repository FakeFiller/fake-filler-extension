// https://github.com/libertylocked/chrome-extension-typescript-react

import * as path from 'path';
import * as webpack from 'webpack';

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProd = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

const buildConfig: webpack.Configuration = {
  mode: 'production',
  cache: false,
  entry: {
    background_script: path.join(__dirname, 'src/background_script/index.ts'),
    content_script: path.join(__dirname, 'src/content_script/index.ts'),
    options: path.join(__dirname, 'src/options/index.tsx'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
                }),
                cssnano(),
              ],
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        loader: 'file-loader',
        exclude: [/\.(html?)$/, /\.(ts|tsx|js|jsx)$/, /\.css$/, /\.scss$/, /\.json$/],
        query: {
          name: '[hash].[ext]',
          outputPath: 'media/',
          publicPath: 'build/',
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist/build'),
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin([
      {
        context: 'public',
        from: {
          dot: false,
          glob: '**/*',
        },
        to: path.join(__dirname, 'dist/'),
      },
    ]),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  performance: {
    hints: false,
  },
};

if (isProd()) {
  buildConfig.devtool = false;
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
    }),
    new CleanWebpackPlugin(['dist']),
  ]);
} else {
  buildConfig.plugins = (buildConfig.plugins || []).concat([
    new webpack.SourceMapDevToolPlugin({
      exclude: /^vendor.*.\.js$/,
      filename: '[file].map',
    }),
  ]);
}

export default buildConfig;
