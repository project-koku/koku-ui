import {
  awsUserAccessQuery,
  azureUserAccessQuery,
  costModelUserAccessQuery,
  gcpUserAccessQuery,
  ocpUserAccessQuery,
  userAccessQuery,
} from 'store/userAccess/userAccessCommon';

import * as userAccessActions from './userAccessActions';
import { stateKey as userAccessStateKey } from './userAccessCommon';
import type { UserAccessAction, UserAccessState } from './userAccessReducer';
import { userAccessReducer } from './userAccessReducer';
import * as userAccessSelectors from './userAccessSelectors';

export {
  userAccessQuery,
  awsUserAccessQuery,
  azureUserAccessQuery,
  costModelUserAccessQuery,
  gcpUserAccessQuery,
  ocpUserAccessQuery,
  userAccessActions,
  userAccessReducer,
  userAccessSelectors,
  userAccessStateKey,
};
export type { UserAccessAction, UserAccessState };
