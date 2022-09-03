const localhost = process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';
const localKokuPort = process.env.LOCAL_API_PORT ? process.env.LOCAL_API_PORT : '80';
const localKoku = 'http://' + process.env.LOCAL_API + ':' + localKokuPort;
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
  '/cost-management': {
    host: `http://${localhost}:8002`,
  },
  '/beta/cost-management': {
    host: `http://${localhost}:8002`,
  },
};
