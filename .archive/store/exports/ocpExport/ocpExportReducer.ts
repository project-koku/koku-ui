import { AxiosError } from 'axios';
import fileDownload from 'js-file-download';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpExportFailure,
  fetchOcpExportRequest,
  fetchOcpExportSuccess,
} from './ocpExportActions';

export type OcpExportAction = ActionType<
  | typeof fetchOcpExportFailure
  | typeof fetchOcpExportRequest
  | typeof fetchOcpExportSuccess
>;

export type OcpExportState = Readonly<{
  export: string;
  exportError: AxiosError;
  exportFetchStatus: FetchStatus;
}>;

export const defaultState: OcpExportState = {
  export: null,
  exportError: null,
  exportFetchStatus: FetchStatus.none,
};

export const stateKey = 'ocpExport';

export function ocpExportReducer(
  state = defaultState,
  action: OcpExportAction
): OcpExportState {
  switch (action.type) {
    case getType(fetchOcpExportRequest):
      return {
        ...state,
        exportFetchStatus: FetchStatus.inProgress,
      };
    case getType(fetchOcpExportSuccess):
      fileDownload(action.payload, 'report.csv', 'text/csv');
      return {
        ...state,
        export: action.payload,
        exportError: null,
        exportFetchStatus: FetchStatus.complete,
      };
    case getType(fetchOcpExportFailure):
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
