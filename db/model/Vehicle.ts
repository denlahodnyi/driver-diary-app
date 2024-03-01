import { Model, type Query } from '@nozbe/watermelondb';
import { children, date, readonly, text } from '@nozbe/watermelondb/decorators';
import type { Activity, dbTypes } from 'db';

export default class Vehicle extends Model {
  static table: dbTypes.TableName = 'vehicles';

  static associations: dbTypes.Associations = {
    activities: { foreignKey: 'vehicle_id', type: 'has_many' },
  };

  @text('title')
  title!: string;

  @text('model')
  model!: string;

  @readonly
  @date('created_at')
  createdAt!: number;

  @children('activities') activities!: Query<Activity>;
}
