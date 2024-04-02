/* eslint-disable no-console */
import { AppRegistry } from 'react-native';
import { initializeMMKVFlipper } from 'react-native-mmkv-flipper-plugin';
import { storage } from '~/app/storage';
// eslint-disable-next-line import/default
import App from '~/App';
import { name as appName } from './app.json';

if (__DEV__) {
  // Debugger
  import('./reactotron.config').then(() =>
    console.log('Reactotron Configured'),
  );
  initializeMMKVFlipper({ default: storage });
}

AppRegistry.registerComponent(appName, () => App);
