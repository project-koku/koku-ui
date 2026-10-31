/**
 * Federated entry — lazy-load upstream Sources so the exposed chunk does not
 * evaluate the app during plugin startup.
 *
 * The host BrowserRouter has no basename on Cost Management URLs. Do not wrap
 * AppEntry in a second Router. List and detail stay under
 * /openshift/cost-management/settings/integrations; the host hides Settings
 * chrome on detail so breadcrumbs sit at the page top.
 */
import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { lazy, Suspense, useLayoutEffect } from 'react';

const SourcesApp = lazy(() => import('sources-ui/src/AppEntry'));

const fallback = (
  <Bullseye>
    <Spinner size="lg" />
  </Bullseye>
);

/** Sources.js treats a missing category as Cloud. On-prem only has Red Hat. */
const ensureRedHatCategory = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('category') || params.get('activeVendor')) {
    return;
  }
  params.set('category', 'Red Hat');
  const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  window.history.replaceState(window.history.state, '', next);
};

const OnpremSourcesEntry: React.FC = () => {
  useLayoutEffect(() => {
    ensureRedHatCategory();
  }, []);

  return (
    <Suspense fallback={fallback}>
      <SourcesApp />
    </Suspense>
  );
};

export default OnpremSourcesEntry;
