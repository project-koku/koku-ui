import type { Export } from 'api/export/export';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { fetchExportFailure, fetchExportRequest, fetchExportSuccess } from './exportActions';

export interface CachedExport extends Export {
  timeRequested: number;
}

export type ExportState = Readonly<{
  byId: Map<string, CachedExport>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
}>;

const defaultState: ExportState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
};

export type ExportAction = ActionType<
  typeof fetchExportFailure | typeof fetchExportRequest | typeof fetchExportSuccess | typeof resetState
>;

export function exportReducer(state = defaultState, action: ExportAction): ExportState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchExportRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.exportId, FetchStatus.inProgress),
      };

    case getType(fetchExportSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.exportId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.exportId, {
          data: action.payload as any,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.exportId, null),
      };

    case getType(fetchExportFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.exportId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.exportId, action.payload),
      };
    default:
      return state;
  }
}
