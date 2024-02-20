import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
import type { dbTypes } from 'db';

export default class Attribute extends Model {
  static table: dbTypes.TableName = 'attributes';

  static associations: dbTypes.Associations = {
    category_attributes: { foreignKey: 'attribute_id', type: 'has_many' },
  };

  @text('name') name!: string;
}
