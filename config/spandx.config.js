/* global exports */
const localhost =
  process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';
const localKoku = 'http://' + localhost + ':8000';

exports.routes = {
  '/r/insights/platform/cost-management/': {
    host: localKoku,
  },
};
