import type * as StyleTypes from './types';
import { appFonts } from './fonts';

export type { StyleTypes };
export { setupInitialTheme, useAppColorScheme } from './lib';
export * from './themes';

export { appFonts };

export const screenPaddings = {
  paddingHorizontal: 6,
  paddingVertical: 10,
};

export const buttonBaseText = {
  fontSize: 18,
};

export const buttonBase = {
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 8,
};

export const inputBaseContainer = {
  marginBottom: 16,
};

export const inputBaseLabel = () => ({
  // color: theme.colors.text.secondary,
  fontSize: 20,
  marginBottom: 6,
});

export const inputBaseInputWrapper = (theme: StyleTypes.BaseAppTheme) => ({
  borderColor: theme.colors.secondary.default,
  borderRadius: 4,
  borderWidth: 2,
  paddingHorizontal: 6,
});

export const inputBaseInput = (theme: StyleTypes.BaseAppTheme) => ({
  color: theme.colors.text.primary,
  fontSize: 18,
  paddingVertical: 14,
});

export const inputBaseError = (theme: StyleTypes.BaseAppTheme) => ({
  color: theme.colors.error.default,
  fontSize: 16,
  paddingTop: 4,
});

export const listItem = (
  theme: StyleTypes.BaseAppTheme,
  options: { isFirst: boolean; isLast: boolean },
) => ({
  backgroundColor: theme.colors.background.default,
  borderBottomWidth: options.isLast ? 0 : 1,
  borderColor: theme.colors.grey[200],
  paddingHorizontal: 14,
  paddingVertical: 12,
  width: '100%' as const,
  ...(options.isFirst
    ? { borderTopLeftRadius: 6, borderTopRightRadius: 6 }
    : {}),
  ...(options.isLast
    ? { borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }
    : {}),
});

export const swipableListItemLastActionButton = (
  theme: StyleTypes.BaseAppTheme,
  options: { isFirst: boolean; isLast: boolean },
) => ({
  borderBottomRightRadius: options.isLast ? 6 : 0,
  borderTopRightRadius: options.isFirst ? 6 : 0,
});
