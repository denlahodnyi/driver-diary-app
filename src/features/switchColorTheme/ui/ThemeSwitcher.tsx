import { TouchableOpacity, View } from 'react-native';
import {
  UnistylesRuntime,
  createStyleSheet,
  useStyles,
} from 'react-native-unistyles';
import { type PrefUserTheme, useStorageString } from '~/app/storage';
import { Txt } from '~/shared/components';

export default function ThemeSwitcher() {
  const { styles } = useStyles(stylesheet);
  const [userTheme, setUserTheme] = useStorageString('colorTheme');

  const handleThemeChange = (themeName: PrefUserTheme) => {
    setUserTheme(themeName);
    if (themeName === 'auto') {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(themeName);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, userTheme === 'dark' && styles.buttonSelected]}
        onPress={() => handleThemeChange('dark')}
      >
        <Txt
          style={[
            styles.buttonText,
            userTheme === 'dark' && styles.buttonTextSelected,
          ]}
        >
          Dark
        </Txt>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, userTheme === 'light' && styles.buttonSelected]}
        onPress={() => handleThemeChange('light')}
      >
        <Txt
          style={[
            styles.buttonText,
            userTheme === 'light' && styles.buttonTextSelected,
          ]}
        >
          Light
        </Txt>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, userTheme === 'auto' && styles.buttonSelected]}
        onPress={() => handleThemeChange('auto')}
      >
        <Txt
          style={[
            styles.buttonText,
            userTheme === 'auto' && styles.buttonTextSelected,
          ]}
        >
          Auto
        </Txt>
      </TouchableOpacity>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buttonSelected: {
    backgroundColor: theme.colors.background.light,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: 20,
  },
  buttonTextSelected: {
    color: theme.colors.surface.contrastText,
  },
  container: {
    backgroundColor: theme.colors.background.default,
    borderRadius: 6,
    flexDirection: 'row',
    padding: 2,
  },
}));
