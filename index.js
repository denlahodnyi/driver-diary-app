/* eslint-disable no-console */
import { AppRegistry } from 'react-native';
import App from '~/App';
import { name as appName } from './app.json';

if (__DEV__) {
  // Debugger
  import('./reactotron.config').then(() =>
    console.log('Reactotron Configured'),
  );
}

AppRegistry.registerComponent(appName, () => App);
