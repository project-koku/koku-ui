import {
  awsProvidersQuery,
  ocpProvidersQuery,
} from 'store/providers/providersCommon';
import * as providersActions from './providersActions';
import { stateKey as providersStateKey } from './providersCommon';
import {
  ProvidersAction,
  providersReducer,
  ProvidersState,
} from './providersReducer';
import * as providersSelectors from './providersSelectors';

export {
  awsProvidersQuery,
  ocpProvidersQuery,
  ProvidersAction,
  providersActions,
  providersReducer,
  providersSelectors,
  ProvidersState,
  providersStateKey,
};
