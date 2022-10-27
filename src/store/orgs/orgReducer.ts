import type { Org } from 'api/orgs/org';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchOrgFailure, fetchOrgRequest, fetchOrgSuccess } from './orgActions';

export interface CachedOrg extends Org {
  timeRequested: number;
}

export type OrgState = Readonly<{
  byId: Map<string, CachedOrg>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: OrgState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type OrgAction = ActionType<
  typeof fetchOrgFailure | typeof fetchOrgRequest | typeof fetchOrgSuccess | typeof resetState
>;

export function orgReducer(state = defaultState, action: OrgAction): OrgState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchOrgRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.orgId, FetchStatus.inProgress),
      };

    case getType(fetchOrgSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.orgId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.orgId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.orgId, null),
      };

    case getType(fetchOrgFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.orgId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.orgId, action.payload),
      };
    default:
      return state;
  }
}
