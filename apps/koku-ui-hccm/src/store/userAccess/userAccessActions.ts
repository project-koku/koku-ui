import type { UserAccess } from 'api/userAccess';
import type { UserAccessType } from 'api/userAccess';
import { fetchUserAccess as apiGetUserAccess } from 'api/userAccess';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'store/common';
import { FetchStatus } from 'store/common';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './userAccessCommon';
import { selectUserAccessError, selectUserAccessFetchStatus } from './userAccessSelectors';

interface UserAccessActionMeta {
  fetchId: string;
}

export const fetchUserAccessRequest = createAction('userAccess/fetch/request')<UserAccessActionMeta>();
export const fetchUserAccessSuccess = createAction('userAccess/fetch/success')<UserAccess, UserAccessActionMeta>();
export const fetchUserAccessFailure = createAction('userAccess/fetch/failure')<AxiosError, UserAccessActionMeta>();

export function fetchUserAccess(userAccessType: UserAccessType, userAccessQueryString: string): ThunkAction {
  return (dispatch, getState) => {
    const state = getState();
    const fetchError = selectUserAccessError(state, userAccessType, userAccessQueryString);
    const fetchStatus = selectUserAccessFetchStatus(state, userAccessType, userAccessQueryString);

    if (fetchError || fetchStatus === FetchStatus.inProgress) {
      return;
    }

    const meta: UserAccessActionMeta = {
      fetchId: getFetchId(userAccessType, userAccessQueryString),
    };

    dispatch(fetchUserAccessRequest(meta));

    return apiGetUserAccess(userAccessQueryString)
      .then(res => {
        dispatch(fetchUserAccessSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchUserAccessFailure(err, meta));
      });
  };
}
