const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin({
  branch: true,
});
const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const distDir = path.resolve(__dirname, './public/');
const gitBranch = gitRevisionPlugin.branch();
let insightsDeployment = 'insights';
if (gitBranch === 'master') {
  insightsDeployment = 'insightsbeta';
}
const publicPath = `/${insightsDeployment}/platform/cost-management/`;

module.exports = env => {
  const isProduction = env === 'production';
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
      require.resolve('patternfly/dist/css/patternfly.css'),
      require.resolve('patternfly/dist/css/patternfly-additions.css'),
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
          use: [
            {
              loader: 'ts-loader',
            },
            !isProduction && {
              loader: 'babel-loader',
              options: {
                plugins: [
                  '@babel/plugin-syntax-typescript',
                  [
                    '@babel/plugin-syntax-decorators',
                    {
                      legacy: true,
                    },
                  ],
                  '@babel/plugin-syntax-jsx',
                  '@babel/plugin-syntax-dynamic-import',
                  'react-hot-loader/babel',
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
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: fileRegEx,
          loader: 'file-loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.APP_NAMESPACE': JSON.stringify(process.env.APP_NAMESPACE),
        'process.env.APP_PROTOCOL': JSON.stringify(process.env.APP_PROTOCOL),
        'process.env.APP_PORT': JSON.stringify(process.env.APP_PORT),
        'process.env.DEV_USER': JSON.stringify(process.env.DEV_USER),
        'process.env.DEV_PASSWORD': JSON.stringify(process.env.DEV_PASSWORD),
        'process.env.VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'process.env.COMMITHASH': JSON.stringify(
          gitRevisionPlugin.commithash()
        ),
        'process.env.BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(srcDir, 'locales'),
          to: path.join(distDir, 'locales'),
        },
      ]),

      new HtmlWebpackPlugin({
        template: path.join(srcDir, 'index.html'),
      }),

      new MiniCssExtractPlugin({
        filename: isProduction ? '[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[contenthash].css' : '[id].css',
      }),
      // development plugins
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      //production plugins
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/](react|react-dom|redux)[\\/]/,
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
      contentBase: distDir,
      historyApiFallback: true,
      hot: true,
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
