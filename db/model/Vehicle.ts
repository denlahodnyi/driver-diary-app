import { Model, Q, type Query } from '@nozbe/watermelondb';
import {
  children,
  date,
  lazy,
  readonly,
  text,
} from '@nozbe/watermelondb/decorators';
import type { Activity, dbTypes } from 'db';

export default class Vehicle extends Model {
  static table: dbTypes.TableName = 'vehicles';

  static associations: dbTypes.Associations = {
    activities: { foreignKey: 'vehicle_id', type: 'has_many' },
  };

  @text('title') title!: string;
  @text('model') model!: string;
  @readonly
  @date('created_at')
  createdAt!: number;

  @children('activities') activities!: Query<Activity>;

  @lazy sortedActivities = this.activities.extend(Q.sortBy('date', Q.desc));

  @lazy bookmarkedActivities = this.activities.extend(
    Q.where('is_bookmark', true),
  );

  async destroyPermanently(): Promise<void> {
    await this.activities.destroyAllPermanently();
    await super.destroyPermanently();
  }
}
