import { OcpReport } from 'api/reports/ocpReports';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpReportFailure,
  fetchOcpReportRequest,
  fetchOcpReportSuccess,
} from './ocpReportsActions';

export interface OcpCachedReport extends OcpReport {
  timeRequested: number;
}

export type OcpReportsState = Readonly<{
  byId: Map<string, OcpCachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: OcpReportsState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type OcpReportsAction = ActionType<
  | typeof fetchOcpReportFailure
  | typeof fetchOcpReportRequest
  | typeof fetchOcpReportSuccess
>;

export function ocpReportsReducer(
  state = defaultState,
  action: OcpReportsAction
): OcpReportsState {
  switch (action.type) {
    case getType(fetchOcpReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.reportId,
          FetchStatus.inProgress
        ),
      };

    case getType(fetchOcpReportSuccess):
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

    case getType(fetchOcpReportFailure):
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
