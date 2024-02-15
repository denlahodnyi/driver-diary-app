const dbInstance = {
  get: jest.fn(() => ({
    create: () => ({}),
    find: jest.fn(),
    query: () => ({
      observeWithColumns: () => ({}),
    }),
  })),
  write: jest.fn(),
};

const Database = {
  getInstance: jest.fn(() => dbInstance),
};

export { Database };
