// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';
import '@testing-library/react-native/extend-expect';
import * as matchers from 'jest-extended';

expect.extend(matchers);

beforeAll(() => {
  // Hide console.warn/error in test results
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

jest.mock(
  '@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.native.js',
  () => {
    return jest.requireActual(
      '@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.js',
    );
  },
);
