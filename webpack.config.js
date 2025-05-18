const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const pages = ["index", "uses"];

module.exports = {
  entry: {
    app: {
      import: "./src/app.ts",
      filename: "app.[contenthash:6].js",
    },
    style: {
      import: "./src/app.scss",
      filename: "app.[contenthash:6].css",
    },
    index: {
      import: "./src/index.ts",
      filename: "index.[contenthash:6].js",
    },
    uses: {
      import: "./src/uses.ts",
      filename: "uses.[contenthash:6].js",
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, "src"),
        loader: "ts-loader",
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("dart-sass"),
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        type: "asset/resource",
      }
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:6].css",
    }),
    // new CopyPlugin({
    //   patterns: [{ from: "./src/assets/favicon/", to: "." }],
    // }),
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          filename: `${page}.html`,
          template: path.resolve(__dirname, "src", "index.html"),
          templateParameters: {
            page: page,
          },
          inject: true,
          favicon: false,
          chunks: ["app", "style", page],
        }),
    ),
  ),
};
