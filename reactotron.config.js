import Reactotron, {
  asyncStorage,
  openInEditor,
} from 'reactotron-react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'DriverDiary',
  }) // controls connection & communication settings
  .useReactNative({
    editor: true,
    asyncStorage: true,
  }) // add all built-in react native plugins
  .connect(); // let's connect!
