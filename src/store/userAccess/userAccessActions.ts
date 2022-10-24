import type { UserAccess } from 'api/userAccess';
import { fetchUserAccess as apiGetUserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { createAction } from 'typesafe-actions';

import { getReportId } from './userAccessCommon';

interface UserAccessActionMeta {
  reportId: string;
}

export const fetchUserAccessRequest = createAction('userAccess/fetch/request')<UserAccessActionMeta>();
export const fetchUserAccessSuccess = createAction('userAccess/fetch/success')<UserAccess, UserAccessActionMeta>();
export const fetchUserAccessFailure = createAction('userAccess/fetch/failure')<AxiosError, UserAccessActionMeta>();

export function fetchUserAccess(reportType: UserAccessType, query: string) {
  return dispatch => {
    const meta: UserAccessActionMeta = {
      reportId: getReportId(reportType, query),
    };

    dispatch(fetchUserAccessRequest(meta));

    return apiGetUserAccess(query)
      .then(res => {
        dispatch(fetchUserAccessSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchUserAccessFailure(err, meta));
      });
  };
}
