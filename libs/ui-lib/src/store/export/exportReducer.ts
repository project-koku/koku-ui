import type { Export } from '@koku-ui/api/export/export';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchExportFailure, fetchExportRequest, fetchExportSuccess } from './exportActions';

export interface CachedExport extends Export {
  timeRequested: number;
}

export type ExportState = Readonly<{
  byId: Map<string, CachedExport>;
  errors: Map<string, AxiosError>;
  fetchStatus: Map<string, FetchStatus>;
  notification: Map<string, any>;
}>;

const defaultState: ExportState = {
  byId: new Map(),
  errors: new Map(),
  fetchStatus: new Map(),
  notification: new Map(),
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
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchExportSuccess):
      return {
        ...state,
        byId: new Map(state.byId).set(action.meta.fetchId, {
          data: action.payload as any,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
      };

    case getType(fetchExportFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
      };
    default:
      return state;
  }
}
