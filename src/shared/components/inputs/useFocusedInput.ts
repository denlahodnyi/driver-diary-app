import { useState } from 'react';
import { useStyles } from 'react-native-unistyles';

export default function useFocusedInput() {
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useStyles();

  return {
    inputStyle: isFocused ? { borderColor: theme.colors.primary.default } : {},
    props: {
      onBlur: () => setIsFocused(false),
      onFocus: () => setIsFocused(true),
    },
  };
}
