// import { Platform, SafeAreaView } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useFlipper } from '@react-navigation/devtools';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Database } from 'db';
import { RootNavigator } from './app/navigation';

const database = Database.getInstance();

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <DatabaseProvider database={database}>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </DatabaseProvider>
  );
}

export default App;
