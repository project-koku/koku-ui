// Based on https://github.com/RedHatInsights/frontend-components/blob/master/packages/config/src/bin/dev.webpack.config.ts

const CopyWebpackPlugin = require('copy-webpack-plugin');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const { dependencies, insights } = require('./package.json');

const moduleName = insights.appname.replace(/-(\w)/g, (_, match) => match.toUpperCase());
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './dist/');
const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const stats = {
  excludeAssets: fileRegEx,
  colors: true,
  modules: false,
};
const gitRevisionPlugin = new GitRevisionPlugin();

// Show what files changed since last compilation
class WatchRunPlugin {
  apply(compiler) {
    compiler.hooks.watchRun.tap('WatchRun', comp => {
      if (comp.modifiedFiles) {
        const changedFiles = Array.from(comp.modifiedFiles, file => `\n  ${file}`).join('');
        const logger = compiler.getInfrastructureLogger(insights.appname);
        logger.info(' ');
        logger.info('===============================');
        logger.info('FILES CHANGED:', changedFiles);
        logger.info('===============================');
      }
    });
  }
}

module.exports = {
  appUrl: '/openshift/cost-management',
  debug: true,
  interceptChromeConfig: false, // Change to false after your app is registered in configuration files
  proxyVerbose: true,
  sassPrefix: `.${moduleName}`,
  // sassPrefix: 'body', // For PF v5 testing only
  // bundlePfModules: true, // See https://console.stage.redhat.com/platform-docs/frontend-components/proxies/webpack-proxy#includePFcssmodulesinyourbundle
  stats,
  standalone: process.env.LOCAL_API_PORT ? true : false,
  useCache: true,
  useProxy: process.env.LOCAL_API_PORT ? false : true,
  /**
   * Temporarily disabled HMR -- see https://issues.redhat.com/browse/COST-3224
   *
  ...(process.env.HMR && { _unstableHotReload: process.env.HMR === 'true' }),
   */
  nodeModulesDirectories: '../../node_modules',
  /**
   * Config for federated modules
   */
  moduleFederation: {
    moduleName,
    /**
     * There is a know issue with apps using yarn to build their applications that the router package is not properly shared
     * Same issue was encountered in application services
     * Package can be re-enabled for sharing once chrome starts providing global routing package to all applications
     */
    // exclude: ['react-router-dom'],
    exposes: {
      './RootApp': path.resolve(__dirname, './src/appEntry.tsx'),
    },
    shared: [
      { 'react-redux': { version: dependencies['react-redux'] } },
      { 'react-router-dom': { version: dependencies['react-router-dom'], import: false, singleton: true } },
      { '@unleash/proxy-client-react': { version: dependencies['@unleash/proxy-client-react'], singleton: true } },
    ],
    // See inventory frontend https://github.com/RedHatInsights/insights-inventory-frontend/pull/2296/files#diff-d0f06d7cd724a6add60ee1bac8183344dc66faae9dac3ee6ee920f5b7ac3a88eR150
    // _unstableSpdy: true, // enable HTTP2/SPDY
  },
  /**
   * Add additional webpack plugins
   */
  plugins: [
    new WatchRunPlugin(),
    new webpack.ProgressPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(srcDir, 'locales'),
          to: path.join(distDir, 'locales'),
        },
      ],
    }),
    gitRevisionPlugin,
    new webpack.DefinePlugin({
      'process.env.COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
      'process.env.BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
    }),
  ],
  resolve: {
    modules: [srcDir, path.resolve(__dirname, '../../node_modules')],
    alias: {
      '@koku-ui/ui-lib': path.resolve(__dirname, '../../libs/ui-lib/src'),
    },
  },
  routes: {
    /**
     * Chrome services backend config routes, typically localhost:8000
     */
    ...(process.env.CLOUD_SERVICES_BACKEND_PORT && {
      '/api/chrome-service/v1/static': { host: `http://localhost:${process.env.CLOUD_SERVICES_BACKEND_PORT}` },
    }),
    /**
     * Ephemeral routes, typically localhost:8000
     */
    ...(process.env.EPHEMERAL_PORT && {
      '/api/cost-management/v1/': { host: `http://localhost:${process.env.EPHEMERAL_PORT}` },
    }),
    /**
     * Local API routes, typically localhost:8000
     */
    ...(process.env.LOCAL_API_PORT && {
      '/api/cost-management/v1/': {
        host: `http://${process.env.LOCAL_API_HOST || 'localhost'}:${process.env.LOCAL_API_PORT}`,
      },
    }),
    /**
     * FEC static routes, typically localhost:8003
     * https://console.stage.redhat.com/platform-docs/frontend-components/proxies/webpack-proxy#Inventoryexample
     */
    ...(process.env.FEC_STATIC_PORT && {
      '/apps/cost-management-ros': {
        host: `http://localhost:${process.env.FEC_STATIC_PORT}`,
      },
      '/beta/apps/cost-management-ros': {
        host: `http://localhost:${process.env.FEC_STATIC_PORT}`,
      },
    }),
  },
};
