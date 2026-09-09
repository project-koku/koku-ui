import type { RosType } from 'api/ros';
import type { RootState } from 'store/rootReducer';

import { getFetchId, stateKey } from './rosCommon';

export const selectRosState = (state: RootState) => state[stateKey];

// Fetch ROS

export const selectRos = (state: RootState, rosType: RosType, rosQueryString: string) =>
  selectRosState(state).byId.get(getFetchId(rosType, rosQueryString));

export const selectRosAvailable = (state: RootState, rosType: RosType, rosQueryString: string) =>
  selectRosState(state).available.get(getFetchId(rosType, rosQueryString));

export const selectRosFetchStatus = (state: RootState, rosType: RosType, rosQueryString: string) =>
  selectRosState(state).fetchStatus.get(getFetchId(rosType, rosQueryString));

export const selectRosError = (state: RootState, rosType: RosType, rosQueryString: string) =>
  selectRosState(state).errors.get(getFetchId(rosType, rosQueryString));
