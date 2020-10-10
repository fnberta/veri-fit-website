const { resolve } = require('path');
const { EnvironmentPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnvWebpack = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const SRC_DIR = resolve(__dirname, 'src');
const BUILD_DIR = resolve(__dirname, 'build');
const PUBLIC_DIR = resolve(__dirname, 'public');

const PRODUCTION = process.env.NODE_ENV === 'production';

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Veri-Fit',
    template: resolve(SRC_DIR, 'index.ejs'),
  }),
];

if (PRODUCTION) {
  plugins.push(new EnvironmentPlugin(['FIREBASE_API_KEY']));
  plugins.push(new CleanWebpackPlugin());
  plugins.push(new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }));
  plugins.push(new CopyWebpackPlugin({ patterns: [{ from: 'public' }] }));
  plugins.push(new WorkboxPlugin.GenerateSW());
} else {
  plugins.push(new DotEnvWebpack());
}

module.exports = {
  mode: PRODUCTION ? 'production' : 'development',
  entry: [resolve(SRC_DIR, 'index.tsx')],
  output: {
    path: BUILD_DIR,
    filename: '[name].[contenthash].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
  },
  devtool: PRODUCTION ? 'hidden-source-map' : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          projectReferences: true,
        },
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.css$/,
        use: [
          PRODUCTION ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMaps: true,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins,
  optimization: {
    runtimeChunk: 'single',
    minimizer: ['...', new CssMinimizerPlugin({ sourceMap: true })],
  },
  devServer: {
    host: '0.0.0.0',
    port: 9000,
    contentBase: PUBLIC_DIR,
    compress: true,
    historyApiFallback: true,
  },
};
