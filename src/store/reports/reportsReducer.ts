import { Report } from 'api/reports';
import { AxiosError } from 'axios';
import { ActionType, getType } from 'typesafe-actions';
import { FetchStatus } from '../common';
import {
  fetchReportFailure,
  fetchReportRequest,
  fetchReportSuccess,
} from './reportsActions';

export interface CachedReport extends Report {
  timeRequested: number;
}

export type ReportsState = Readonly<{
  byId: Map<string, CachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: ReportsState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type ReportsAction = ActionType<
  | typeof fetchReportFailure
  | typeof fetchReportRequest
  | typeof fetchReportSuccess
>;

export function reportsReducer(
  state = defaultState,
  action: ReportsAction
): ReportsState {
  switch (action.type) {
    case getType(fetchReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.reportId,
          FetchStatus.inProgress
        ),
      };

    case getType(fetchReportSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.reportId,
          FetchStatus.complete
        ),
        byId: new Map(state.byId).set(action.meta.reportId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.reportId, null),
      };

    case getType(fetchReportFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.meta.reportId,
          FetchStatus.complete
        ),
        errors: new Map(state.errors).set(action.meta.reportId, action.payload),
      };
    default:
      return state;
  }
}
