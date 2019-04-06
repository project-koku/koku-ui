/*global module*/
const localhost =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';

module.exports = {
  routes: {
    '/apps/cost-management': {
      host: `http://${localhost}:8002`,
    },
    '/hybrid/cost-management': {
      host: `http://${localhost}:8002`,
    },
    '/hybrid/chrome': {
      host: 'https://ci.cloud.paas.upshift.redhat.com',
    },
  },
};
