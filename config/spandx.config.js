/*global module*/
const localhost =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';

module.exports = {
  routes: {
    '/apps/cost-management': {
      host: `http://${localhost}:8002`,
    },
    '/hcm/cost-management': {
      host: `http://${localhost}:8002`,
    },
    '/apps/chrome': {
      host: 'https://ci.cloud.paas.upshift.redhat.com',
    },
  },
};
