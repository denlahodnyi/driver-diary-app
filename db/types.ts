export type TableName = 'vehicles' | 'activities';

export type Associations = {
  [Name in TableName]?:
    | { foreignKey: string; type: 'has_many' }
    | { key: string; type: 'belongs_to' };
};
