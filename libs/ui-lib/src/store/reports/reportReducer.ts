import type { Report } from '@koku-ui/api/reports/report';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchReportFailure, fetchReportRequest, fetchReportSuccess } from './reportActions';

export interface CachedReport extends Report {
  timeRequested?: number;
}

export type ReportState = Readonly<{
  byId: Map<string, CachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: ReportState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type ReportAction = ActionType<
  typeof fetchReportFailure | typeof fetchReportRequest | typeof fetchReportSuccess | typeof resetState
>;

export function reportReducer(state = defaultState, action: ReportAction): ReportState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchReportSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };

    case getType(fetchReportFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };
    default:
      return state;
  }
}
