/**
 * insights-rbac-frontend/shared/hooks/useAppLink
 *
 * Host BrowserRouter uses basename="/iam". Upstream mergeToBasename prepends `/iam` again,
 * so <Navigate to="/iam/my-user-access" /> loops. Strip the prefix for basename-relative paths.
 */
import type { To } from 'react-router-dom';

const BASENAME = '/iam';

const stripBasename = (pathname: string) =>
  pathname.startsWith(BASENAME) ? pathname.slice(BASENAME.length) || '/' : pathname;

export const mergeToBasename = (to: To): To => {
  if (typeof to === 'number') {
    return to;
  }
  if (typeof to === 'string') {
    if (to.startsWith(BASENAME)) {
      return stripBasename(to);
    }
    return to.startsWith('/') ? to : `/${to}`;
  }
  if (to.pathname) {
    return { ...to, pathname: stripBasename(to.pathname) };
  }
  return to;
};

export const useAppLink = () => mergeToBasename;
