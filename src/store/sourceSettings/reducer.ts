import { Providers } from 'api/providers';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchSourcesFailure,
  fetchSourcesRequest,
  fetchSourcesSuccess,
  updateFilterToolbar,
} from './actions';

export const stateKey = 'sources';

export type SourcesState = Readonly<{
  sources: Providers;
  error: AxiosError;
  status: FetchStatus;
  currentFilterType: string;
  currentFilterValue: string;
}>;

export const defaultState: SourcesState = {
  sources: null,
  error: null,
  status: FetchStatus.none,
  currentFilterType: 'name',
  currentFilterValue: '',
};

export type SourcesAction = ActionType<
  | typeof fetchSourcesFailure
  | typeof fetchSourcesRequest
  | typeof fetchSourcesSuccess
  | typeof updateFilterToolbar
>;

export const reducer = (
  state: SourcesState = defaultState,
  action: SourcesAction
): SourcesState => {
  switch (action.type) {
    case getType(fetchSourcesRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(fetchSourcesSuccess):
      return {
        ...state,
        currentFilterType: 'name',
        currentFilterValue: '',
        status: FetchStatus.complete,
        error: null,
        sources: action.payload.data,
      };
    case getType(fetchSourcesFailure):
      return {
        ...state,
        status: FetchStatus.complete,
        error: action.payload,
      };
    case getType(updateFilterToolbar):
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
