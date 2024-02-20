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
  version: 2,
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
        { name: 'category_id', type: 'string' },
        { name: 'is_bookmark', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    myTableSchema({
      name: 'categories',
      columns: [{ name: 'name', type: 'string' }],
    }),
    myTableSchema({
      name: 'sub_categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category_id', type: 'string', isIndexed: true },
      ],
    }),
    myTableSchema({
      name: 'attributes',
      columns: [{ name: 'name', type: 'string' }],
    }),
    myTableSchema({
      name: 'category_attributes',
      columns: [
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'attribute_id', type: 'string' },
      ],
    }),
    // myTableSchema({
    //   name: 'activity_attribute_values',
    //   columns: [
    //     { name: 'activity_id', type: 'string', isIndexed: true },
    //     { name: 'attribute_id', type: 'string' },
    //     { name: 'value', type: 'string' },
    //   ],
    // }),
  ],
});
