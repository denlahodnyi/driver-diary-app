import { useColorScheme } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { storage, useStorageString } from '../storage';
import { type AppThemeNames } from './types';

export function setupInitialTheme() {
  const userTheme = storage.getString('colorTheme');

  if (userTheme) {
    if (userTheme === 'auto') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setTheme(userTheme);
    }
  } else {
    storage.set('colorTheme', 'light');
    UnistylesRuntime.setTheme('light');
  }
}

export function useAppColorScheme(): AppThemeNames {
  const [userSelectedTheme] = useStorageString('colorTheme');
  const colorScheme = useColorScheme();

  return userSelectedTheme === 'auto'
    ? colorScheme || 'light'
    : userSelectedTheme || 'light';
}
