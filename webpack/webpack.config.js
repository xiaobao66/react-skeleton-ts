const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('build');
const PUBLIC_DIR = resolvePath('public');

// 获取命令行参数
const { argv } = require('yargs')
  .boolean('release')
  .default({
    release: false,
  });

const isDebug = !argv.release;

// alias
const alias = {
  src: SRC_DIR,
  config: path.join(SRC_DIR, 'config'),
  models: path.join(SRC_DIR, 'models'),
  pages: path.join(SRC_DIR, 'pages'),
};

module.exports = {
  context: ROOT_DIR,

  mode: isDebug ? 'development' : 'production',

  devtool: isDebug ? 'inline-source-map' : false,

  entry: {
    app: [
      ...(isDebug
        ? [
            'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true',
          ]
        : []),
      './src/index.js',
    ],
  },

  output: {
    path: BUILD_DIR,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug
      ? 'chunks/[name].js'
      : 'chunks/[name].[chunkhash:8].js',
    publicPath: '/',
  },

  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
    alias,
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [SRC_DIR],
        loader: 'babel-loader',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: isDebug,
    }),
    new CopyWebpackPlugin([
      {
        from: PUBLIC_DIR,
        to: 'public', // 相对于output
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.join(SRC_DIR, 'index.ejs'),
      filename: 'index.html',
      title: 'react-base',
      templateParameters: (compilation, assets, options) => {
        // v3版本这样写，升级到v4版本就需要进行变更
        return {
          compilation,
          webpack: compilation.getStats().toJson(),
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options,
          },
          __DEV__: isDebug,
        };
      },
    }),
    ...(isDebug
      ? [new webpack.HotModuleReplacementPlugin()]
      : [new CleanWebpackPlugin()]),
  ],
};
