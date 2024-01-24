import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './navigation';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    // <SafeAreaView>
    //   <NavigationContainer>
    //     <MainNavigator />
    //   </NavigationContainer>
    // </SafeAreaView>
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}

export default App;
