const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const isDev = process.env.NODE_ENV !== 'production' && process.argv.some(arg => arg.includes('serve') || arg.includes('dev'));

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
  mode: isDev ? 'development' : 'production',
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
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
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
    new webpack.DefinePlugin({
      'process.env.MOCK': JSON.stringify(process.env.MOCK === 'true')
    }),
    ...(isDev ? [
      new HtmlWebpackPlugin({
        template: './demo/index.html',
        inject: 'body'
      })
    ] : [])
  ],
  devServer: {
    port: 8080,
    open: true,
    hot: true,
    liveReload: true,
    watchFiles: ['src/**/*', 'demo/**/*'],
    static: {
      directory: path.join(__dirname, 'demo'),
    },
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('/search.php', (req, res) => {
        if (process.env.MOCK === 'true') {
          const mockFile = path.join(__dirname, 'demo', 'mocks', 'search.html');
          if (fs.existsSync(mockFile)) {
            res.sendFile(mockFile);
          } else {
            res.status(404).send('Mock file not found');
          }
        } else {
          // If not mock, behavior is unchanged (could proxy if needed, but not requested here)
          res.status(404).send('Not mocked');
        }
      });
      return middlewares;
    }
  }
};
