import axiosInstance from '@koku-ui/api/api';
import { configureStore as createStore } from '@reduxjs/toolkit';
import type { Store } from 'redux';

import type { RootState } from './rootReducer';
import { rootReducer } from './rootReducer';

// See https://redux-toolkit.js.org/api/serializabilityMiddleware
// and https://github.com/RedHatInsights/insights-advisor-frontend/blob/master/src/Store/index.js
export const middleware = getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoreActions: true,
      ignoreState: true,
    },
  });

export function configureStore(initialState: Partial<RootState>): Store<RootState> {
  const store = createStore({
    middleware,
    preloadedState: initialState as any,
    reducer: rootReducer,
  });

  axiosInstance.interceptors.response.use(null, error => {
    return Promise.reject(error);
  });

  return store;
}
