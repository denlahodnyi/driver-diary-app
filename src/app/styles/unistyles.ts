import { UnistylesRegistry } from 'react-native-unistyles';
import { darkTheme, lightTheme } from './themes';
import type { AppThemes } from './types';

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addThemes({
  dark: darkTheme,
  light: lightTheme,
});
