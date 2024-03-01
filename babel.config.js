/* eslint-disable */
module.exports = {
  presets: ['@babel/preset-env', 'module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        root: ['./', './src'],
        alias: {
          '~': ['./src/'],
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
