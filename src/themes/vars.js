const { argv } = require('yargs')
  .string('theme')
  .default({
    theme: 'default',
  });

const themes = {
  default: {
    'primary-color': '#1890ff',
  },
  test: {
    'primary-color': '#1DA57A',
  },
};

module.exports = themes[argv.theme];
