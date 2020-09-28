import { applyMiddleware, combineReducers, createStore, DeepPartial, Reducer, ReducersMapObject, Store } from 'redux';

import { RootState } from './rootReducer';
import { middlewares } from './store';

type MockReducer<S> = ReducersMapObject<S, any> | Reducer<S>;

export function createMockStoreCreator<S>(reducer: MockReducer<S>) {
  const rootReducer = typeof reducer === 'object' ? combineReducers(reducer) : reducer;

  return (initialState?: DeepPartial<S>): Store<RootState, any> => {
    return createStore<RootState, any, any, any>(rootReducer as any, initialState, applyMiddleware(...middlewares));
  };
}
