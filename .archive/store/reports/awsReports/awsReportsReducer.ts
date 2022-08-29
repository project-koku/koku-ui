import { AwsReport } from 'api/reports/awsReports';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchAwsReportFailure,
  fetchAwsReportRequest,
  fetchAwsReportSuccess,
} from './awsReportsActions';

export interface AwsCachedReport extends AwsReport {
  timeRequested: number;
}

export type AwsReportsState = Readonly<{
  byId: Map<string, AwsCachedReport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: AwsReportsState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type AwsReportsAction = ActionType<
  | typeof fetchAwsReportFailure
  | typeof fetchAwsReportRequest
  | typeof fetchAwsReportSuccess
>;

export function awsReportsReducer(
  state = defaultState,
  action: AwsReportsAction
): AwsReportsState {
  switch (action.type) {
    case getType(fetchAwsReportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(
          action.payload.reportId,
          FetchStatus.inProgress
        ),
      };

    case getType(fetchAwsReportSuccess):
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

    case getType(fetchAwsReportFailure):
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
