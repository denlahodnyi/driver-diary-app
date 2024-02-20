import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
import type { dbTypes } from 'db';

export default class SubCategory extends Model {
  static table: dbTypes.TableName = 'categories';

  static associations: dbTypes.Associations = {
    categories: { key: 'category_id', type: 'belongs_to' },
  };

  @text('name') name!: string;
}
