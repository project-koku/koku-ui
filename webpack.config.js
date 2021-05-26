const path = require('path');
const webpack = require('webpack');
const weblog = require('webpack-log');
const log = weblog({
  name: 'wds',
});
const proxy = require('@redhat-cloud-services/frontend-components-config-utilities/proxy');
const ChunkMapperPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { dependencies, insights } = require('./package.json');
const singletonDeps = [
  'lodash',
  'axios',
  'redux',
  'react',
  'react-dom',
  'react-router-dom',
  'react-redux',
  'react-promise-middleware',
  '@patternfly/react-core',
  '@patternfly/react-charts',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@patternfly/react-tokens',
  '@redhat-cloud-services/frontend-components',
  '@redhat-cloud-services/frontend-components-utilities',
  '@redhat-cloud-services/frontend-components-notifications',
];
const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './dist/');
const betaEnv = process.env.BETA_ENV;
const nodeEnv = process.env.NODE_ENV;

// See index.js from @redhat-cloud-services/frontend-components-config
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
});
const betaBranches = ['master', 'qa-beta', 'ci-beta', 'prod-beta'];
const moduleName = insights.appname.replace(/-(\w)/g, (_, match) => match.toUpperCase());

// show what files changed since last compilation
class WatchRunPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap('WatchRun', comp => {
      if (comp.modifiedFiles) {
        const changedFiles = Array.from(comp.modifiedFiles, file => `\n  ${file}`).join('');
        log.info(' ');
        log.info('===============================');
        log.info('FILES CHANGED:', changedFiles);
        log.info('===============================');
      }
    });
  }
}

module.exports = (_env, argv) => {
  const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
  const isProduction = nodeEnv === 'production' || argv.mode === 'production';
  const isBeta = betaEnv === 'true';
  const useLocalRoutes = process.env.USE_LOCAL_ROUTES === 'true';
  const appDeployment = (isProduction && betaBranches.includes(gitBranch)) || isBeta ? 'beta/apps' : 'apps';
  const publicPath = `/${appDeployment}/${insights.appname}/`;
  // Moved multiple entries to index.tsx in order to help speed up webpack
  const entry = path.join(srcDir, 'index.tsx');
  const useProxy = process.env.USE_PROXY === 'true';

  log.info('~~~Using variables~~~');
  log.info(`isProduction: ${isProduction}`);
  log.info(`Current branch: ${gitBranch}`);
  log.info(`Beta branches: ${betaBranches}`);
  log.info(`Using deployments: ${appDeployment}`);
  log.info(`Public path: ${publicPath}`);
  log.info('~~~~~~~~~~~~~~~~~~~~~');

  const stats = {
    excludeAssets: fileRegEx,
    colors: true,
    modules: false,
  };

  const routes = {};
  if (useLocalRoutes) {
    const localKokuPort = process.env.LOCAL_API_PORT ? process.env.LOCAL_API_PORT : '80';
    const localKoku = 'http://' + process.env.LOCAL_API + ':' + localKokuPort;
    routes['/api/cost-management/'] = {
      host: localKoku,
    };
  }

  return {
    stats,
    mode: isProduction ? 'production' : 'development',
    devtool: 'source-map', // isProduction ? 'source-map' : 'eval',
    entry,
    output: {
      path: distDir,
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].bundle.js',
      publicPath,
    },
    module: {
      rules: [
        {
          test: new RegExp(entry),
          loader: path.resolve(
            __dirname,
            './node_modules/@redhat-cloud-services/frontend-components-config-utilities/chrome-render-loader.js'
          ),
          options: {
            appName: insights.appname,
          },
        },
        {
          test: /\.tsx?$/,
          include: path.join(__dirname, 'src'),
          use: [
            {
              loader: 'ts-loader',
            },
          ],
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
          exclude: /@patternfly\/react-styles\/css/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          // Since we use Insights' upstream PatternFly, we're using null-loader to save about 1MB of CSS
          test: /\.css$/i,
          include: /@patternfly\/react-styles\/css/,
          use: 'null-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          sideEffects: true,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: fileRegEx,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.APP_PUBLIC_PATH': JSON.stringify(publicPath),
        'process.env.VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'process.env.COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        'process.env.BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
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
        ignoreOrder: true, // Enable to remove warnings about conflicting order
      }),
      new webpack.container.ModuleFederationPlugin({
        name: moduleName,
        filename: `${moduleName}.js`,
        exposes: {
          './RootApp': path.resolve(__dirname, './src/federatedEntry.tsx'),
          // Shared component module path. Must include default export!
          // './OcpOverviewWidget': path.resolve(__dirname, './src/modules/ocpOverviewWidget'),
        },
        shared: {
          ...dependencies,
          ...singletonDeps.reduce((acc, dep) => {
            acc[dep] = { singleton: true, requiredVersion: dependencies[dep] };
            return acc;
          }, {}),
        },
      }),
      new ChunkMapperPlugin({
        modules: [moduleName],
      }),
      new WatchRunPlugin(),
      new webpack.ProgressPlugin(),
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
      assetFilter: assetFilename => !(fileRegEx.test(assetFilename) || /\.map$/.test(assetFilename)),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.resolve(__dirname, './tsconfig.json'),
        }),
      ],
    },
    devServer: useProxy
      ? proxy({
          betaEnv: process.env.CLOUDOT_ENV,
          rootFolder: path.resolve(__dirname),
          localChrome: false,
          customProxy: undefined,
          appName: insights.appname,
          publicPath,
          https: true,
          port: 8002,
          proxyVerbose: true,
          // routesPath: path.resolve(__dirname, './config/spandx.config.js'),
          appUrl: [`/${isBeta ? 'beta/' : ''}openshift/cost-management`],
          disableFallback: false,
          ...(useLocalRoutes && {
            routes,
          }),
        })
      : {
          host: 'localhost',
          port: 8002,
          historyApiFallback: {
            index: `${publicPath}index.html`,
          },
          // hot: !isProduction,
          hot: false, // default is true, which currently does not work with Insights and federated modules?
          firewall: false,
          transportMode: 'sockjs',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
          },
        },
  };
};
