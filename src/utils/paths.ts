import { useLocation } from 'react-router-dom';
import { routes } from 'routes';

// Prefixes the given path with a basename
//
// Note the basename does not include a release prefix (/beta, /preview, etc.), unlike the getBaseName function from
// @redhat-cloud-services/frontend-components-utilities/helpers
export const formatPath = path => {
  const basename = '/openshift/cost-management';
  return path === routes.overview.path ? basename : `${basename}${path}`;
};

// export const getBaseName = pathname => {
//   let release = '/';
//   const pathName = pathname.split('/');
//
//   pathName.shift();
//
//   if (pathName[0] === 'beta') {
//     pathName.shift();
//     release = `/beta/`;
//   }
//
//   if (pathName[1]) {
//     return `${release}${pathName[0]}/${pathName[1]}`;
//   }
//   return `${release}${pathName[0]}`;
// };

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

  // cost models may include UUID in path
  const costModelPath = formatPath(routes.costModel.basePath);
  return location.pathname.startsWith(costModelPath) ? costModelPath : location.pathname.replace(/\/$/, '');
};
