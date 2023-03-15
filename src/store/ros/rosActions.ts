import type { RosPathsType, RosType } from 'api/ros/ros';
import type { RosReport } from 'api/ros/ros';
import { runRosReport } from 'api/ros/rosUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './rosCommon';
import { selectRos, selectRosFetchStatus } from './rosSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface RosActionMeta {
  fetchId: string;
}

export const fetchRosRequest = createAction('ros/request')<RosActionMeta>();
export const fetchRosSuccess = createAction('ros/success')<RosReport, RosActionMeta>();
export const fetchRosFailure = createAction('ros/failure')<AxiosError, RosActionMeta>();

export function fetchRosReport(rosPathsType: RosPathsType, rosType: RosType, rosQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    if (!isRosExpired(getState(), rosPathsType, rosType, rosQueryString)) {
      return;
    }

    const meta: RosActionMeta = {
      fetchId: getFetchId(rosPathsType, rosType, rosQueryString),
    };

    dispatch(fetchRosRequest(meta));
    runRosReport(rosPathsType, rosType, rosQueryString)
      .then(res => {
        // See https://github.com/project-koku/koku-ui/pull/580
        // const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchRosSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchRosFailure(err, meta));
      });
  };
}

function isRosExpired(state: RootState, rosPathsType: RosPathsType, rosType: RosType, rosQueryString: string) {
  const ros = selectRos(state, rosPathsType, rosType, rosQueryString);
  const fetchStatus = selectRosFetchStatus(state, rosPathsType, rosType, rosQueryString);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!ros) {
    return true;
  }

  const now = Date.now();
  return now > ros.timeRequested + expirationMS;
}
