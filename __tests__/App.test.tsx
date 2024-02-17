import { render } from '@testing-library/react-native';
import { Database as WatermelonDb } from '@nozbe/watermelondb';
import App from '~/App';

jest.mock('db');

beforeAll(() => {
  // Redefine how watermelondb Database class checks its instances, so it won't
  // shout on mocked one
  Object.defineProperty(WatermelonDb, Symbol.hasInstance, {
    value() {
      return true;
    },
  });
});

it('renders correctly', () => {
  render(<App />);
});
