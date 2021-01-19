import { Org, OrgPathsType, OrgType } from 'api/orgs/org';
import { runOrg } from 'api/orgs/orgUtils';
import { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import { RootState } from 'store/rootReducer';
import { createStandardAction } from 'typesafe-actions';

import { getOrgId } from './orgCommon';
import { selectOrg, selectOrgFetchStatus } from './orgSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface OrgActionMeta {
  orgId: string;
}

export const fetchOrgRequest = createStandardAction('org/request')<OrgActionMeta>();
export const fetchOrgSuccess = createStandardAction('org/success')<Org, OrgActionMeta>();
export const fetchOrgFailure = createStandardAction('org/failure')<AxiosError, OrgActionMeta>();

export function fetchOrg(
  orgPathsType: OrgPathsType,
  orgType: OrgType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isOrgExpired(getState(), orgPathsType, orgType, query)) {
      return;
    }

    const meta: OrgActionMeta = {
      orgId: getOrgId(orgPathsType, orgType, query),
    };

    dispatch(fetchOrgRequest(meta));
    runOrg(orgPathsType, orgType, query)
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

function isOrgExpired(state: RootState, orgPathsType: OrgPathsType, orgType: OrgType, query: string) {
  const orgReport = selectOrg(state, orgPathsType, orgType, query);
  const fetchStatus = selectOrgFetchStatus(state, orgPathsType, orgType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!orgReport) {
    return true;
  }

  const now = Date.now();
  return now > orgReport.timeRequested + expirationMS;
}
