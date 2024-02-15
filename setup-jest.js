import '@testing-library/react-native/extend-expect';
import * as matchers from 'jest-extended';

expect.extend(matchers);

beforeAll(() => {
  // Hide console.warn/error in test results
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
  jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});
