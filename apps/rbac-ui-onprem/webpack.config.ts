import { DynamicRemotePlugin } from '@openshift/dynamic-plugin-sdk-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { DefinePlugin, NormalModuleReplacementPlugin } from 'webpack';

const NODE_ENV = (process.env.NODE_ENV || 'development') as Configuration['mode'];

const distDir = path.resolve(__dirname, './dist');
const srcDir = path.resolve(__dirname, './src');
const useAppLinkShim = path.join(srcDir, 'shims/insights-rbac/useAppLink.ts');

const insightsRbacModuleReplacements: readonly { match: RegExp; replacement: string }[] = [
  {
    match: /[/\\]insights-rbac-frontend[/\\]src[/\\]shared[/\\]hooks[/\\]useAppLink\.ts$/,
    replacement: useAppLinkShim,
  },
];

const rbacPkgRoot = path.dirname(require.resolve('insights-rbac-frontend/package.json'));
const rbacSrcDir = path.join(rbacPkgRoot, 'src');
const onpremDepsSrc = path.resolve(__dirname, '../../libs/onprem-cloud-deps/src');

const exposedModules = {
  './Iam': './src/entry.tsx',
};

const config: Configuration = {
  entry: Object.values(exposedModules),
  mode: NODE_ENV,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules\/(?!insights-rbac-frontend)/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              allowTsInNodeModules: true,
              transpileOnly: true,
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
          srcDir,
          rbacSrcDir,
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
          srcDir,
          rbacSrcDir,
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
    publicPath: '/rbac/',
    chunkFilename: '[name].bundle-[contenthash].js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(rbacSrcDir, 'locales'),
          to: path.join(distDir, 'locales'),
          noErrorOnMissing: true,
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
        '@patternfly/react-core': { singleton: true, requiredVersion: '*' },
        '@patternfly/react-table': { singleton: true, requiredVersion: '*' },
        // Do not share component-groups — historical PF chunk 6658 / SkeletonTable ThBase loop on cluster nginx.
      },
      pluginMetadata: {
        name: 'insightsRbac',
        version: '0.0.1',
        exposedModules,
      },
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      'process.env.ONPREM_UNLEASH_FLAGS': JSON.stringify(process.env.ONPREM_UNLEASH_FLAGS ?? ''),
    }),
    ...insightsRbacModuleReplacements.map(
      ({ match, replacement }) => new NormalModuleReplacementPlugin(match, replacement)
    ),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    cacheWithContext: false,
    modules: [
      srcDir,
      rbacSrcDir,
      path.join(rbacPkgRoot, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
    ],
    alias: {
      'insights-rbac-frontend': rbacPkgRoot,
      [path.join(rbacSrcDir, 'shared/hooks/useAppLink')]: useAppLinkShim,
      '@redhat-cloud-services/frontend-components/useChrome': path.join(
        onpremDepsSrc,
        'frontend-components/useChrome.ts'
      ),
      '@redhat-cloud-services/frontend-components/AsyncComponent': path.join(
        onpremDepsSrc,
        'frontend-components/AsyncComponent.tsx'
      ),
      '@redhat-cloud-services/frontend-components-utilities/RBACHook': path.join(
        onpremDepsSrc,
        'frontend-components-utilities/RBACHook.ts'
      ),
      '@unleash/proxy-client-react': path.join(onpremDepsSrc, 'unleash/proxy-client-react.ts'),
    },
  },
};

if (NODE_ENV === 'production') {
  config.optimization = {
    splitChunks: false,
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
