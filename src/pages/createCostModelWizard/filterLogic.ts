export const addMultiValueQuery = query => (key, value) => ({
  ...query,
  [key]: query[key] ? [...query[key], value] : [value],
});

export const addSingleValueQuery = query => (key, value) => ({
  ...query,
  [key]: value,
});

export const removeMultiValueQuery = query => (key, value) => {
  const valueIx = query[key] !== undefined ? query[key].indexOf(value) : -1;
  if (valueIx === -1) {
    return query;
  }
  return {
    ...query,
    [key]: [...query[key].slice(0, valueIx), ...query[key].slice(valueIx + 1)],
  };
};

export const removeSingleValueQuery = query => (key, value) => ({
  ...query,
  [key]: null,
});

export const flatQueryValue = (name: string, value: string | string[]) => {
  if (typeof value === 'string') {
    return [{ name, value }];
  }
  return value.map(vl => ({ name, value: vl }));
};
