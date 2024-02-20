import { Model, Q } from '@nozbe/watermelondb';
import { children, lazy, text } from '@nozbe/watermelondb/decorators';
import type { dbTypes } from 'db';
// import type Attribute from './Attribute';

export default class Category extends Model {
  static table: dbTypes.TableName = 'categories';

  static associations: dbTypes.Associations = {
    category_attributes: { foreignKey: 'category_id', type: 'has_many' },
    sub_categories: { foreignKey: 'category_id', type: 'has_many' },
  };

  @text('name') name!: string;

  @children('sub_categories') sub_categories!: string;

  @lazy attributes = this.collections
    .get('attributes')
    .query(Q.on('category_attributes', 'category_id', this.id));
}
