'use strict'
const webpack = require('webpack')
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/main.js',
    app: './src/js/app.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ 
        template: './src/index.html',
        inject: 'body',
        chunks: ['main', 'app']
    }),
    new Dotenv(),
    // new webpack.DefinePlugin({
    //     'process.env.GK_API': JSON.stringify(process.env.GK_API),
    //     'process.env.GK_LIST': JSON.stringify(process.env.GK_LIST),
    //     'process.env.GK_DETAIL_URL': JSON.stringify(process.env.GK_DETAIL_URL),
    //     'process.env.GK_DETAIL_APPEND': JSON.stringify(process.env.GK_DETAIL_APPEND),
    // })   
  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader'
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader'
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer
                ]
              }
            }
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
            options: {
              sassOptions: {
                // Optional: Silence Sass deprecation warnings. See note below.
                quietDeps: true
              }
            }
          }
        ]
      }
    ]
  }
}