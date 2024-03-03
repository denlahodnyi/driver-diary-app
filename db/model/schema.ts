import { appSchema, tableSchema } from '@nozbe/watermelondb';
import type { TableName } from 'db/types';

type TableSchemaParameters = Parameters<typeof tableSchema>[0] & {
  name: TableName;
};

type MyTableSchema = (
  params: TableSchemaParameters,
) => ReturnType<typeof tableSchema>;

const myTableSchema: MyTableSchema = tableSchema;

/* eslint-disable sort-keys */
export default appSchema({
  version: 3,
  tables: [
    myTableSchema({
      name: 'vehicles',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'model', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    myTableSchema({
      name: 'activities',
      columns: [
        { name: 'vehicle_id', type: 'string' },
        { name: 'category_id', type: 'string' },
        { name: 'subcategory_id', type: 'string', isOptional: true },
        { name: 'is_bookmark', type: 'boolean' },
        { name: 'date', type: 'number' },
        { name: 'cost', type: 'number', isOptional: true },
        { name: 'comment', type: 'string', isOptional: true },
        { name: 'location', type: 'string', isOptional: true },
        { name: 'currency_code', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        // @TODO: add tag column
      ],
    }),
  ],
});
