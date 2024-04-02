import { useMemo } from 'react';
import { View } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useFlipper } from '@react-navigation/devtools';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import BootSplash from 'react-native-bootsplash';
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
import { ErrorWrapper as ErrorCatcher } from './app/containers';

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
    <ErrorCatcher>
      <DatabaseProvider database={database}>
        <View style={styles.content}>
          <NavigationContainer
            ref={navigationRef}
            theme={navigationContainerTheme}
            onReady={() => {
              BootSplash.hide({ fade: true });
            }}
          >
            <RootNavigator />
          </NavigationContainer>
        </View>
      </DatabaseProvider>
    </ErrorCatcher>
  );
}

export default App;

const stylesheet = createStyleSheet((theme) => ({
  content: {
    backgroundColor: theme.colors.background.light,
    flex: 1,
  },
}));
