import type { PriceList } from 'api/priceList';
import type { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { resetState } from 'store/ui/uiActions';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import {
  fetchPriceListFailure,
  fetchPriceListRequest,
  fetchPriceListSuccess,
  updatePriceListFailure,
  updatePriceListRequest,
  updatePriceListSuccess,
} from './priceListActions';

export interface CachedPriceList extends PriceList {
  timeRequested?: number;
}

export type PriceListState = Readonly<{
  byId: Map<string, CachedPriceList>;
  fetchStatus: Map<string, FetchStatus>;
  errors: Map<string, AxiosError>;
  notification?: Map<string, any>;
}>;

const defaultState: PriceListState = {
  byId: new Map(),
  fetchStatus: new Map(),
  errors: new Map(),
  notification: new Map(),
};

export type PriceListAction = ActionType<
  | typeof fetchPriceListFailure
  | typeof fetchPriceListRequest
  | typeof fetchPriceListSuccess
  | typeof resetState
  | typeof updatePriceListFailure
  | typeof updatePriceListRequest
  | typeof updatePriceListSuccess
>;

export function priceListReducer(state = defaultState, action: PriceListAction): PriceListState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchPriceListRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchPriceListSuccess):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
      };

    case getType(fetchPriceListFailure):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
      };

    case getType(updatePriceListFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
      };

    case getType(updatePriceListRequest):
      return {
        ...state,
        fetchStatus: new Map(state.fetchStatus).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(updatePriceListSuccess):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, null),
        fetchStatus: new Map(state.fetchStatus).set(action.meta.fetchId, FetchStatus.complete),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
      };
    default:
      return state;
  }
}
