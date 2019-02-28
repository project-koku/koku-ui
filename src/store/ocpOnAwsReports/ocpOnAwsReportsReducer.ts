import { OcpOnAwsReport } from 'api/ocpOnAwsReports';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpOnAwsReportFailure,
  fetchOcpOnAwsReportRequest,
  fetchOcpOnAwsReportSuccess,
} from './ocpOnAwsReportsActions';

export interface OcpOnAwsCachedReport extends OcpOnAwsReport {
  timeRequested: number;
}

export type OcpOnAwsReportsState = Readonly<{
  byId: Map<string, OcpOnAwsCachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: OcpOnAwsReportsState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type OcpOnAwsReportsAction = ActionType<
  | typeof fetchOcpOnAwsReportFailure
  | typeof fetchOcpOnAwsReportRequest
  | typeof fetchOcpOnAwsReportSuccess
>;

export function ocpOnAwsReportsReducer(
  state = defaultState,
  action: OcpOnAwsReportsAction
): OcpOnAwsReportsState {
  switch (action.type) {
    case getType(fetchOcpOnAwsReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.reportId,
          FetchStatus.inProgress
        ),
      };

    case getType(fetchOcpOnAwsReportSuccess):
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

    case getType(fetchOcpOnAwsReportFailure):
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
