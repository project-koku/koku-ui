import { AxiosError } from 'axios';
import fileDownload from 'js-file-download';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchAwsExportFailure,
  fetchAwsExportRequest,
  fetchAwsExportSuccess,
} from './awsExportActions';

export type AwsExportAction = ActionType<
  | typeof fetchAwsExportFailure
  | typeof fetchAwsExportRequest
  | typeof fetchAwsExportSuccess
>;

export type AwsExportState = Readonly<{
  export: string;
  exportError: AxiosError;
  exportFetchStatus: FetchStatus;
}>;

export const defaultState: AwsExportState = {
  export: null,
  exportError: null,
  exportFetchStatus: FetchStatus.none,
};

export const stateKey = 'awsExport';

export function awsExportReducer(
  state = defaultState,
  action: AwsExportAction
): AwsExportState {
  switch (action.type) {
    case getType(fetchAwsExportRequest):
      return {
        ...state,
        exportFetchStatus: FetchStatus.inProgress,
      };
    case getType(fetchAwsExportSuccess):
      fileDownload(action.payload, 'report.csv', 'text/csv');
      return {
        ...state,
        export: action.payload,
        exportError: null,
        exportFetchStatus: FetchStatus.complete,
      };
    case getType(fetchAwsExportFailure):
      return {
        ...state,
        export: null,
        exportError: action.payload,
        exportFetchStatus: FetchStatus.complete,
      };
    default:
      return state;
  }
}
