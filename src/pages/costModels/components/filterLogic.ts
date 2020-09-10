export const addMultiValueQuery = query => (key, value) => ({
  ...query,
  [key]: query[key] ? [...query[key], value] : [value],
});

export const addSingleValueQuery = query => (key, value) => ({
  ...query,
  [key]: value,
});

export const removeMultiValueQuery = query => (key, value) => {
  if (query[key] === undefined) {
    return query;
  }
  const newSubQuery = query[key].filter(qval => qval !== value);
  if (newSubQuery.length === 0) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur === key) {
        return acc;
      }
      return { ...acc, [cur]: query[cur] };
    }, {});
  }
  return {
    ...query,
    [key]: newSubQuery,
  };
};

export const removeSingleValueQuery = query => key => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur === key) {
      return acc;
    }
    return { ...acc, [cur]: query[cur] };
  }, {});
};

export const flatQueryValue = (name: string, value: string | string[]) => {
  if (typeof value === 'string') {
    return [{ name, value }];
  }
  return value.map(vl => ({ name, value: vl }));
};
