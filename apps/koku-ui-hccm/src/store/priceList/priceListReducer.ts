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
  resetNotification,
  resetStatus,
  updatePriceListFailure,
  updatePriceListRequest,
  updatePriceListSuccess,
} from './priceListActions';

export interface CachedPriceList extends PriceList {
  timeRequested?: number;
}

export type PriceListState = Readonly<{
  byId: Map<string, CachedPriceList>;
  errors: Map<string, AxiosError>;
  notification?: Map<string, any>;
  status: Map<string, FetchStatus>;
}>;

const defaultState: PriceListState = {
  byId: new Map(),
  errors: new Map(),
  notification: new Map(),
  status: new Map(),
};

export type PriceListAction = ActionType<
  | typeof fetchPriceListFailure
  | typeof fetchPriceListRequest
  | typeof fetchPriceListSuccess
  | typeof resetNotification
  | typeof resetState
  | typeof resetStatus
  | typeof updatePriceListFailure
  | typeof updatePriceListRequest
  | typeof updatePriceListSuccess
>;

export function priceListReducer(state = defaultState, action: PriceListAction): PriceListState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(resetNotification):
      state = {
        ...state,
        notification: new Map(),
      };
      return state;

    case getType(resetStatus):
      state = {
        ...state,
        status: new Map(),
      };
      return state;

    case getType(fetchPriceListRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(fetchPriceListSuccess):
      return {
        ...state,
        byId: new Map(state.byId).set(action.meta.fetchId, {
          ...action.payload,
          timeRequested: Date.now(),
        }),
        errors: new Map(state.errors).set(action.meta.fetchId, null),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };

    case getType(fetchPriceListFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };

    case getType(updatePriceListFailure):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, action.payload),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };

    case getType(updatePriceListRequest):
      return {
        ...state,
        status: new Map(state.status).set(action.payload.fetchId, FetchStatus.inProgress),
      };

    case getType(updatePriceListSuccess):
      return {
        ...state,
        errors: new Map(state.errors).set(action.meta.fetchId, null),
        notification: new Map(state.notification).set(action.meta.fetchId, action.meta.notification),
        status: new Map(state.status).set(action.meta.fetchId, FetchStatus.complete),
      };
    default:
      return state;
  }
}
