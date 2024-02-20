/* eslint-disable sort-keys */
import {
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'activities',
          columns: [
            { name: 'category_id', type: 'string' },
            { name: 'is_bookmark', type: 'boolean' },
            { name: 'created_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'categories',
          columns: [{ name: 'name', type: 'string' }],
        }),
        createTable({
          name: 'sub_categories',
          columns: [
            { name: 'name', type: 'string' },
            { name: 'category_id', type: 'string', isIndexed: true },
          ],
        }),
        createTable({
          name: 'attributes',
          columns: [{ name: 'name', type: 'string' }],
        }),
        createTable({
          name: 'category_attributes',
          columns: [
            { name: 'category_id', type: 'string', isIndexed: true },
            { name: 'attribute_id', type: 'string' },
          ],
        }),
      ],
    },
  ],
});
