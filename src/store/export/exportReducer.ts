import { AxiosError } from 'axios';
import { ActionType, getType } from 'typesafe-actions';
import { FetchStatus } from '../common';
import {
  fetchExportFailure,
  fetchExportRequest,
  fetchExportSuccess,
} from './exportActions';

export type ExportAction = ActionType<
  | typeof fetchExportFailure
  | typeof fetchExportRequest
  | typeof fetchExportSuccess
>;

export type ExportState = Readonly<{
  export: string;
  exportError: AxiosError;
  exportFetchStatus: FetchStatus;
}>;

export const defaultState: ExportState = {
  export: null,
  exportError: null,
  exportFetchStatus: FetchStatus.none,
};

export const stateKey = 'export';

export function exportReducer(
  state = defaultState,
  action: ExportAction
): ExportState {
  switch (action.type) {
    case getType(fetchExportRequest):
      return {
        ...state,
        exportFetchStatus: FetchStatus.inProgress,
      };
    case getType(fetchExportSuccess):
      return {
        ...state,
        export: action.payload,
        exportError: null,
        exportFetchStatus: FetchStatus.complete,
      };
    case getType(fetchExportFailure):
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
