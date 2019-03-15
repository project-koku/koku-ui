const path = require('path');
const webpack = require('webpack');
const weblog = require('webpack-log');
const log = weblog({
  name: 'wds',
});
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
});
const gitBranch = process.env.BRANCH || gitRevisionPlugin.branch();
const appEnv = process.env.APP_ENV;
const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './public/');
let deploymentEnv = 'apps';
let release = '';
const betaBranch =
  gitBranch === 'master' ||
  gitBranch === 'qa-beta' ||
  gitBranch === 'prod-beta';
if (!appEnv && betaBranch) {
  deploymentEnv = 'beta/apps';
  release = 'beta';
}
const publicPath = `/${deploymentEnv}/cost-management/`;

log.info(`appEnv=${appEnv}`);
log.info(`gitBranch=${gitBranch}`);
log.info(`publicPath=${publicPath}`);

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
      require.resolve('patternfly/dist/css/patternfly.css'),
      require.resolve('patternfly/dist/css/patternfly-additions.css'),
      require.resolve('@patternfly/patternfly/utilities/Display/display.css'),
      require.resolve('@patternfly/patternfly/utilities/Flex/flex.css'),
      path.join(srcDir, './styles/global.css'),
      path.join(srcDir, 'index.tsx'),
    ],
    output: {
      path: distDir,
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].bundle.js',
      publicPath: publicPath,
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
                  // See https://github.com/babel/babel/issues/8049
                  [
                    '@babel/plugin-syntax-typescript',
                    {
                      isTSX: true,
                    },
                  ],
                  [
                    '@babel/plugin-syntax-decorators',
                    {
                      legacy: true,
                    },
                  ],
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
          use: [
            {
              loader: 'html-loader',
            },
          ],
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
        'process.env.APP_PUBLIC_PATH': JSON.stringify(publicPath),
        'process.env.VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'process.env.COMMITHASH': JSON.stringify(
          gitRevisionPlugin.commithash()
        ),
        'process.env.BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
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
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '@@env',
          replacement: deploymentEnv,
        },
      ]),
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
      contentBase: false,
      historyApiFallback: {
        index: `${publicPath}/index.html`,
      },
      hot: true,
      port: 8002,
      disableHostCheck: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      },
    },
  };
};
