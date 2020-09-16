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
const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './public/');
const appEnv = process.env.APP_ENV;
const nodeEnv = process.env.NODE_ENV;

// See index.js from @redhat-cloud-services/frontend-components-config
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
});
const betaBranhces = ['master', 'qa-beta', 'ci-beta', 'prod-beta'];

module.exports = env => {
  const gitBranch =
    process.env.TRAVIS_BRANCH ||
    process.env.BRANCH ||
    gitRevisionPlugin.branch();
  const isProduction = nodeEnv === 'production' || env === 'production';
  const appDeployment =
    (isProduction && betaBranhces.includes(gitBranch)) || appEnv === 'proxy'
      ? 'beta/apps'
      : 'apps';
  const publicPath = `/${appDeployment}/cost-management/`;

  log.info('~~~Using variables~~~');
  log.info(`Current branch: ${gitBranch}`);
  log.info(`Beta branches: ${betaBranhces}`);
  log.info(`Using deployments: ${appDeployment}`);
  log.info(`Public path: ${publicPath}`);
  log.info('~~~~~~~~~~~~~~~~~~~~~');

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
      require.resolve(
        '@redhat-cloud-services/frontend-components/components/Main.css'
      ),
      // Todo: Added to global.css as a workaround for https://projects.engineering.redhat.com/browse/RHCLOUD-7970
      // require.resolve(
      //   '@redhat-cloud-services/frontend-components/components/icon-404.css'
      // ),
      require.resolve(
        '@redhat-cloud-services/frontend-components/components/InvalidObject.css'
      ),
      require.resolve(
        '@redhat-cloud-services/frontend-components/components/NotAuthorized.css'
      ),
      require.resolve(
        '@redhat-cloud-services/frontend-components/components/Skeleton.css'
      ),
      require.resolve(
        '@redhat-cloud-services/frontend-components/components/Unavailable.css'
      ),
      require.resolve(
        '@redhat-cloud-services/frontend-components-notifications/index.css'
      ),
      require.resolve('@patternfly/patternfly/patternfly-addons.css'),
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
          include: path.join(__dirname, 'src'),
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
          sideEffects: true,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          sideEffects: true,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: fileRegEx,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction ? '[id].[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
        ignoreOrder: true, // Enable to remove warnings about conflicting order
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(srcDir, 'locales'),
            to: path.join(distDir, 'locales'),
          },
        ],
      }),

      new HtmlWebpackPlugin({
        template: path.join(srcDir, 'index.html'),
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '@@env',
          replacement: appDeployment,
        },
      ]),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[id].[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
      }),
      // development plugins
      // !isProduction && new webpack.HotModuleReplacementPlugin(),
      // production plugins
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/](react|react-dom|redux|@patternfly*)[\\/]/,
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
      // hot: !isProduction,
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
