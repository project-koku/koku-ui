/*global module*/
const localhost =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';

module.exports = {
  routes: {
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
    // The overrides below are not necessary for typical development
    // '/apps/chrome': {
    //   host: 'https://ci.cloud.paas.upshift.redhat.com',
    // },
    // '/apps/beta/chrome': {
    //   host: 'https://ci.cloud.paas.upshift.redhat.com',
    // }
  },
};
