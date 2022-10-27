// Based on https://github.com/RedHatInsights/frontend-components/blob/master/packages/config/src/scripts/dev.webpack.config.js
const config = require('@redhat-cloud-services/frontend-components-config');
const federatedPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/federated-modules');
const fecConfig = require(process.env.FEC_CONFIG_PATH);
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const { dependencies, insights } = require('../package.json');
const path = require('path');

// See index.js from @redhat-cloud-services/frontend-components-config
const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
});

const betaBranches = ['main', 'master', 'stage-beta', 'prod-beta'];
const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
const isBeta = process.env.BETA === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const moduleName = insights.appname.replace(/-(\w)/g, (_, match) => match.toUpperCase());
const rootDir = process.env.FEC_ROOT_DIR || process.cwd();

function parseRegexpURL(url) {
  return new RegExp(`${isBeta ? '/beta' : ''}${url.toString()}`);
}

function createAppUrl(appUrl) {
  if (Array.isArray(appUrl)) {
    return appUrl.map(url => {
      if (typeof url === 'object') {
        return parseRegexpURL(url);
      } else if (typeof url === 'string') {
        return `${isBeta ? '/beta' : ''}${url}`;
      } else {
        // eslint-disable-next-line no-throw-literal
        throw `Invalid appURL format! Expected string or regexp, got ${typeof url}. Check your fec.config.js:appUrl.`;
      }
    });
  } else if (typeof appUrl === 'object') {
    return parseRegexpURL(appUrl);
  } else if (typeof appUrl === 'string') {
    return `${isBeta ? '/beta' : ''}${appUrl}`;
  } else {
    // eslint-disable-next-line no-throw-literal
    throw `Invalid appURL format! Expected string or regexp, got ${typeof appUrl}. Check your fec.config.js:appUrl.`;
  }
}

const appUrl = createAppUrl(fecConfig.appUrl);

const { plugins: externalPlugins, routes, stats, ...externalConfig } = fecConfig;

const { config: webpackConfig, plugins } = config({
  ...externalConfig,
  routes,
  appUrl,
  deployment: (isProduction && betaBranches.includes(gitBranch)) || isBeta ? 'beta/apps' : 'apps',
  env: `${process.env.CLOUDOT_ENV}-${isBeta === 'true' ? 'beta' : 'stable'}`,
  rootFolder: rootDir,
});

webpackConfig.resolve = {
  ...webpackConfig.resolve,
  modules: [path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../src')],
};

plugins.push(
  federatedPlugin({
    root: rootDir,
    moduleName,
    /**
     * There is a know issue with apps using yarn to build their applications that the router package is not properly shared
     * Same issue was encountered in application services
     * Package can be re-enabled for sharing once chrome starts providing global routing package to all applications
     */
    exclude: ['react-router-dom'],
    exposes: {
      './RootApp': path.resolve(__dirname, '../src/appEntry.tsx'),
    },
    shared: [
      { 'react-redux': { requiredVersion: dependencies['react-redux'] } },
      { '@unleash/proxy-client-react': { requiredVersion: '*', singleton: true } },
    ],
  }),
  ...externalPlugins
);

module.exports = {
  ...webpackConfig,
  plugins,
  stats,
};

/* eslint-disable no-console */
console.log('~~~Custom webpack variables~~~');
console.log(`isProduction: ${isProduction}`);
console.log(`isBeta: ${isBeta}`);
console.log(`Clouddot ENV: ${process.env.CLOUDOT_ENV}`);
console.log(`Using ephemeral API routes: ${process.env.EPHEMERAL_PORT !== undefined}`);
console.log(`Using local API routes: ${process.env.LOCAL_API_PORT !== undefined}`);
console.log(`Using Cloud Services Config routes: ${process.env.CLOUD_SERVICES_CONFIG_PORT !== undefined}`);
console.log('~~~~~~~~~~~~~~~~~~~~~');
