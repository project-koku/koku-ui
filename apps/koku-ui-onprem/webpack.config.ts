import { createDevServerProxy, createKeycloakFetcher, TokenRefresher } from '@koku-ui/token-refresher';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { container } from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const NODE_ENV = (process.env.NODE_ENV || 'development') as Configuration['mode'];

let refresher: TokenRefresher | undefined;

// When running the UI with a local koku API, omit proxy header
const proxyHeaders =
  process.env.API_TOKEN !== 'false'
    ? {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      }
    : undefined;

if (NODE_ENV !== 'production' && !process.env.CI) {
  if (!process.env.API_PROXY_URL) {
    throw new Error(
      '[koku-ui-onprem] Missing required env var: API_PROXY_URL\n' +
        'Set it to the backend URL, e.g. https://koku-api.example.com:8000'
    );
  }

  const hasKeycloak =
    process.env.KEYCLOAK_TOKEN_URL && process.env.KEYCLOAK_CLIENT_ID && process.env.KEYCLOAK_CLIENT_SECRET;

  // When running the UI with a local koku API, API_TOKEN is omitted
  if (!hasKeycloak && !process.env.API_TOKEN) {
    throw new Error(
      '[koku-ui-onprem] No authentication configured for the dev proxy.\n' +
        'Provide one of:\n' +
        '  1. KEYCLOAK_TOKEN_URL + KEYCLOAK_CLIENT_ID + KEYCLOAK_CLIENT_SECRET  (auto-refresh)\n' +
        '  2. API_TOKEN  (static bearer token)\n' +
        'See apps/koku-ui-onprem/README.md for details.'
    );
  }

  if (hasKeycloak) {
    refresher = new TokenRefresher({
      fetchToken: createKeycloakFetcher({
        tokenUrl: process.env.KEYCLOAK_TOKEN_URL!,
        clientId: process.env.KEYCLOAK_CLIENT_ID!,
        clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      }),
      fallbackToken: process.env.API_TOKEN,
    });
    refresher.start();
  }
}

const config: Configuration & {
  devServer?: WebpackDevServerConfiguration;
} = {
  mode: NODE_ENV,
  devtool: 'eval-source-map',
  devServer: {
    host: 'localhost',
    port: 9001,
    historyApiFallback: true,
    open: NODE_ENV !== 'production',
    static: [
      {
        directory: path.resolve(__dirname, 'dist'),
      },
      {
        directory: path.resolve(__dirname, '../koku-ui-ros/dist'),
        publicPath: '/costManagementRos/',
        watch: true,
      },
      {
        directory: path.resolve(__dirname, '../koku-ui-hccm/dist'),
        publicPath: '/costManagement/',
        watch: true,
      },
      {
        directory: path.resolve(__dirname, '../koku-ui-sources/dist'),
        publicPath: '/sources/',
        watch: true,
      },
    ],
    client: {
      overlay: true,
    },
    proxy: [
      refresher
        ? createDevServerProxy(refresher, {
            context: ['/api/cost-management/v1'],
            target: process.env.API_PROXY_URL!,
            pathRewrite: { '^/api/cost-management/v1': '' },
            secure: false,
          })
        : {
            context: ['/api/cost-management/v1'],
            target: process.env.API_PROXY_URL,
            changeOrigin: true,
            secure: false,
            pathRewrite: { '^/api/cost-management/v1': '' },
            ...(proxyHeaders && { headers: proxyHeaders }),
          },
    ],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules\/(?!@koku-ui)/,
        use: [
          {
            loader: 'ts-loader',
            options: {
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
        test: /\.svg$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: 'asset/resource',
        include: [
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
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: '[name].bundle-[contenthash].js',
  },
  plugins: [
    new container.ModuleFederationPlugin({
      name: 'onprem',
      shared: {
        react: { singleton: true, requiredVersion: '*' },
        'react-dom': { singleton: true, requiredVersion: '*' },
        'react-redux': { singleton: true, requiredVersion: '*' },
        'react-router-dom': { singleton: true, requiredVersion: '*' },
        '@openshift/dynamic-plugin-sdk': { singleton: true, requiredVersion: '*' },
        '@scalprum/react-core': { singleton: true, requiredVersion: '*' },
        '@koku-ui/ui-lib/': { singleton: true, requiredVersion: '*' },
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '@koku-ui/onprem-cloud-deps': path.resolve(__dirname, '../../libs/onprem-cloud-deps/src'),
    },
  },
  watchOptions: {
    followSymlinks: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

/* Production settings */
if (NODE_ENV === 'production') {
  (config.optimization || {}).minimizer = [
    new TerserJSPlugin({}),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: ['default', { mergeLonghand: false }],
      },
    }),
  ];
  config.plugins?.push(
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[name].bundle-[contenthash].css',
    })
  );
  config.devtool = 'source-map';
}

export default config;
