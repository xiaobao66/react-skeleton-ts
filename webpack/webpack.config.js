const path = require('path');
const webpack = require('webpack');

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('build');

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
};

module.exports = {
  context: ROOT_DIR,

  mode: isDebug ? 'development' : 'production',

  devtool: isDebug ? 'inline-source-map' : false,

  entry: {
    app: [
      './src/index.js',
    ],
  },

  output: {
    path: BUILD_DIR,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunckFilename: isDebug ? 'chunks/[name].js' : 'chunks/[name].[chunkhash:8].js',
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
};
