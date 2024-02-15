// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
  moduleNameMapper: {
    db: '<rootDir>/db/',
    '~/(.*)': '<rootDir>/src/$1',
  },
  preset: 'react-native',
  resetMocks: true,
  roots: [
    '<rootDir>/src/',
    '<rootDir>/db/',
    '<rootDir>/__tests__/',
    '<rootDir>/__mocks__/',
  ],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/vendor/',
    '<rootDir>/ios/',
    '<rootDir>/android/',
    '<rootDir>/assets/',
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@react-rxjs|@rx-state|@react-native|react-native)/)',
  ],
};
