import { useLocation } from 'react-router-dom';
import { routes } from 'routes';

// Prefixes the given path with a basename
//
// Note the basename does not include a release prefix (/beta, /preview, etc.), unlike the getBaseName function from
// @redhat-cloud-services/frontend-components-utilities/helpers
export const formatPath = (path, isReleasePath = false) => {
  const basename = '/openshift/cost-management';
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

  // Cost models and price lists may include UUID in path
  const costModelCreatePath = formatPath(routes.costModelCreate.path);
  const costModelPath = formatPath(routes.costModelBreakdown.basePath);

  const priceListCreatePath = formatPath(routes.priceListCreate.path);
  const priceListPath = formatPath(routes.priceListBreakdown.basePath);

  if (location.pathname.startsWith(costModelCreatePath)) {
    return costModelCreatePath;
  } else if (location.pathname.startsWith(costModelPath)) {
    return costModelPath;
  } else if (location.pathname.startsWith(priceListCreatePath)) {
    return priceListCreatePath;
  } else if (location.pathname.startsWith(priceListPath)) {
    return priceListPath;
  } else {
    return location.pathname.replace(/\/$/, '');
  }
};
