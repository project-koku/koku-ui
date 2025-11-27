import type { Providers } from '@koku-ui/api/providers';
import type { AxiosError } from 'axios';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { FetchStatus } from '../common';
import { resetState } from '../ui/uiActions';
import { fetchSourcesFailure, fetchSourcesRequest, fetchSourcesSuccess, updateFilterToolbar } from './actions';

export const stateKey = 'sources';

export type SourcesState = Readonly<{
  sources: Providers;
  error: AxiosError;
  status: FetchStatus;
  currentFilterType: string;
  currentFilterValue: string;
  filter: string;
}>;

export const defaultState: SourcesState = {
  sources: null,
  error: null,
  status: FetchStatus.none,
  currentFilterType: 'name',
  currentFilterValue: '',
  filter: '',
};

export type SourcesAction = ActionType<
  | typeof fetchSourcesFailure
  | typeof fetchSourcesRequest
  | typeof fetchSourcesSuccess
  | typeof updateFilterToolbar
  | typeof resetState
>;

export const reducer = (state: SourcesState = defaultState, action: SourcesAction): SourcesState => {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(fetchSourcesRequest):
      return {
        ...state,
        status: FetchStatus.inProgress,
      };
    case getType(fetchSourcesSuccess):
      return {
        ...state,
        currentFilterValue: '',
        filter: state.currentFilterValue,
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
