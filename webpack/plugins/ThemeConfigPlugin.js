const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

class ThemeConfigPlugin {
  constructor(options = {}) {
    this.options = {
      entry: options.entry,
      output: options.output || 'themes',
      entryDir: options.entryDir || '',
    };
  }

  filterChunks(chunks, excludedChunks) {
    return chunks.filter(chunk => {
      return excludedChunks.every(
        excludedChunk => chunk.indexOf(excludedChunk) === -1,
      );
    });
  }

  apply(compiler) {
    // 读取themeDir目录下文件
    const { entry, output, entryDir } = this.options;
    const entries = {};

    Object.keys(entry).forEach(name => {
      let entryPath = entry[name];
      if (!path.isAbsolute(entryPath)) {
        entryPath = path.resolve(entryDir, entryPath);
      }

      entries[`${output}/${name}`] = entryPath;
    });

    // 添加新的entries
    compiler.hooks.entryOption.tap('ThemeConfigPlugin', context => {
      Object.keys(entries).forEach(key => {
        new SingleEntryPlugin(context, entries[key], key).apply(compiler);
      });
    });

    // 删除html文件中由theme生成的引用
    compiler.hooks.compilation.tap('ThemeConfigPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tap(
        'ThemeConfigPlugin',
        ({ assets }) => {
          return {
            assets: {
              ...assets,
              css: this.filterChunks(assets.css, Object.keys(entries)),
              js: this.filterChunks(assets.js, Object.keys(entries)),
            },
          };
        },
      );
    });

    // 删除多余的js文件，并修改css文件名
    compiler.hooks.emit.tapAsync(
      'ThemeConfigPlugin',
      (compilation, callback) => {
        Object.keys(compilation.assets)
          .filter(asset => {
            return new RegExp(`^${output}\\/(.+)\\.(js|css)$`).test(asset);
          })
          .forEach(asset => {
            const REGEXP_CSS_NAME = new RegExp(
              `^${output}\\/((?:\\w+(?:\\/)?)+)(\\..+)?\\.css$`,
            );
            const match = asset.match(REGEXP_CSS_NAME);

            if (match) {
              const [, name] = match;
              compilation.assets[`${output}/${name}.css`] =
                compilation.assets[asset];
            }

            if (compilation.options.mode === 'production' || !match) {
              delete compilation.assets[asset];
            }
          });

        callback();
      },
    );
  }
}

module.exports = ThemeConfigPlugin;
