module.exports = {
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 2,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-modules-umd'
  ]
};
