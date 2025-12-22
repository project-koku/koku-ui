import { DynamicRemotePlugin } from '@openshift/dynamic-plugin-sdk-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { DefinePlugin } from 'webpack';

const NODE_ENV = (process.env.NODE_ENV || 'development') as Configuration['mode'];

const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './dist');

const exposedModules = {
  './OptimizationsBadge': './src/fed-modules/optimizationsBadgeWrapper.tsx',
  './OptimizationsBreakdown': './src/fed-modules/optimizationsBreakdownWrapper.tsx',
  './OptimizationsDetails': './src/fed-modules/optimizationsDetailsWrapper.tsx',
  './OptimizationsLink': './src/fed-modules/optimizationsLinkWrapper.tsx',
  './OptimizationsSummary': './src/fed-modules/optimizationsSummaryWrapper.tsx',
  './OptimizationsTable': './src/fed-modules/optimizationsTableWrapper.tsx',
};

const config: Configuration = {
  entry: Object.values(exposedModules),
  mode: NODE_ENV,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules\/(?!@koku-ui)/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig-onprem.json',
              allowTsInNodeModules: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        type: 'asset/resource',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../../node_modules/patternfly/dist/fonts'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
          path.resolve(__dirname, '../../node_modules/@patternfly/patternfly/assets/fonts'),
          path.resolve(__dirname, '../../node_modules/@patternfly/patternfly/assets/pficon'),
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        type: 'asset/resource',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, '../../node_modules/patternfly'),
          path.resolve(__dirname, '../../node_modules/@patternfly/patternfly/assets/images'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-styles/css/assets/images'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-core/dist/styles/assets/images'),
        ],
      },
    ],
  },
  output: {
    filename: '[name].bundle-[contenthash].js',
    path: distDir,
    publicPath: '/costManagementRos/',
    chunkFilename: '[name].bundle-[contenthash].js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(srcDir, 'locales'),
          to: path.join(distDir, 'locales'),
        },
      ],
    }),
    new DynamicRemotePlugin({
      extensions: [],
      sharedModules: {
        react: { singleton: true, requiredVersion: '*' },
        'react-dom': { singleton: true, requiredVersion: '*' },
        'react-redux': { singleton: true, requiredVersion: '*' },
        'react-router-dom': { singleton: true, requiredVersion: '*' },
        '@scalprum/react-core': { singleton: true, requiredVersion: '*' },
        '@openshift/dynamic-plugin-sdk': { singleton: true, requiredVersion: '*' },
      },
      pluginMetadata: {
        name: 'costManagementRos',
        version: '1.0.0',
        exposedModules,
      },
    }),
    new DefinePlugin({
      'process.env.KOKU_UI_COMMITHASH': undefined,
      'process.env.KOKU_UI_PKGNAME': undefined,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    symlinks: false,
    cacheWithContext: false,
    modules: [srcDir, path.resolve(__dirname, '../../node_modules')],
    alias: {
      '@koku-ui/ui-lib': path.resolve(__dirname, '../../libs/ui-lib/src'),
      '@redhat-cloud-services': path.resolve(__dirname, '../../libs/onprem-cloud-deps/src'),
      '@unleash': path.resolve(__dirname, '../../libs/onprem-cloud-deps/src/unleash'),
    },
  },
  watchOptions: {
    followSymlinks: true,
  },
};

/* Production settings */
if (NODE_ENV === 'production') {
  config.optimization = {
    minimizer: [
      new TerserJSPlugin({}),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { mergeLonghand: false }],
        },
      }),
    ],
  };
  config.plugins?.push(
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[name].bundle-[contenthash].css',
    })
  );
  config.devtool = 'source-map';
}

export default config;
