export type TableName =
  | 'vehicles'
  | 'activities'
  | 'categories'
  | 'sub_categories'
  | 'attributes'
  | 'category_attributes'
  | 'activity_attribute_values';

export type Associations = {
  [Name in TableName]?:
    | { foreignKey: string; type: 'has_many' }
    | { key: string; type: 'belongs_to' };
};
