import { Platform } from 'react-native';
import { type Model, Database as WatermelonDB } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {
  Activity,
  Attribute,
  Category,
  CategoryAttribute,
  SubCategory,
  Vehicle,
  migrations,
  schema,
} from './model';
import { name as appName } from '../app.json';
import type * as dbTypes from './types';

/* eslint-disable sort-keys */
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: `${appName}_db`,
  jsi: Platform.OS === 'ios',
  onSetUpError: (error) => {
    console.error(`SQLiteAdapter error: ${error}`);
  },
});
/* eslint-enable sort-keys */

class Database extends WatermelonDB {
  private static instance: Database;

  private constructor(options: ConstructorParameters<typeof WatermelonDB>[0]) {
    super(options);
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database({
        adapter,
        modelClasses: [
          Activity,
          Attribute,
          Category,
          CategoryAttribute,
          SubCategory,
          Vehicle,
        ],
      });
    }
    return Database.instance;
  }

  get<T extends Model>(tableName: dbTypes.TableName) {
    return super.get<T>(tableName);
  }
}

export { Database, Vehicle, type dbTypes };
