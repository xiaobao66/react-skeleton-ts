const fs = require('fs');
const path = require('path');

module.exports = ({
  context = path.resolve(__dirname, '..'),
  dir = './src/themes',
  exclude = ['default.less'],
  namespace = 'themes',
} = {}) => {
  const dirPath = path.resolve(context, dir);
  const entries = {};
  // 读取theme目录下文件
  const files = fs.readdirSync(dirPath);
  files
    .filter(file => !exclude.includes(file))
    .forEach(file => {
      const REGEXP_NAME = /(\w+)\.(less|scss|sass)/;
      const match = file.match(REGEXP_NAME);
      if (match) {
        const [, name] = match;
        entries[`${namespace}/${name}`] = path.resolve(dirPath, file);
      }
    });

  return {
    REGEXP_THEME_NAME: new RegExp(`^${namespace}\\/(.+)`),
    entries,
  };
};
