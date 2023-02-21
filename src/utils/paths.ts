import { useLocation } from 'react-router-dom';

import { routes } from '../routes';

//
// The getBaseName function from @redhat-cloud-services/frontend-components-utilities/helpers returns the same value
//
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
  return location.pathname.startsWith(routes.costModelsDetails.pathname)
    ? routes.costModelsDetails.pathname
    : location.pathname;
};
