import {
  awsProvidersQuery,
  azureProvidersQuery,
  gcpProvidersQuery,
  ibmProvidersQuery,
  ociProvidersQuery,
  ocpProvidersQuery,
  providersQuery,
} from 'store/providers/providersCommon';

import * as providersActions from './providersActions';
import { stateKey as providersStateKey } from './providersCommon';
import { ProvidersAction, providersReducer, ProvidersState } from './providersReducer';
import * as providersSelectors from './providersSelectors';

export {
  awsProvidersQuery,
  azureProvidersQuery,
  ociProvidersQuery,
  gcpProvidersQuery,
  ibmProvidersQuery,
  ocpProvidersQuery,
  ProvidersAction,
  providersActions,
  providersQuery,
  providersReducer,
  providersSelectors,
  ProvidersState,
  providersStateKey,
};
