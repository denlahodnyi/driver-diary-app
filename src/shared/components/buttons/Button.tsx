import {
  type StyleProp,
  type TextStyle,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { toArray } from '~/shared/utils';
import { buttonBase, buttonBaseText } from '~/app/styles';
import Txt from '../text/Txt';

type ButtonProps = TouchableOpacityProps & {
  color?: string;
  fontSize?: number;
  isPrimary?: boolean;
  isSecondary?: boolean;
  title?: string;
  titleColor?: string;
  titleStyle?: StyleProp<TextStyle>;
  variant?: 'filled' | 'outlined' | 'text';
};

export default function Button(props: ButtonProps) {
  const {
    children,
    color,
    fontSize,
    isPrimary = false,
    isSecondary = false,
    style,
    title = 'Button',
    titleColor,
    titleStyle,
    variant = 'filled',
    ...rest
  } = props;
  const { styles } = useStyles(stylesheet, {
    variant,
  });

  return (
    <TouchableOpacity
      style={[
        styles.button({ color, isPrimary, isSecondary }),
        ...toArray(style),
      ]}
      {...rest}
    >
      <Txt
        style={[
          styles.title({ color, fontSize, isPrimary, isSecondary, titleColor }),
          ...toArray(titleStyle),
        ]}
      >
        {children || title}
      </Txt>
    </TouchableOpacity>
  );
}

type StyleParam = {
  color?: string;
  fontSize?: number;
  isPrimary?: boolean;
  isSecondary?: boolean;
  titleColor?: string;
};

const stylesheet = createStyleSheet((theme) => ({
  button: ({ color, isPrimary, isSecondary }: StyleParam) => {
    const finalColor = isPrimary
      ? theme.colors.primary.default
      : isSecondary
      ? theme.colors.secondary.default
      : color;

    return {
      ...buttonBase,
      variants: {
        variant: {
          filled: {
            backgroundColor: finalColor,
          },
          outlined: {
            borderColor: finalColor,
            borderWidth: 1,
          },
        },
      },
    };
  },
  title: ({
    color,
    fontSize,
    isPrimary,
    isSecondary,
    titleColor,
  }: StyleParam) => {
    const finalColor = isPrimary
      ? theme.colors.primary.contrastText
      : isSecondary
      ? theme.colors.secondary.contrastText
      : titleColor
      ? titleColor
      : color;

    return {
      ...buttonBaseText,
      ...(fontSize ? { fontSize } : {}),
      variants: {
        variant: {
          default: {
            color: finalColor,
          },
          filled: {
            color: isPrimary
              ? theme.colors.primary.contrastText
              : isSecondary
              ? theme.colors.secondary.contrastText
              : titleColor
              ? titleColor
              : '#FFF',
          },
          outlined: {
            color: isPrimary
              ? theme.colors.primary.default
              : isSecondary
              ? theme.colors.secondary.default
              : titleColor
              ? titleColor
              : color,
          },
          text: {
            color: isPrimary
              ? theme.colors.primary.default
              : isSecondary
              ? theme.colors.secondary.default
              : titleColor
              ? titleColor
              : color,
          },
        },
      },
    };
  },
}));
