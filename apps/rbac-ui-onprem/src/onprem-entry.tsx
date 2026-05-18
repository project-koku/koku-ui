/**
 * On-prem federated entry — lazy-load upstream Iam to avoid webpack TDZ across exposed chunks.
 *
 * Routing: host BrowserRouter uses basename `/iam` on IAM URLs (see onpremRemotes.ts).
 * Do not wrap Iam in a second Router here — that causes "Router inside Router" errors.
 */
import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { lazy, Suspense } from 'react';

const Iam = lazy(() => import('insights-rbac-frontend/src/federated-modules/Iam'));

const OnpremIamEntry: React.FC = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner size="lg" />
      </Bullseye>
    }
  >
    <Iam />
  </Suspense>
);

export default OnpremIamEntry;
