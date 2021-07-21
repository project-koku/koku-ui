import { selectPagination } from 'store/djangoUtils/pagination';
import { selectQuery } from 'store/djangoUtils/query';
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

export const currentFilterValue = (state: RootState) => sourcesState(state).currentFilterValue;

export const currentFilterType = (state: RootState) => sourcesState(state).currentFilterType;

export const query = selectQuery(
  (state: RootState) => sourcesState(state).sources,
  ['name', 'type', 'offset', 'limit']
);

export const pagination = selectPagination((state: RootState) => sourcesState(state).sources);
