const fs = require('fs');
const path = require('path');

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  }
  if (m.name) {
    return m.name;
  }
  return false;
}

module.exports = ({
  context = path.resolve(__dirname, '..'),
  dir = './src/themes',
  exclude = ['default.less'],
  namespace = 'themes',
} = {}) => {
  const dirPath = path.resolve(context, dir);
  const entries = {};
  const cacheGroups = {};
  // 读取theme目录下文件
  const files = fs.readdirSync(dirPath);
  files
    .filter(file => !exclude.includes(file))
    .forEach(file => {
      const REGEXP_NAME = /(\w+)\.(less|scss|sass)/;
      const match = file.match(REGEXP_NAME);
      if (match) {
        const [, name] = match;
        const key = `${namespace}/${name}`;
        entries[key] = path.resolve(dirPath, file);
        cacheGroups[key] = {
          name: key,
          test: (module, chunks) => {
            return (
              module.constructor.name === 'CssModule' &&
              recursiveIssuer(module) === key
            );
          },
          chunks: 'all',
          enforce: true,
        };
      }
    });

  return {
    REGEXP_THEME_NAME: new RegExp(`^${namespace}\\/(.+)`),
    entries,
    cacheGroups,
    recursiveIssuer,
  };
};
