import { OcpOnCloudReport } from 'api/ocpOnCloudReports';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpOnCloudReportFailure,
  fetchOcpOnCloudReportRequest,
  fetchOcpOnCloudReportSuccess,
} from './ocpOnCloudReportsActions';

export interface OcpOnCloudCachedReport extends OcpOnCloudReport {
  timeRequested: number;
}

export type OcpOnCloudReportsState = Readonly<{
  byId: Map<string, OcpOnCloudCachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: OcpOnCloudReportsState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type OcpOnCloudReportsAction = ActionType<
  | typeof fetchOcpOnCloudReportFailure
  | typeof fetchOcpOnCloudReportRequest
  | typeof fetchOcpOnCloudReportSuccess
>;

export function ocpOnCloudReportsReducer(
  state = defaultState,
  action: OcpOnCloudReportsAction
): OcpOnCloudReportsState {
  switch (action.type) {
    case getType(fetchOcpOnCloudReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.reportId,
          FetchStatus.inProgress
        ),
      };

    case getType(fetchOcpOnCloudReportSuccess):
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

    case getType(fetchOcpOnCloudReportFailure):
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
