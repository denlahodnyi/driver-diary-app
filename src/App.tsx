// import { Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { Database } from '../db';
import { RootNavigator } from './app/navigation';

const database = Database.getInstance();

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <DatabaseProvider database={database}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </DatabaseProvider>
  );
}

export default App;
