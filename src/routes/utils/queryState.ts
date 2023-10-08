import type * as H from 'history';
import { cloneDeep } from 'lodash';

export function clearQueryState(location: H.Location, key: string) {
  if (location && location.state && location.state[key]) {
    location.state[key] = undefined;
  }
}

export function getQueryState(location: H.Location, key: string) {
  return location && location.state && location.state[key] ? cloneDeep(location.state[key]) : undefined;
}
