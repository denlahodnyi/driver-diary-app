import { Model } from '@nozbe/watermelondb';
import { date, readonly, text } from '@nozbe/watermelondb/decorators';
import type { dbTypes } from 'db';

export default class Vehicle extends Model {
  static table: dbTypes.TableName = 'vehicles';

  @text('title')
  title!: string;

  @text('model')
  model!: string;

  @readonly
  @date('created_at')
  createdAt!: number;
}
