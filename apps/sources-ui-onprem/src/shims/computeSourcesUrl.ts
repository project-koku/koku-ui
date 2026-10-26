import { linkBasename } from './utils';

/** Full-page links inside the vendored UI. The host serves this app from Settings. */
const computeSourcesUrl = () => linkBasename;

export default computeSourcesUrl;
