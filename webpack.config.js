const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = env => {
  const isProduction = env === 'production';
  const modDir = path.resolve(__dirname, './node_modules');
  const srcDir = path.resolve(__dirname, './src');
  const distDir = path.resolve(__dirname, './public');
  const language = 'en'; // replace with multiple webpack build thing

  return {
    mode: isProduction ? 'production' : 'development',
    // devtool: isProduction ? 'source-maps' : 'eval',
    entry: [
      //css entries
      path.join(modDir, 'patternfly/dist/css/patternfly.css'),
      path.join(modDir, 'patternfly/dist/css/patternfly-additions.css'),
      path.join(srcDir, 'index.tsx')
    ],
    output: {
      path: isProduction ? path.join(distDir, language) : distDir,
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            { loader: 'ts-loader' },
            !isProduction && {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@babel/plugin-syntax-typescript',
                  '@babel/plugin-syntax-decorators',
                  '@babel/plugin-syntax-jsx',
                  '@babel/plugin-syntax-dynamic-import',
                  'react-hot-loader/babel'
                ]
              }
            }
          ].filter(Boolean)
        },
        {
          test: /\.html?$/,
          use: [{ loader: 'html-loader' }]
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/,
          loader: 'url-loader?limit=100000'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(srcDir, 'index.html')
      }),
      // Only bundles the current language
      new webpack.ContextReplacementPlugin(
        /\.[\/\\]locales/,
        new RegExp(language)
      ),
      new webpack.DefinePlugin({
        BUNDLED_LANGUAGE: JSON.stringify('en')
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      // development plugins
      !isProduction && new webpack.HotModuleReplacementPlugin()
      //production plugins
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      unsafeCache: false
    },
    devServer: {
      contentBase: isProduction ? path.join(distDir, 'en') : distDir,
      publicPath: '/',
      historyApiFallback: true,
      // hot: true,
      stats: {
        colors: true,
        modules: false
      }
    }
  };
};
