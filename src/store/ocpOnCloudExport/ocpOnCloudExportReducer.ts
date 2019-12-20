import { AxiosError } from 'axios';
import fileDownload from 'js-file-download';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpOnCloudExportFailure,
  fetchOcpOnCloudExportRequest,
  fetchOcpOnCloudExportSuccess,
} from './ocpOnCloudExportActions';

export type OcpOnCloudExportAction = ActionType<
  | typeof fetchOcpOnCloudExportFailure
  | typeof fetchOcpOnCloudExportRequest
  | typeof fetchOcpOnCloudExportSuccess
>;

export type OcpOnCloudExportState = Readonly<{
  export: string;
  exportError: AxiosError;
  exportFetchStatus: FetchStatus;
}>;

export const defaultState: OcpOnCloudExportState = {
  export: null,
  exportError: null,
  exportFetchStatus: FetchStatus.none,
};

export const stateKey = 'ocpOnCloudExport';

export function ocpOnCloudExportReducer(
  state = defaultState,
  action: OcpOnCloudExportAction
): OcpOnCloudExportState {
  switch (action.type) {
    case getType(fetchOcpOnCloudExportRequest):
      return {
        ...state,
        exportFetchStatus: FetchStatus.inProgress,
      };
    case getType(fetchOcpOnCloudExportSuccess):
      fileDownload(action.payload, 'report.csv', 'text/csv');
      return {
        ...state,
        export: action.payload,
        exportError: null,
        exportFetchStatus: FetchStatus.complete,
      };
    case getType(fetchOcpOnCloudExportFailure):
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
