import type { RosType } from 'api/ros';

export const stateKey = 'ros';

export function getFetchId(rosType: RosType, queryString: string) {
  return queryString ? `${rosType}--${queryString}` : `${rosType}`;
}
