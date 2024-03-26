import type { Theme } from '@react-navigation/native';
import type { BaseAppTheme } from './types';

export const lightTheme: BaseAppTheme = {
  colors: {
    background: {
      dark: '#7d7d7d',
      default: '#e7e7e7',
      light: '#f6f6f6',
    },
    error: {
      default: '#d41138',
    },
    grey: {
      100: '#e7e7e7',
      200: '#d1d1d1',
      400: '#888888',
      500: '#6d6d6d',
      600: '#5d5d5d',
      800: '#454545',
      default: 'grey',
    },
    primary: {
      contrastText: '#FFF',
      dark: '',
      default: '#fb6a14',
      light: '#ffd4a9',
    },
    secondary: {
      contrastText: '#FFF',
      dark: '#000',
      default: '#000',
      light: '',
    },
    surface: {
      contrastText: '#0a0a0a',
      default: '#FFF',
    },
    text: {
      primary: '#0a0a0a',
      secondary: '#5d5d5d',
    },
  },
  isDark: false,
};

export const darkTheme: BaseAppTheme = {
  colors: {
    background: {
      dark: '#272525',
      default: '#474443',
      light: '#615b59',
    },
    error: {
      default: '#f73c53',
    },
    grey: {
      100: '#e7e7e7',
      200: '#d1d1d1',
      400: '#888888',
      500: '#6d6d6d',
      600: '#5d5d5d',
      800: '#454545',
      default: 'grey',
    },
    primary: {
      contrastText: '#FFF',
      dark: '',
      default: '#c4390a',
      light: '#ffd4a9',
    },
    secondary: {
      contrastText: '#0a0a0a',
      dark: '#FAFAFA',
      default: '#FAFAFA',
      light: '',
    },
    surface: {
      contrastText: '#FFF',
      default: '#474443',
    },
    text: {
      primary: '#FFF',
      secondary: '#f0f0f0',
    },
  },
  isDark: true,
};

export const navigatorLightTheme: Theme = {
  colors: {
    background: lightTheme.colors.background.light,
    border: lightTheme.colors.grey[400],
    card: lightTheme.colors.primary.default,
    notification: lightTheme.colors.primary.default,
    primary: '#FFF',
    text: '#FFF',
  },
  dark: false,
};

export const navigatorDarkTheme: Theme = {
  colors: {
    background: darkTheme.colors.background.dark,
    border: darkTheme.colors.grey.default,
    card: darkTheme.colors.background.default,
    notification: darkTheme.colors.primary.default,
    primary: '#FFF',
    text: '#FFF',
  },
  dark: true,
};
