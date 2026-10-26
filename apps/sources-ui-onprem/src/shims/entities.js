const axios = require('axios');

const { createCostSourcesApi, restFilterGenerator } = require('./costSourcesApi');

const http = {
  delete: (url, config) => axios.delete(url, config).then(response => response.data),
  get: (url, config) => axios.get(url, config).then(response => response.data),
  patch: (url, body, config) => axios.patch(url, body, config).then(response => response.data),
  post: (url, body, config) => axios.post(url, body, config).then(response => response.data),
};

const api = createCostSourcesApi(http);

module.exports = {
  ...api,
  axiosInstance: axios.create(),
  initAxios: () => undefined,
  restFilterGenerator,
};
