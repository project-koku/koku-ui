import type { OrgPathsType, OrgType } from 'api/orgs/org';
import type { RootState } from 'store/rootReducer';

import { getFetchId, orgStateKey } from './orgCommon';

export const selectOrgState = (state: RootState) => state[orgStateKey];

export const selectOrg = (state: RootState, orgPathsType: OrgPathsType, orgType: OrgType, orgQueryString: string) =>
  selectOrgState(state).byId.get(getFetchId(orgPathsType, orgType, orgQueryString));

export const selectOrgFetchStatus = (
  state: RootState,
  orgPathsType: OrgPathsType,
  orgType: OrgType,
  orgQueryString: string
) => selectOrgState(state).fetchStatus.get(getFetchId(orgPathsType, orgType, orgQueryString));

export const selectOrgError = (
  state: RootState,
  orgPathsType: OrgPathsType,
  orgType: OrgType,
  orgQueryString: string
) => selectOrgState(state).errors.get(getFetchId(orgPathsType, orgType, orgQueryString));
