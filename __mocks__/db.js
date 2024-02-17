import { Observable } from 'rxjs';

const dbInstance = {
  adapter: {},
  collection: {},
  get: jest.fn(() => ({
    create: () => ({}),
    find: jest.fn(),
    query: () => ({
      observeWithColumns: () => {
        return new Observable((sub) => {
          sub.next([]);
          sub.complete();
        });
      },
    }),
  })),
  schema: {},
  write: jest.fn(),
};

const Database = {
  getInstance: jest.fn(() => dbInstance),
};

export { Database };
