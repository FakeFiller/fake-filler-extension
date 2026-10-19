import path from "node:path";
import { fileURLToPath } from "node:url";

import autoprefixer from "autoprefixer";
import CopyPlugin from "copy-webpack-plugin";
import cssnano from "cssnano";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack";

const root = path.dirname(fileURLToPath(import.meta.url));

// Builds the extension once into dist/chrome; scripts/package-browsers.mjs then derives the Edge and Firefox builds.
export default (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    // Extension pages forbid eval, so use a source map style that does not rely on it.
    devtool: isProduction ? false : "cheap-module-source-map",
    entry: {
      service_worker: path.join(root, "src/service_worker/index.ts"),
      "build/content-script": path.join(root, "src/content_script/index.ts"),
      "build/options": path.join(root, "src/options/index.tsx"),
      "build/transcriber": path.join(root, "src/transcriber/index.ts"),
    },
    output: {
      path: path.join(root, "dist/chrome"),
      filename: "[name].js",
      publicPath: "/",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "ts-loader",
          // Type checking runs separately in ForkTsCheckerWebpackPlugin; tsconfig's noEmit only applies to `tsc`.
          options: { transpileOnly: true, compilerOptions: { noEmit: false } },
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: { plugins: [autoprefixer(), ...(isProduction ? [cssnano()] : [])] },
              },
            },
            {
              loader: "sass-loader",
              options: {
                // Bootstrap 5 still uses Sass features that newer Dart Sass reports as deprecated.
                sassOptions: { quietDeps: true, silenceDeprecations: ["import", "global-builtin", "color-functions"] },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf)$/,
          type: "asset/resource",
          generator: { filename: "build/media/[hash][ext]" },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: { src: path.join(root, "src") },
    },
    plugins: [
      // moment ships every locale; the extension only uses the default English formatting.
      new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
      new MiniCssExtractPlugin({ filename: "[name].css" }),
      new CopyPlugin({ patterns: [{ from: "public", to: "." }] }),
      new ForkTsCheckerWebpackPlugin(),
    ],
    performance: { hints: false },
    stats: "minimal",
  };
};
