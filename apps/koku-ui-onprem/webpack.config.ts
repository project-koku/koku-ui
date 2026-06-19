import { createDevServerProxy, createKeycloakFetcher, TokenRefresher } from '@koku-ui/token-refresher';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { container, DefinePlugin } from 'webpack';
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

const isOauth2ProxyMode = process.env.OAUTH2_PROXY_MODE === 'true';

let proxyHeaders: Record<string, string> | undefined;

// Always register /api/me and /logout middlewares.
// In oauth2-proxy mode /api/me reads real identity headers injected by oauth2-proxy,
// mirroring the nginx $http_x_auth_request_preferred_username behaviour in production.
// In headless mode the headers are absent and fixed dev-user stubs are returned.
const setupMiddlewares: WebpackDevServerConfiguration['setupMiddlewares'] = (middlewares, devServer) => {
  devServer.app?.get('/api/me', (req, res) => {
    // x-auth-request-preferred-username mirrors nginx $http_x_auth_request_preferred_username.
    // Fall back to x-auth-request-user when preferred_username is absent from the OIDC token
    // (e.g. older oauth2-proxy images or Keycloak clients without the profile scope mapper).
    const username = isOauth2ProxyMode
      ? ((req.headers['x-auth-request-preferred-username'] as string | undefined) ??
        (req.headers['x-auth-request-user'] as string | undefined) ??
        'dev-user')
      : 'dev-user';
    const email = isOauth2ProxyMode
      ? ((req.headers['x-forwarded-email'] as string | undefined) ??
        (req.headers['x-auth-request-email'] as string | undefined) ??
        'dev@example.com')
      : 'dev@example.com';
    // Only warn when no auth headers are present at all — a true proxy bypass.
    const isProxied = !!(
      req.headers['x-auth-request-preferred-username'] ||
      req.headers['x-auth-request-user'] ||
      req.headers['x-auth-request-email'] ||
      req.headers['x-forwarded-email']
    );
    if (isOauth2ProxyMode && !isProxied) {
      // eslint-disable-next-line no-console
      console.warn(
        '[koku-ui-onprem] OAUTH2_PROXY_MODE=true but no oauth2-proxy auth headers received' +
          ' — oauth2-proxy may be misconfigured or the request bypassed the proxy'
      );
    }
    res.json({ username, email });
  });
  // Mirrors nginx: `location = /logout { return 302 /oauth2/sign_out?rd=/oauth2/start; }`
  devServer.app?.get('/logout', (_, res) => {
    res.redirect('/oauth2/sign_out?rd=/oauth2/start');
  });
  return middlewares;
};

if (!isOauth2ProxyMode && process.env.API_TOKEN !== 'false') {
  proxyHeaders = {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  };
}

const NODE_ENV = (process.env.NODE_ENV || 'development') as Configuration['mode'];

const rbacStaticDirectory = path.resolve(__dirname, '../rbac-ui-onprem/dist');

/** Gateway origin for `/api/rbac` when `API_PROXY_URL` targets Koku under `/api/cost-management/v1`. */
const rbacProxyTarget = (() => {
  const proxyUrl = process.env.API_PROXY_URL;
  if (!proxyUrl) {
    return undefined;
  }
  const match = proxyUrl.match(/^(.*)\/api\/cost-management\/v1\/?$/);
  return match ? match[1] : proxyUrl;
})();

let refresher: TokenRefresher | undefined;

if (NODE_ENV !== 'production' && !process.env.CI) {
  if (!process.env.API_PROXY_URL) {
    throw new Error(
      '[koku-ui-onprem] Missing required env var: API_PROXY_URL\n' +
        'Set it to the backend URL, e.g. https://koku-api.example.com:8000'
    );
  }

  if (!isOauth2ProxyMode) {
    const hasKeycloak =
      process.env.KEYCLOAK_TOKEN_URL && process.env.KEYCLOAK_CLIENT_ID && process.env.KEYCLOAK_CLIENT_SECRET;

    // When running the UI with a local koku API, API_TOKEN is omitted
    if (!hasKeycloak && !process.env.API_TOKEN) {
      throw new Error(
        '[koku-ui-onprem] No authentication configured for the dev proxy.\n' +
          'Provide one of:\n' +
          '  1. KEYCLOAK_TOKEN_URL + KEYCLOAK_CLIENT_ID + KEYCLOAK_CLIENT_SECRET  (auto-refresh)\n' +
          '  2. API_TOKEN  (static bearer token)\n' +
          '  3. OAUTH2_PROXY_MODE=true  (oauth2-proxy handles auth)\n' +
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
}

const config: Configuration & {
  devServer?: WebpackDevServerConfiguration;
} = {
  mode: NODE_ENV,
  devtool: 'eval-source-map',
  devServer: {
    // In oauth2-proxy mode webpack must bind to all interfaces so the proxy
    // container can reach it via host.containers.internal / host.docker.internal.
    host: isOauth2ProxyMode ? '0.0.0.0' : 'localhost',
    port: 9001,
    historyApiFallback: true,
    // In oauth2-proxy mode open the proxy port (9002) so the auth flow kicks in immediately.
    open: isOauth2ProxyMode ? `http://localhost:${process.env.ONPREM_AUTH_PORT ?? '9002'}/` : true,
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
      {
        directory: rbacStaticDirectory,
        publicPath: '/rbac/',
        watch: true,
      },
    ],
    client: {
      overlay: true,
    },
    setupMiddlewares,
    proxy: [
      refresher && !isOauth2ProxyMode
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
            // In oauth2-proxy mode proxyHeaders is undefined — the Authorization
            // header injected by oauth2-proxy is forwarded as-is to the gateway.
            ...(proxyHeaders && { headers: proxyHeaders }),
          },
      ...(rbacProxyTarget
        ? [
            refresher && !isOauth2ProxyMode
              ? createDevServerProxy(refresher, {
                  context: ['/api/rbac'],
                  target: rbacProxyTarget,
                  secure: false,
                })
              : {
                  context: ['/api/rbac'],
                  target: rbacProxyTarget,
                  changeOrigin: true,
                  secure: false,
                  ...(proxyHeaders && { headers: proxyHeaders }),
                },
          ]
        : []),
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/technology-icons'),
          to: path.resolve(__dirname, 'dist/apps/frontend-assets/technology-icons'),
        },
      ],
    }),
    new DefinePlugin({
      'process.env.ONPREM_UNLEASH_FLAGS': JSON.stringify(process.env.ONPREM_UNLEASH_FLAGS ?? ''),
    }),
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
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    cacheWithContext: false,
    alias: {
      '#': path.resolve(__dirname, 'src'),
      '@koku-ui/onprem-cloud-deps': path.resolve(__dirname, '../../libs/onprem-cloud-deps/src'),
      '@unleash/proxy-client-react': path.resolve(
        __dirname,
        '../../libs/onprem-cloud-deps/src/unleash/proxy-client-react.ts'
      ),
    },
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
