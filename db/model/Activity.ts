import { Model } from '@nozbe/watermelondb';
import {
  date,
  field,
  readonly,
  relation,
} from '@nozbe/watermelondb/decorators';
import type { dbTypes } from 'db';

export default class Activity extends Model {
  static table: dbTypes.TableName = 'activities';

  @relation('categories', 'category_id') categories!: unknown;

  @readonly @date('created_at') createdAt!: number;

  @field('is_bookmark') isBookmark!: boolean;
}
