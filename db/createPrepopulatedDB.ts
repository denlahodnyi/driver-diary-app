// /* eslint-disable sort-keys */
// import { Database as WatermelonDB } from '@nozbe/watermelondb';
// import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
// import SqliteDB from 'better-sqlite3';
// import { customAlphabet } from 'nanoid';
// import { migrations, schema } from './model';
// import { categories } from './data';

// const nanoid = customAlphabet('1234567890abcdef', 16);
// const dbFileName = 'default';

// const adapter = new SQLiteAdapter({
//   schema,
//   migrations,
//   dbName: `db/${dbFileName}`,
//   // jsi: Platform.OS === 'ios',
//   onSetUpError: (error) => {
//     console.error(`SQLiteAdapter error: ${error}`);
//   },
// });
// /* eslint-enable sort-keys */

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const watermelondb = new WatermelonDB({
//   adapter,
//   modelClasses: [],
// });

// const db = new SqliteDB(`db/${dbFileName}.db`);

// categories.forEach((category) => {
//   const insertMany = db.transaction(() => {
//     const id = nanoid();
//     const insertCategory = db.prepare(
//       'INSERT INTO categories (id, name) VALUES (@id, @name)',
//     );

//     insertCategory.run({ id, name: category.name });

//     if (category.subcategories.length) {
//       category.subcategories.forEach((subcategory) => {
//         const subid = nanoid();
//         const insertSubcategory = db.prepare(
//           'INSERT INTO subcategories (id, category_id, name) VALUES (@id, @category_id, @name)',
//         );

//         insertSubcategory.run({
//           category_id: id,
//           id: subid,
//           name: subcategory,
//         });
//       });
//     }
//   });

//   insertMany();
// });

// if (db.open) db.close();
