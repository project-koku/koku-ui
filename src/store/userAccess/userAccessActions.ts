import { fetchUserAccess as apiGetUserAccess } from 'api/userAccess';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { createAction, createStandardAction } from 'typesafe-actions';

import { getReportId } from './userAccessCommon';

interface UserAccessActionMeta {
  reportId: string;
}

export const fetchUserAccessRequest = createStandardAction('userAccess/fetch/request')<UserAccessActionMeta>();
export const fetchUserAccessSuccess = createStandardAction('userAccess/fetch/success')<
  UserAccess,
  UserAccessActionMeta
>();
export const fetchUserAccessFailure = createStandardAction('userAccess/fetch/failure')<
  AxiosError,
  UserAccessActionMeta
>();

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

export const clearuserAccessFailure = createAction('userAccess/clear/failure');
