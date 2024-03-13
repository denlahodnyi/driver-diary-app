// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const { APP_ENV } = process.env;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // Reset cache to pull correct APP_ENV
  cacheVersion: APP_ENV || 'xyz',
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
