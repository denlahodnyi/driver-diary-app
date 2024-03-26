import { Text, type TextProps } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { toArray } from '~/shared/utils';
import { appFonts } from '~/app/styles';

type AppFonts = typeof appFonts;
type FontFamilies = keyof AppFonts;

export type TxtProps<TFontFamily extends FontFamilies = 'Poppins'> =
  TextProps & {
    fontFamily?: TFontFamily;
    fontWeight?: keyof AppFonts[TFontFamily];
  };

const isFontWeight = <T extends FontFamilies>(
  ff: T,
  fw: string | number | symbol,
): fw is keyof AppFonts[T] => {
  return Object.hasOwn(appFonts[ff], fw);
};

export default function Txt<T extends FontFamilies = 'Poppins'>(
  props: TxtProps<T>,
) {
  const {
    children,
    fontFamily = 'Poppins',
    fontWeight = 'regular',
    style,
    ...rest
  } = props;
  const { styles } = useStyles(stylesheet);

  // Typescript infers fontWeight as string | number | symbol, so
  // type guard is used here to properly narrow its type
  const fw = isFontWeight(fontFamily, fontWeight) ? fontWeight : 'regular';

  return (
    <Text
      style={[styles.text, styles.textFont(fw, fontFamily), ...toArray(style)]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.colors.text.primary,
  },
  textFont: (
    fontWeight: keyof AppFonts[FontFamilies],
    fontFamily: FontFamilies,
  ) => ({
    fontFamily: appFonts[fontFamily][fontWeight],
  }),
}));
