import { Providers } from 'api/providers';
import { AxiosError } from 'axios';
import { FetchStatus } from 'store/common';
import { ActionType, getType } from 'typesafe-actions';
import {
  fetchSourcesFailure,
  fetchSourcesRequest,
  fetchSourcesSuccess,
} from './actions';

export const stateKey = 'sources';

export type SourcesState = Readonly<{
  sources: Providers;
  error: AxiosError;
  status: FetchStatus;
}>;

export const defaultState: SourcesState = {
  sources: null,
  error: null,
  status: FetchStatus.none,
};

export type SourcesAction = ActionType<
  | typeof fetchSourcesFailure
  | typeof fetchSourcesRequest
  | typeof fetchSourcesSuccess
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
    default:
      return state;
  }
};
