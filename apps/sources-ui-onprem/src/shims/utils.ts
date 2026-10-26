/**
 * Host basename is the site root. AppLink and AppNavigate prefix this path so
 * list URLs stay under Settings → Integrations, and detail URLs use the same
 * prefix as a full-page breakdown (Settings chrome is hidden on detail).
 */
export const linkBasename = '/openshift/cost-management/settings/integrations';

export const mergeToBasename = (to: string | { pathname?: string }, basename: string) => {
  if (typeof to === 'string') {
    return `${basename}/${to}`.replaceAll('//', '/');
  }

  return {
    ...to,
    pathname: `${basename}/${to.pathname}`.replaceAll('//', '/'),
  };
};
