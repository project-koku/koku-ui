import axios from 'axios';
import { applyMiddleware, compose, createStore, DeepPartial } from 'redux';
import logger from 'redux-logger';
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
export const getMiddlewares = (nameSpace, defaultMiddlewares = middlewares) => {
  return nameSpace === 'koku-dev'
    ? [...defaultMiddlewares, logger]
    : defaultMiddlewares;
};
export function configureStore(
  initialState: DeepPartial<RootState>,
  appMiddleware = getMiddlewares(process.env.APP_NAMESPACE)
) {
  const enhancer = composeEnhancers(applyMiddleware(...appMiddleware));
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
