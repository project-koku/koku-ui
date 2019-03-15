/*global module*/
module.exports = {
  routes: {
    '/apps/cost-management': {
      host: 'http://host.docker.internal:8002',
    },
    '/hcm/cost-management': {
      host: 'http://host.docker.internal:8002',
    },
    '/apps/chrome': {
      host: 'https://ci.cloud.paas.upshift.redhat.com',
    },
  },
};
