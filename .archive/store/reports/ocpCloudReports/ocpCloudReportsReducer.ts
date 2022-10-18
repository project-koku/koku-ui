import { OcpCloudReport } from 'api/reports/ocpCloudReports';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpCloudReportFailure,
  fetchOcpCloudReportRequest,
  fetchOcpCloudReportSuccess,
} from './ocpCloudReportsActions';

export interface OcpCloudCachedReport extends OcpCloudReport {
  timeRequested: number;
}

export type OcpCloudReportsState = Readonly<{
  byId: Map<string, OcpCloudCachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: OcpCloudReportsState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type OcpCloudReportsAction = ActionType<
  | typeof fetchOcpCloudReportFailure
  | typeof fetchOcpCloudReportRequest
  | typeof fetchOcpCloudReportSuccess
>;

export function ocpCloudReportsReducer(
  state = defaultState,
  action: OcpCloudReportsAction
): OcpCloudReportsState {
  switch (action.type) {
    case getType(fetchOcpCloudReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.reportId,
          FetchStatus.inProgress
        ),
      };

    case getType(fetchOcpCloudReportSuccess):
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

    case getType(fetchOcpCloudReportFailure):
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
