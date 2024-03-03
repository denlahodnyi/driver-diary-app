/* eslint-disable sort-keys */
import {
  addColumns,
  createTable,
  schemaMigrations,
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'activities',
          columns: [
            { name: 'currency_code', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
    {
      toVersion: 2,
      steps: [
        createTable({
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
            { name: 'created_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
});
