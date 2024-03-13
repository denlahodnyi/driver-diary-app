import { APP_ENV } from '@env';

const isCosmos = APP_ENV === 'cosmos';

module.exports =
  __DEV__ && isCosmos ? require('./App.cosmos') : require('./App.main');
