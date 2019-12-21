import { AxiosError } from 'axios';
import fileDownload from 'js-file-download';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpCloudExportFailure,
  fetchOcpCloudExportRequest,
  fetchOcpCloudExportSuccess,
} from './ocpCloudExportActions';

export type OcpCloudExportAction = ActionType<
  | typeof fetchOcpCloudExportFailure
  | typeof fetchOcpCloudExportRequest
  | typeof fetchOcpCloudExportSuccess
>;

export type OcpCloudExportState = Readonly<{
  export: string;
  exportError: AxiosError;
  exportFetchStatus: FetchStatus;
}>;

export const defaultState: OcpCloudExportState = {
  export: null,
  exportError: null,
  exportFetchStatus: FetchStatus.none,
};

export const stateKey = 'ocpCloudExport';

export function ocpCloudExportReducer(
  state = defaultState,
  action: OcpCloudExportAction
): OcpCloudExportState {
  switch (action.type) {
    case getType(fetchOcpCloudExportRequest):
      return {
        ...state,
        exportFetchStatus: FetchStatus.inProgress,
      };
    case getType(fetchOcpCloudExportSuccess):
      fileDownload(action.payload, 'report.csv', 'text/csv');
      return {
        ...state,
        export: action.payload,
        exportError: null,
        exportFetchStatus: FetchStatus.complete,
      };
    case getType(fetchOcpCloudExportFailure):
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
