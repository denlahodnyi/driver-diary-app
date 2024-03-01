import { categoriesWithIds } from 'db/data';

export const findCategoryById = (categoryId: string) => {
  const category = categoriesWithIds.find((c) => c.id === categoryId);

  return category || null;
};
