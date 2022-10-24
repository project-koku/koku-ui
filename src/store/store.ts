import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import axios from 'axios';
import type { DeepPartial } from 'redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import type { RootState } from './rootReducer';
import { rootReducer } from './rootReducer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options: any): typeof compose;
  }
}

const composeEnhancers =
  typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: true })
    : compose;

export const middlewares = [thunk, notificationsMiddleware()];

export function configureStore(initialState: DeepPartial<RootState>) {
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  const store = createStore(rootReducer, initialState as any, enhancer);

  axios.interceptors.response.use(null, error => {
    return Promise.reject(error);
  });

  return store;
}
