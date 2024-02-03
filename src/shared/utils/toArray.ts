const toArray = <T>(value: T): T[] => {
  return Array.isArray(value) ? value : [value];
};

export default toArray;
