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

export const currentFilterValue = (state: RootState) =>
  sourcesState(state).currentFilterValue;

export const currentFilterType = (state: RootState) =>
  sourcesState(state).currentFilterType;

export const query = (state: RootState) => {
  const sourcesPayload = sourcesState(state).sources;
  if (sourcesPayload === null) {
    return {
      name: null,
      type: null,
      offset: null,
      limit: null,
    };
  }
  const urlParams = new URLSearchParams(
    sourcesPayload.links.first.split('?')[1]
  );
  return {
    name: urlParams.get('name'),
    type: urlParams.get('type'),
    offset: urlParams.get('offset'),
    limit: urlParams.get('limit'),
  };
};

export const pagination = (state: RootState) => {
  const sourcesPayload = sourcesState(state).sources;
  if (sourcesPayload === null) {
    return {
      page: 1,
      perPage: 1,
      count: 0,
    };
  }

  let urlParams = null;
  if (sourcesPayload.links.next !== null) {
    urlParams = new URLSearchParams(sourcesPayload.links.next.split('?')[1]);
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) - limit;
    return {
      page: offset / limit + 1,
      perPage: limit,
      count: sourcesPayload.meta.count,
    };
  }

  if (sourcesPayload.links.previous !== null) {
    urlParams = new URLSearchParams(
      sourcesPayload.links.previous.split('?')[1]
    );
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) + limit;
    return {
      page: offset / limit + 1,
      perPage: limit,
      count: sourcesPayload.meta.count,
    };
  }

  urlParams = new URLSearchParams(sourcesPayload.links.first.split('?')[1]);
  return {
    page: 1,
    perPage: Number(urlParams.get('limit')),
    count: sourcesPayload.meta.count,
  };
};
