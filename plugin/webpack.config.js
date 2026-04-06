const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const metadata = `// ==UserScript==
// @name         BarCrosser Forum Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tracks stats from forum
// @author       You
// @match        *://barcross.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
`;

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  output: {
    filename: 'tracker.user.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: /==\/?UserScript==|@/i,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: metadata,
      raw: true,
    }),
  ],
};
