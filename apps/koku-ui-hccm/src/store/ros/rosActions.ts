import type { RosData, RosType } from 'api/ros';
import { fetchRos as apiGetRos } from 'api/ros';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './rosCommon';
import { selectRosAvailable, selectRosError, selectRosFetchStatus } from './rosSelectors';

interface RosActionMeta {
  fetchId: string;
}

export const fetchRosRequest = createAction('ros/fetch/request')<RosActionMeta>();
export const fetchRosSuccess = createAction('ros/fetch/success')<RosData, RosActionMeta>();
export const fetchRosAvailable = createAction('ros/fetch/available')<boolean, RosActionMeta>();
export const fetchRosFailure = createAction('ros/fetch/failure')<AxiosError, RosActionMeta>();

export function fetchRos(rosType: RosType): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const available = selectRosAvailable(state, rosType, '');
    const fetchError = selectRosError(state, rosType, '');
    const fetchStatus = selectRosFetchStatus(state, rosType, '');

    if (fetchError || typeof available === 'boolean' || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: RosActionMeta = {
      fetchId: getFetchId(rosType, ''),
    };

    dispatch(fetchRosRequest(meta));

    return apiGetRos()
      .then(res => {
        dispatch(fetchRosSuccess(res.data, meta));
        dispatch(fetchRosAvailable(true, meta));
      })
      .catch(err => {
        if (err?.response?.status === 404) {
          dispatch(fetchRosAvailable(false, meta));
          return;
        }
        dispatch(fetchRosFailure(err, meta));
      });
  };
}
