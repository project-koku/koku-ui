const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const fs = require('fs');

const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const modDir = path.resolve(__dirname, './node_modules');
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './public');
const allLanguages = fs
  .readdirSync(path.join(srcDir, 'locales'))
  .map(locale => path.parse(locale).name);

module.exports = env => {
  const isProduction = env === 'production';
  const languages = isProduction ? allLanguages : ['en'];
  const stats = {
    excludeAssets: fileRegEx,
    colors: true,
    modules: false,
  };

  return languages.map(language => ({
    name: language,
    stats: stats,
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-maps' : 'eval',
    entry: [
      path.join(modDir, 'patternfly/dist/css/patternfly.min.css'),
      path.join(modDir, 'patternfly/dist/css/patternfly-additions.min.css'),
      path.join(srcDir, 'index.tsx'),
    ],
    output: {
      path: isProduction ? path.join(distDir, language) : distDir,
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: isProduction,
              },
            },
            !isProduction && {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@babel/plugin-syntax-typescript',
                  '@babel/plugin-syntax-decorators',
                  '@babel/plugin-syntax-jsx',
                  '@babel/plugin-syntax-dynamic-import',
                  'react-hot-loader/babel',
                ],
              },
            },
          ].filter(Boolean),
        },
        {
          test: /\.html?$/,
          use: [{ loader: 'html-loader' }],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: fileRegEx,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(srcDir, 'index.html'),
      }),
      // Only bundles the current language
      new webpack.ContextReplacementPlugin(
        /\.[\/\\]locales/,
        new RegExp(language)
      ),
      new webpack.DefinePlugin({
        BUNDLED_LOCALE: JSON.stringify(language),
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[contenthash].css' : '[id].css',
      }),
      // development plugins
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      //production plugins
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-bootstrap)[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    performance: {
      assetFilter: assetFilename =>
        !(fileRegEx.test(assetFilename) || /\.map$/.test(assetFilename)),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, './tsconfig.json'),
        }),
      ],
    },
    devServer: {
      stats: stats,
      contentBase: isProduction ? path.join(distDir, 'en') : distDir,
      publicPath: '/',
      historyApiFallback: true,
      hot: true,
    },
  }));
};
