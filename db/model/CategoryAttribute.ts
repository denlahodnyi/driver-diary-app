import { Model } from '@nozbe/watermelondb';
import { immutableRelation } from '@nozbe/watermelondb/decorators';
import type { dbTypes } from 'db';

export default class CategoryAttribute extends Model {
  static table: dbTypes.TableName = 'category_attributes';

  static associations: dbTypes.Associations = {
    attributes: { key: 'attribute_id', type: 'belongs_to' },
    categories: { key: 'category_id', type: 'belongs_to' },
  };

  @immutableRelation('attributes', 'attribute_id') attribute!: unknown;
  @immutableRelation('categories', 'category_id') category!: unknown;
}
