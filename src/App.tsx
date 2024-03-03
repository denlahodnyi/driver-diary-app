// import { Platform, SafeAreaView } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useFlipper } from '@react-navigation/devtools';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Database } from 'db';
import { RootNavigator } from './app/navigation';
import { storage } from './app/storage';
import { CURRENCY_CODE } from './app/constants';

const database = Database.getInstance();

if (!storage.getString('currencyCode')) {
  storage.set('currencyCode', CURRENCY_CODE);
}

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
