/* global exports */
const localhost =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';
const localKoku = 'http://' + localhost + ':8000';

exports.routes = {
  '/api/cost-management/': {
    host: localKoku,
  },
  '/apps/cost-management': {
    host: `http://${localhost}:8002`,
  },
  '/beta/apps/cost-management': {
    host: `http://${localhost}:8002`,
  },
  '/hybrid/cost-management': {
    host: `http://${localhost}:8002`,
  },
  '/beta/hybrid/cost-management': {
    host: `http://${localhost}:8002`,
  },
};
