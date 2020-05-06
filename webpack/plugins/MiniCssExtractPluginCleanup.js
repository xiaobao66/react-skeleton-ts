class MiniCssExtractPluginCleanup {
  constructor(options = {}) {}

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'MiniCssExtractPluginCleanup',
      (compilation, callback) => {
        Object.keys(compilation.assets)
          .filter(asset => {
            return /^themes\/(\w+)\.js/.test(asset);
          })
          .forEach(asset => {
            delete compilation.assets[asset];
          });

        callback();
      },
    );
  }
}

module.exports = MiniCssExtractPluginCleanup;
