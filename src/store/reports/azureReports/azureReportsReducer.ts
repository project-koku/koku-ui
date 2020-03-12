import { AzureReport } from 'api/reports/azureReports';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchAzureReportFailure,
  fetchAzureReportRequest,
  fetchAzureReportSuccess,
} from './azureReportsActions';

export interface AzureCachedReport extends AzureReport {
  timeRequested: number;
}

export type AzureReportsState = Readonly<{
  byId: Map<string, AzureCachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: AzureReportsState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type AzureReportsAction = ActionType<
  | typeof fetchAzureReportFailure
  | typeof fetchAzureReportRequest
  | typeof fetchAzureReportSuccess
>;

export function azureReportsReducer(
  state = defaultState,
  action: AzureReportsAction
): AzureReportsState {
  switch (action.type) {
    case getType(fetchAzureReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.reportId,
          FetchStatus.inProgress
        ),
      };

    case getType(fetchAzureReportSuccess):
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

    case getType(fetchAzureReportFailure):
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
