import type { RootState } from 'store/rootReducer';

import type { PageResults } from './types';

export const selectPagination = <T extends PageResults>(stateProjector: (state: RootState) => T) => {
  return (state: RootState) => {
    return getPagination(stateProjector(state));
  };
};

export const getPagination = <T extends PageResults>(payload: T) => {
  if (payload === null) {
    return {
      page: 1,
      perPage: 1,
      count: 0,
    };
  }

  if (payload.links.next !== null) {
    const urlParams = new URLSearchParams(payload.links.next.split('?')[1]);
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) - limit;
    return {
      page: Math.trunc(offset / limit + 1),
      perPage: limit,
      count: payload.meta.count,
    };
  }

  if (payload.links.previous !== null) {
    const urlParams = new URLSearchParams(payload.links.previous.split('?')[1]);
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) + limit;
    return {
      page: Math.trunc(offset / limit + 1),
      perPage: limit,
      count: payload.meta.count,
    };
  }

  const urlParams = new URLSearchParams(payload.links.first.split('?')[1]);
  return {
    page: 1,
    perPage: Number(urlParams.get('limit')),
    count: payload.meta.count,
  };
};
