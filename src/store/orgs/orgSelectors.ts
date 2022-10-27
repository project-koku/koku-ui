import type { OrgPathsType, OrgType } from 'api/orgs/org';
import type { RootState } from 'store/rootReducer';

import { getOrgId, orgStateKey } from './orgCommon';

export const selectOrgState = (state: RootState) => state[orgStateKey];

export const selectOrg = (state: RootState, orgPathsType: OrgPathsType, orgType: OrgType, query: string) =>
  selectOrgState(state).byId.get(getOrgId(orgPathsType, orgType, query));

export const selectOrgFetchStatus = (state: RootState, orgPathsType: OrgPathsType, orgType: OrgType, query: string) =>
  selectOrgState(state).fetchStatus.get(getOrgId(orgPathsType, orgType, query));

export const selectOrgError = (state: RootState, orgPathsType: OrgPathsType, orgType: OrgType, query: string) =>
  selectOrgState(state).errors.get(getOrgId(orgPathsType, orgType, query));
