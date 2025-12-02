import type { Org } from '@koku-ui/api/orgs/org';
import type { OrgPathsType, OrgType } from '@koku-ui/api/orgs/org';
import { runOrg } from '@koku-ui/api/orgs/orgUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { createAction } from 'typesafe-actions';

import { FetchStatus } from '../common';
import type { RootState } from '../rootReducer';
import { getFetchId } from './orgCommon';
import { selectOrg, selectOrgError, selectOrgFetchStatus } from './orgSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface OrgActionMeta {
  fetchId: string;
}

export const fetchOrgRequest = createAction('org/request')<OrgActionMeta>();
export const fetchOrgSuccess = createAction('org/success')<Org, OrgActionMeta>();
export const fetchOrgFailure = createAction('org/failure')<AxiosError, OrgActionMeta>();

export function fetchOrg(
  orgPathsType: OrgPathsType,
  orgType: OrgType,
  orgQueryString: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isOrgExpired(getState(), orgPathsType, orgType, orgQueryString)) {
      return;
    }

    const meta: OrgActionMeta = {
      fetchId: getFetchId(orgPathsType, orgType, orgQueryString),
    };

    dispatch(fetchOrgRequest(meta));
    runOrg(orgPathsType, orgType, orgQueryString)
      .then(res => {
        // See https://github.com/project-koku/koku-ui/pull/580
        // const repsonseData = dropCurrentMonthData(res, query);
        dispatch(fetchOrgSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchOrgFailure(err, meta));
      });
  };
}

function isOrgExpired(state: RootState, orgPathsType: OrgPathsType, orgType: OrgType, orgQueryString: string) {
  const orgReport = selectOrg(state, orgPathsType, orgType, orgQueryString);
  const fetchError = selectOrgError(state, orgPathsType, orgType, orgQueryString);
  const fetchStatus = selectOrgFetchStatus(state, orgPathsType, orgType, orgQueryString);
  if (fetchError || fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!orgReport) {
    return true;
  }

  const now = Date.now();
  return now > orgReport.timeRequested + expirationMS;
}
