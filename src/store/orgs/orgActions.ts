import type { Org } from 'api/orgs/org';
import type { OrgPathsType, OrgType } from 'api/orgs/org';
import { runOrg } from 'api/orgs/orgUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { getFetchId } from './orgCommon';
import { selectOrg, selectOrgFetchStatus } from './orgSelectors';

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
  const fetchStatus = selectOrgFetchStatus(state, orgPathsType, orgType, orgQueryString);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!orgReport) {
    return true;
  }

  const now = Date.now();
  return now > orgReport.timeRequested + expirationMS;
}
