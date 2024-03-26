export type BaseAppTheme = {
  colors: {
    background: {
      dark: string;
      default: string;
      light: string;
    };
    error: {
      default: string;
    };
    grey: {
      [key: number]: string;
      default: string;
    };
    primary: {
      contrastText: string;
      dark: string;
      default: string;
      light: string;
    };
    secondary: {
      contrastText: string;
      dark: string;
      default: string;
      light: string;
    };
    surface: {
      contrastText: string;
      default: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
  };
  isDark: boolean;
};

export type AppThemes = {
  dark: BaseAppTheme;
  light: BaseAppTheme;
};

export type AppThemeNames = keyof AppThemes;
