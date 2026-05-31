import type { RootState } from 'store/rootReducer';

import type { PageResults } from './types';

export const selectQuery = <T extends PageResults | null>(stateProjector: (state: RootState) => T, keys: string[]) => {
  return (state: RootState) => {
    const params = getQuery(stateProjector(state));
    return keys.reduce((acc, curr) => {
      return { ...acc, [curr]: params.get(curr) };
    }, {});
  };
};

const getQuery = <T extends PageResults | null>(payload: T) => {
  if (payload === null) {
    return new URLSearchParams();
  }
  const [, search] = payload.links.first.split('?');
  return new URLSearchParams(search);
};
