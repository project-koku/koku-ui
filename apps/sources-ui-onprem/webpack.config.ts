import { DynamicRemotePlugin } from '@openshift/dynamic-plugin-sdk-webpack';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserJSPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { DefinePlugin, NormalModuleReplacementPlugin } from 'webpack';

const NODE_ENV = (process.env.NODE_ENV || 'development') as Configuration['mode'];

const distDir = path.resolve(__dirname, './dist');
const srcDir = path.resolve(__dirname, './src');
const onpremDepsSrc = path.resolve(__dirname, '../../libs/onprem-cloud-deps/src');

const sourcesPkgRoot = path.dirname(require.resolve('sources-ui/package.json'));
const sourcesSrcDir = path.join(sourcesPkgRoot, 'src');

const entitiesShim = path.join(srcDir, 'shims/entities.js');
const tabNavigationShim = path.join(srcDir, 'shims/TabNavigation.tsx');
const availabilityCheckerShim = path.join(srcDir, 'shims/AvailabilityChecker.tsx');
const applicationsCardShim = path.join(srcDir, 'shims/ApplicationsCard.tsx');
// const applicationResourcesCardShim = path.join(srcDir, 'shims/ApplicationResourcesCard.tsx');
const utilsShim = path.join(srcDir, 'shims/utils.ts');
const computeSourcesUrlShim = path.join(srcDir, 'shims/computeSourcesUrl.ts');

const replaceWithShim =
  (shimPath: string) => (result: { request?: string; createData?: { resource?: string; context?: string } }) => {
    if (result.createData) {
      result.createData.resource = shimPath;
      result.createData.context = path.dirname(shimPath);
      return;
    }
    result.request = shimPath;
  };

const moduleReplacements: readonly { match: RegExp; replacement: string }[] = [
  {
    match: /[/\\]sources-ui[/\\]src[/\\]api[/\\]entities\.js$/,
    replacement: entitiesShim,
  },
  {
    match: /[/\\]sources-ui[/\\]src[/\\]components[/\\]TabNavigation\.js$/,
    replacement: tabNavigationShim,
  },
  {
    match: /[/\\]sources-ui[/\\]src[/\\]components[/\\]SourceDetail[/\\]AvailabilityChecker\.js$/,
    replacement: availabilityCheckerShim,
  },
  {
    match: /[/\\]sources-ui[/\\]src[/\\]components[/\\]SourceDetail[/\\]ApplicationsCard\.js$/,
    replacement: applicationsCardShim,
  },
  // Temporarily omitted so the upstream "Manage connected applications" card can be screenshotted.
  // {
  //   match: /[/\\]sources-ui[/\\]src[/\\]components[/\\]SourceDetail[/\\]ApplicationResourcesCard\.js$/,
  //   replacement: applicationResourcesCardShim,
  // },
  {
    match: /[/\\]sources-ui[/\\]src[/\\]utilities[/\\]utils\.js$/,
    replacement: utilsShim,
  },
  {
    match: /[/\\]sources-ui[/\\]src[/\\]utilities[/\\]computeSourcesUrl\.js$/,
    replacement: computeSourcesUrlShim,
  },
];

const exposedModules = {
  './RootApp': './src/entry.tsx',
};

const config: Configuration = {
  entry: Object.values(exposedModules),
  mode: NODE_ENV,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules\/(?!sources-ui\/)/,
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
          sourcesSrcDir,
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
          sourcesSrcDir,
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
    publicPath: '/sources-ui-onprem/',
    chunkFilename: '[name].bundle-[contenthash].js',
  },
  plugins: [
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
      },
      pluginMetadata: {
        name: 'sources-ui-onprem',
        version: '0.0.1',
        exposedModules,
      },
    }),
    new DefinePlugin({
      'process.env.ONPREM_UNLEASH_FLAGS': JSON.stringify(process.env.ONPREM_UNLEASH_FLAGS ?? ''),
      'process.env.BASE_PATH': JSON.stringify('/api'),
    }),
    ...moduleReplacements.map(
      ({ match, replacement }) => new NormalModuleReplacementPlugin(match, replaceWithShim(replacement))
    ),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    cacheWithContext: false,
    modules: [
      srcDir,
      sourcesSrcDir,
      path.join(sourcesPkgRoot, 'node_modules'),
      path.resolve(__dirname, '../../node_modules'),
    ],
    alias: {
      'sources-ui': sourcesPkgRoot,
      '@redhat-cloud-services/frontend-components$': path.join(srcDir, 'shims/frontendComponentsIndex.ts'),
      '@redhat-cloud-services/frontend-components/useChrome': path.join(
        onpremDepsSrc,
        'frontend-components/useChrome.ts'
      ),
      '@redhat-cloud-services/frontend-components/AsyncComponent': path.join(
        onpremDepsSrc,
        'frontend-components/AsyncComponent.tsx'
      ),
      '@unleash/proxy-client-react': path.join(srcDir, 'shims/unleash.ts'),
      '@project-kessel/react-kessel-access-check': path.join(srcDir, 'shims/kessel.tsx'),
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
