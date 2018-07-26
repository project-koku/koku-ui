import axios from 'axios';
import { applyMiddleware, compose, createStore, DeepPartial } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer, RootState } from './rootReducer';
import { sessionActions } from './session';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options: any): typeof compose;
  }
}

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ serialize: true })
    : compose;

export const middlewares = [thunk];

export function configureStore(initialState: DeepPartial<RootState>) {
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  const store = createStore(rootReducer, initialState, enhancer);

  axios.interceptors.response.use(null, error => {
    if (
      error &&
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      store.dispatch(sessionActions.logout());
    }
    return Promise.reject(error);
  });

  return store;
}
