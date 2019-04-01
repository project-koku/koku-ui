import { RootState } from 'store/rootReducer';
import { stateKey } from './reducer';

export const sourcesState = (state: RootState) => state[stateKey];

export const sources = (state: RootState) => {
  const srcs = sourcesState(state).sources;
  if (srcs) {
    return srcs.data;
  }
  return [];
};

export const status = (state: RootState) => sourcesState(state).status;

export const error = (state: RootState) => sourcesState(state).error;
