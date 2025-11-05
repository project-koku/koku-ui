import type { RosPathsType, RosType } from 'api/ros/ros';
export const rosStateKey = 'ros';

export function getFetchId(rosPathsType: RosPathsType, rosType: RosType, rosQueryString: string) {
  return `${rosPathsType}--${rosType}--${rosQueryString}`;
}
