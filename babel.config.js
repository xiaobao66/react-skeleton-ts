module.exports = api => {
  // api.env必须放在api.cache前
  // https://github.com/babel/babel/issues/10052#issuecomment-498923667
  const isDebug = api.env(['development']);

  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: { version: 3, proposals: false },
          forceAllTransforms: !isDebug, // for UglifyJS
        },
      ],
      ['@babel/preset-react', { development: isDebug }],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
    ],
  };
};
