import { AxiosError } from 'axios';
import fileDownload from 'js-file-download';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchAzureExportFailure,
  fetchAzureExportRequest,
  fetchAzureExportSuccess,
} from './azureExportActions';

export type AzureExportAction = ActionType<
  | typeof fetchAzureExportFailure
  | typeof fetchAzureExportRequest
  | typeof fetchAzureExportSuccess
>;

export type AzureExportState = Readonly<{
  export: string;
  exportError: AxiosError;
  exportFetchStatus: FetchStatus;
}>;

export const defaultState: AzureExportState = {
  export: null,
  exportError: null,
  exportFetchStatus: FetchStatus.none,
};

export const stateKey = 'azureExport';

export function azureExportReducer(
  state = defaultState,
  action: AzureExportAction
): AzureExportState {
  switch (action.type) {
    case getType(fetchAzureExportRequest):
      return {
        ...state,
        exportFetchStatus: FetchStatus.inProgress,
      };
    case getType(fetchAzureExportSuccess):
      fileDownload(action.payload, 'report.csv', 'text/csv');
      return {
        ...state,
        export: action.payload,
        exportError: null,
        exportFetchStatus: FetchStatus.complete,
      };
    case getType(fetchAzureExportFailure):
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
