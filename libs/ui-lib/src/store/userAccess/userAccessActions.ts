import type { UserAccess } from '@koku-ui/api/userAccess';
import type { UserAccessType } from '@koku-ui/api/userAccess';
import { fetchUserAccess as apiGetUserAccess } from '@koku-ui/api/userAccess';
import type { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import type { ThunkAction } from '../common';
import { FetchStatus } from '../common';
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
