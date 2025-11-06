import { configureStore as createStore } from '@reduxjs/toolkit';
import type { Reducer, ReducersMapObject, Store } from 'redux';
import { combineReducers } from 'redux';

import type { RootState } from './rootReducer';
import { middleware } from './store';

type MockReducer<S> = ReducersMapObject<S, any> | Reducer<S>;

export function createMockStoreCreator<S>(reducer: MockReducer<S>) {
  const rootReducer = typeof reducer === 'object' ? combineReducers(reducer) : reducer;

  return (initialState?: Partial<S>): Store<RootState, any> => {
    return createStore<RootState, any, any, any>({
      middleware,
      preloadedState: initialState as any,
      reducer: rootReducer as any,
    });
  };
}
