export const parseApiError = error => {
  if (error.response && error.response.data) {
    if (error.response.data.Error) {
      return error.response.data.Error;
    }
    if (typeof error.response.data.detail === 'string') {
      return error.response.data.detail;
    }
    if (error.response.data.errors) {
      return error.response.data.errors.map(er => (er.source ? `${er.source}: ${er.detail}` : er.detail)).join(', ');
    }
  } else if (error.message) {
    return error.message;
  }
  return 'unknown';
};
