import { Providers } from 'api/providers';
import { AxiosError } from 'axios';
import { ActionType, getType } from 'typesafe-actions';
import { FetchStatus } from '../common';
import {
  addProviderFailure,
  addProviderRequest,
  addProviderSuccess,
  clearProviderFailure,
  getProvidersFailure,
  getProvidersRequest,
  getProvidersSuccess,
} from './providersActions';

export type ProvidersAction = ActionType<
  | typeof addProviderFailure
  | typeof addProviderRequest
  | typeof addProviderSuccess
  | typeof clearProviderFailure
  | typeof getProvidersFailure
  | typeof getProvidersRequest
  | typeof getProvidersSuccess
>;

export type ProvidersState = Readonly<{
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}>;

export const defaultState: ProvidersState = {
  providers: null,
  providersError: null,
  providersFetchStatus: FetchStatus.none,
};

export const stateKey = 'providers';

export function providersReducer(
  state = defaultState,
  action: ProvidersAction
): ProvidersState {
  switch (action.type) {
    case getType(addProviderRequest):
      return {
        ...state,
        providersFetchStatus: FetchStatus.inProgress,
      };
    case getType(addProviderSuccess):
      return {
        ...state,
        providers: {
          meta: { count: 1 },
          data: [action.payload],
        },
        providersError: null,
        providersFetchStatus: FetchStatus.complete,
      };
    case getType(addProviderFailure):
      return {
        ...state,
        providersError: action.payload,
        providersFetchStatus: FetchStatus.complete,
      };
    case getType(clearProviderFailure):
      return {
        ...state,
        providersError: null,
      };
    case getType(getProvidersRequest):
      return {
        ...state,
        providersFetchStatus: FetchStatus.inProgress,
      };
    case getType(getProvidersSuccess):
      return {
        ...state,
        providers: action.payload,
        providersError: null,
        providersFetchStatus: FetchStatus.complete,
      };
    case getType(getProvidersFailure):
      return {
        ...state,
        providers: null,
        providersError: action.payload,
        providersFetchStatus: FetchStatus.complete,
      };
    default:
      return state;
  }
}
