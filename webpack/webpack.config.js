const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 分析构建结果
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('build');
const PUBLIC_DIR = resolvePath('public');
const CONFIG_DIR = resolvePath('webpack');

// 获取命令行参数
const { argv } = require('yargs')
  .boolean('release')
  .boolean('analyze')
  .boolean('verbose')
  .default({
    release: false,
    analyze: false,
    verbose: false,
  });

const isDebug = !argv.release;
const isAnalyze = argv.analyze;
const isVerbose = argv.verbose;

// alias
const alias = {
  src: SRC_DIR,
  config: path.join(SRC_DIR, 'config'),
  models: path.join(SRC_DIR, 'models'),
  pages: path.join(SRC_DIR, 'pages'),
  assets: path.join(SRC_DIR, 'assets'),
};

const staticAssetName = isDebug ? '[name].[ext]?[hash:8]' : '[hash:8].[ext]';
const staticImagePath = 'images';
const staticFontPath = 'fonts';

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

  optimization: {
    splitChunks: {
      cacheGroups: {
        // 抽取node_modules中的js模块
        vendors: {
          name: 'vendors',
          // Note the usage of `[\\/]` as a path separator for cross-platform compatibility
          test: /[\\/]node_modules[\\/].*\.js$/,
          chunks: 'initial',
        },
        // 将样式文件打包到一起
        styles: {
          name: 'styles',
          test: /\.(css|less|scss)$/,
          chunks: 'all',
          enforce: true, // 忽略chunks的一些限制条件(比如：minSize、minChunks)，强制抽取
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [SRC_DIR],
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.(css|less|scss)$/,
        // 内嵌rules需要注意放置顺序
        // 匹配时，从下到上逐条匹配，遇到匹配的就会执行，并且不中断匹配过程，直到第一条规则匹配完毕
        rules: [
          {
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: isDebug,
                  // reloadAll: isDebug, // 如果hmr使用不正确才启用
                },
              },
            ],
          },
          {
            oneOf: [
              {
                resourceQuery: /local/,
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      sourceMap: isDebug,
                      modules: {
                        mode: 'local',
                        localIdentName: isDebug
                          ? '[path][name]__[local]'
                          : '[hash:base64:5]',
                      },
                      importLoaders: 1,
                    },
                  },
                ],
              },
              {
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      sourceMap: isDebug,
                    },
                  },
                ],
              },
            ],
          },
          {
            use: [
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: CONFIG_DIR,
                  },
                },
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
          {
            test: /\.scss$/,
            use: [
              {
                loader: 'resolve-url-loader',
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        // oneOf配置需要注意规则放置顺序
        // 匹配时，从上到下逐条规则进行匹配，先匹配到的生效，无视后续规则，即使后面的规则也能匹配
        oneOf: [
          {
            issuer: /\.(css|less|scss)$/,
            oneOf: [
              {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                  {
                    loader: 'svg-url-loader',
                    options: {
                      limit: 4096, // 4kb
                      name: staticAssetName,
                      outputPath: staticImagePath,
                    },
                  },
                ],
              },
              {
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 4096, // 4kb
                      name: staticAssetName,
                      outputPath: staticImagePath,
                    },
                  },
                ],
              },
            ],
          },
          {
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: staticAssetName,
                  outputPath: staticImagePath,
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(ttf|otf|woff(2)?|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: staticAssetName,
              outputPath: staticFontPath,
            },
          },
        ],
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
      title: 'react-skeleton',
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
    new MiniCssExtractPlugin({
      filename: isDebug ? '[name].css' : '[name].[contenthash:8].css',
      chunkFilename: isDebug
        ? 'chunks/[id].css'
        : 'chunks/[id].[contenthash:8].css',
      ignoreOrder: true, // 去除css使用顺序冲突
    }),
    ...(isAnalyze
      ? [new BundleAnalyzerPlugin(), new DuplicatePackageCheckerPlugin()]
      : []),
    ...(isDebug
      ? [
          // 如果使用了dll才注入相应文件
          ...(fs.existsSync(resolvePath('node_modules/react-skeleton/dll'))
            ? [
                new webpack.DllReferencePlugin({
                  // 链接dll
                  manifest: require(resolvePath(
                    'node_modules/react-skeleton/dll',
                    'dependencies.manifest.json',
                  )),
                }),
                new CopyWebpackPlugin([
                  {
                    from: resolvePath('node_modules/react-skeleton/dll'),
                    to: 'dll', // 相对于output
                  },
                ]),
                new HtmlWebpackTagsPlugin({
                  // 将dll库文件插入到html中，需要放在HtmlWebpackTagsPlugin之后
                  append: false,
                  scripts: ['dll/dependencies.dll.js'],
                }),
              ]
            : []),
          new webpack.HotModuleReplacementPlugin(),
        ]
      : [new CleanWebpackPlugin()]),
  ],

  stats: {
    cached: false,
    cachedAssets: false,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
  },
};
