const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './public');

module.exports = env => {
  const isProduction = env === 'production';
  const stats = {
    excludeAssets: fileRegEx,
    colors: true,
    modules: false,
  };

  return {
    stats: stats,
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-maps' : 'eval',
    entry: [
      require.resolve('@patternfly/react-core/dist/styles/base.css'),
      path.join(srcDir, './styles/global.css'),
      path.join(srcDir, 'index.tsx'),
    ],
    output: {
      path: distDir,
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
            },
            !isProduction && {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@babel/plugin-syntax-typescript',
                  ['@babel/plugin-syntax-decorators', { legacy: true }],
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
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: fileRegEx,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.APP_NAMESPACE': JSON.stringify(process.env.APP_NAMESPACE),
        'process.env.APP_PROTOCOL': JSON.stringify(process.env.APP_PROTOCOL),
      }),

      new CopyWebpackPlugin([
        {
          from: path.join(srcDir, 'locales'),
          to: path.join(distDir, 'locales'),
        },
      ]),

      new HtmlWebpackPlugin({
        template: path.join(srcDir, 'index.html'),
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
            test: /[\\/]node_modules[\\/](react|react-dom|redux)[\\/]/,
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
      contentBase: distDir,
      publicPath: '/',
      historyApiFallback: true,
      hot: true,
    },
  };
};
