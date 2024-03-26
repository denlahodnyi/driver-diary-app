import { useMemo } from 'react';
import { SafeAreaView, View } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useFlipper } from '@react-navigation/devtools';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Database } from 'db';
import { RootNavigator } from './app/navigation';
import { setInitialStorageData } from './app/storage';
import {
  navigatorDarkTheme,
  navigatorLightTheme,
  setupInitialTheme,
  useAppColorScheme,
} from './app/styles';
import './app/styles/unistyles';

const database = Database.getInstance();

setInitialStorageData();
setupInitialTheme();

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef();
  const colorTheme = useAppColorScheme();
  const { styles } = useStyles(stylesheet);

  useFlipper(navigationRef);

  const navigationContainerTheme = useMemo(
    () => (colorTheme === 'light' ? navigatorLightTheme : navigatorDarkTheme),
    [colorTheme],
  );

  return (
    <SafeAreaView
      style={styles.container(navigationContainerTheme.colors.card)}
    >
      <View style={styles.content}>
        <DatabaseProvider database={database}>
          <NavigationContainer
            ref={navigationRef}
            theme={navigationContainerTheme}
          >
            <RootNavigator />
          </NavigationContainer>
        </DatabaseProvider>
      </View>
    </SafeAreaView>
  );
}

export default App;

const stylesheet = createStyleSheet((theme) => ({
  container: (bgc: string) => ({ backgroundColor: bgc, flex: 1 }),
  content: {
    backgroundColor: theme.colors.background.light,
    flex: 1,
  },
}));
