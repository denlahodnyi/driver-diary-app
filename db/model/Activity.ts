import { Model, type Relation } from '@nozbe/watermelondb';
import {
  date,
  field,
  immutableRelation,
  readonly,
  text,
} from '@nozbe/watermelondb/decorators';
import type { Vehicle, dbTypes } from 'db';

export default class Activity extends Model {
  static table: dbTypes.TableName = 'activities';

  @immutableRelation('vehicles', 'vehicle_id') vehicles!: Relation<Vehicle>;

  @readonly @date('created_at') createdAt!: number;

  @field('category_id') categoryId!: string;
  @field('subcategory_id') subcategoryId!: string | null;
  @field('is_bookmark') isBookmark!: boolean;
  @field('date') date!: number;
  @field('cost') cost!: number | null;
  @text('comment') comment!: string | null;
  @text('location') location!: string | null;
}
