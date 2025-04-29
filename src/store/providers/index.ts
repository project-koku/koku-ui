import {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ibmProvidersQuery,
  ocpProvidersQuery,
  providersQuery,
} from 'store/providers/providersCommon';

import * as providersActions from './providersActions';
import { stateKey as providersStateKey } from './providersCommon';
import type { ProvidersAction, ProvidersState } from './providersReducer';
import { providersReducer } from './providersReducer';
import * as providersSelectors from './providersSelectors';

export type { ProvidersAction, ProvidersState };
export {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ibmProvidersQuery,
  ocpProvidersQuery,
  providersActions,
  providersQuery,
  providersReducer,
  providersSelectors,
  providersStateKey,
};
