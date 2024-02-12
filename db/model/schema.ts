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
  version: 1,
  tables: [
    myTableSchema({
      name: 'vehicles',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'model', type: 'string' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
