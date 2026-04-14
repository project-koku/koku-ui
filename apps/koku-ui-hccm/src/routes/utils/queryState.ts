import type * as H from 'history';
import { cloneDeep } from 'lodash';

// Mutates location.state in memory only -- must call navigate to replace history
export function clearQueryState(location: H.Location, key: string) {
  if (location?.state?.[key]) {
    location.state[key] = undefined;
  }
}

export function getQueryState(location: H.Location, key: string) {
  return location?.state?.[key] ? cloneDeep(location?.state[key]) : undefined;
}
