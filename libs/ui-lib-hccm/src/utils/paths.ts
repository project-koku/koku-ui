import { useLocation } from 'react-router-dom';

import { basename } from '../init';
import { routes } from '../routes';

// Prefixes the given path with a basename
//
// Note the basename does not include a release prefix (/beta, /preview, etc.), unlike the getBaseName function from
// @redhat-cloud-services/frontend-components-utilities/helpers
export const formatPath = (path, isReleasePath = false) => {
  const newPath = path === routes.overview.path ? basename : `${basename}${path}`;
  return isReleasePath ? `${getReleasePath()}${newPath}` : newPath;
};

export const getReleasePath = () => {
  const pathName = window.location.pathname.split('/');
  pathName.shift();

  let release = '';
  if (pathName[0] === 'beta') {
    release = `/beta`;
  }
  if (pathName[0] === 'preview') {
    release = `/preview`;
  }
  return release;
};

export const usePathname = () => {
  const location = useLocation();

  // Cost models may include UUID in path
  const costModelPath = formatPath(routes.costModel.basePath);
  return location.pathname.startsWith(costModelPath) ? costModelPath : location.pathname.replace(/\/$/, '');
};
