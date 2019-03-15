import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchOcpOnAwsExportFailure,
  fetchOcpOnAwsExportRequest,
  fetchOcpOnAwsExportSuccess,
} from './ocpOnAwsExportActions';

export type OcpOnAwsExportAction = ActionType<
  | typeof fetchOcpOnAwsExportFailure
  | typeof fetchOcpOnAwsExportRequest
  | typeof fetchOcpOnAwsExportSuccess
>;

export type OcpOnAwsExportState = Readonly<{
  export: string;
  exportError: AxiosError;
  exportFetchStatus: FetchStatus;
}>;

export const defaultState: OcpOnAwsExportState = {
  export: null,
  exportError: null,
  exportFetchStatus: FetchStatus.none,
};

export const stateKey = 'ocpOnAwsExport';

export function ocpOnAwsExportReducer(
  state = defaultState,
  action: OcpOnAwsExportAction
): OcpOnAwsExportState {
  switch (action.type) {
    case getType(fetchOcpOnAwsExportRequest):
      return {
        ...state,
        exportFetchStatus: FetchStatus.inProgress,
      };
    case getType(fetchOcpOnAwsExportSuccess):
      return {
        ...state,
        export: action.payload,
        exportError: null,
        exportFetchStatus: FetchStatus.complete,
      };
    case getType(fetchOcpOnAwsExportFailure):
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
