const collectFieldErrors = (value, prefix = '') => {
  if (typeof value === 'string') {
    return [prefix ? `${prefix}: ${value}` : value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(item => collectFieldErrors(item, prefix));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).flatMap(key => {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      return collectFieldErrors(value[key], nextPrefix);
    });
  }
  return [];
};

export const parseApiError = error => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.Error) {
      return data.Error;
    }
    if (typeof data.detail === 'string') {
      return data.detail;
    }
    if (data.errors) {
      return data.errors.map(er => (er.source ? `${er.source}: ${er.detail}` : er.detail)).join(', ');
    }
    if (data && typeof data === 'object') {
      const fieldErrors = collectFieldErrors(data);
      if (fieldErrors.length) {
        return fieldErrors.join(', ');
      }
    }
  } else if (error.message) {
    return error.message;
  }
  return 'unknown';
};
