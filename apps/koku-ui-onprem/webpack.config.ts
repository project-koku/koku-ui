import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { DefinePlugin } from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const NODE_ENV = (process.env.NODE_ENV || 'development') as Configuration['mode'];

const config: Configuration & {
  devServer?: WebpackDevServerConfiguration;
} = {
  mode: NODE_ENV,
  devtool: 'eval-source-map',
  devServer: {
    host: 'localhost',
    port: 9000,
    historyApiFallback: true,
    open: true,
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    client: {
      overlay: true,
    },
    devMiddleware: {
      writeToDisk: true,
      index: 'index.html',
    },
    proxy: [
      {
        context: ['/api/cost-management/v1'],
        target: process.env.API_HOST,
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api/cost-management/v1': '' },
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
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
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        type: 'asset/resource',
        // only process modules with this loader
        // if they live under a 'fonts' or 'pficon' directory
        include: [
          // local node_modules (when not hoisted)
          path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/fonts'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/pficon'),
          // workspace root node_modules (hoisted deps)
          path.resolve(__dirname, '../../node_modules/patternfly/dist/fonts'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-core/dist/styles/assets/fonts'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-core/dist/styles/assets/pficon'),
          path.resolve(__dirname, '../../node_modules/@patternfly/patternfly/assets/fonts'),
          path.resolve(__dirname, '../../node_modules/@patternfly/patternfly/assets/pficon'),
          path.resolve(__dirname, '../koku-ui-hccm/src'),
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/i,
        type: 'asset/resource',
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'src/assets/images'),
          path.resolve(__dirname, 'node_modules/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css/assets/images'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/assets/images'),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-table/node_modules/@patternfly/react-styles/css/assets/images'
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-inline-edit-extension/node_modules/@patternfly/react-styles/css/assets/images'
          ),
          // workspace root node_modules (hoisted deps)
          path.resolve(__dirname, '../../node_modules/patternfly'),
          path.resolve(__dirname, '../../node_modules/@patternfly/patternfly/assets/images'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-styles/css/assets/images'),
          path.resolve(__dirname, '../../node_modules/@patternfly/react-core/dist/styles/assets/images'),
          path.resolve(__dirname, '../koku-ui-hccm/src'),
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),
    new DefinePlugin({
      'process.env.KOKU_UI_COMMITHASH': JSON.stringify('foo'),
      'process.env.KOKU_UI_PKGNAME': JSON.stringify('foo'),
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '@koku-ui/ui-lib': path.resolve(__dirname, '../../libs/ui-lib/src'),
      '@koku-ui/koku-ui-hccm': path.resolve(__dirname, '../koku-ui-hccm/src'),
      store: path.resolve(__dirname, '../koku-ui-hccm/src/store'),
      api: path.resolve(__dirname, '../koku-ui-hccm/src/api'),
      locales: path.resolve(__dirname, '../koku-ui-hccm/src/locales'),
      components: path.resolve(__dirname, '../koku-ui-hccm/src/components'),
      routes$: path.resolve(__dirname, '../koku-ui-hccm/src/routes.tsx'),
      routes: path.resolve(__dirname, '../koku-ui-hccm/src/routes'),
      utils: path.resolve(__dirname, '../koku-ui-hccm/src/utils'),
      '@redhat-cloud-services/frontend-components/useChrome': path.resolve(
        __dirname,
        'src/mocks/frontend-components/useChrome.ts'
      ),
      '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider': path.resolve(
        __dirname,
        'src/mocks/frontend-components-notifications/NotificationsProvider.tsx'
      ),
      '@redhat-cloud-services/frontend-components-notifications/state': path.resolve(
        __dirname,
        'src/mocks/frontend-components-notifications/state.ts'
      ),
      '@redhat-cloud-services/frontend-components-notifications/NotificationPortal': path.resolve(
        __dirname,
        'src/mocks/frontend-components-notifications/NotificationPortal.tsx'
      ), // Keep as fallback
      '@redhat-cloud-services/frontend-components-translations/Provider': path.resolve(
        __dirname,
        'src/mocks/frontend-components-translations/Provider.tsx'
      ),
      '@redhat-cloud-services/frontend-components/PageHeader': path.resolve(
        __dirname,
        'src/mocks/frontend-components/PageHeader.tsx'
      ),
      '@redhat-cloud-services/frontend-components/Maintenance': path.resolve(
        __dirname,
        'src/mocks/frontend-components/Maintenance.tsx'
      ),
      '@redhat-cloud-services/frontend-components/AsyncComponent': path.resolve(
        __dirname,
        'src/mocks/frontend-components/AsyncComponent.tsx'
      ),
      '@redhat-cloud-services/frontend-components/Unavailable': path.resolve(
        __dirname,
        'src/mocks/frontend-components/Unavailable.tsx'
      ),
      '@redhat-cloud-services/frontend-components-notifications/hooks': path.resolve(
        __dirname,
        'src/mocks/frontend-components-notifications/hooks.ts'
      ),
    },
  },
  watchOptions: {
    followSymlinks: true,
  },
  snapshot: {
    managedPaths: [],
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
