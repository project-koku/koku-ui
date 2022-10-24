import type { Resource } from 'api/resources/resource';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import { runResource } from 'api/resources/resourceUtils';
import { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { FetchStatus } from 'store/common';
import type { RootState } from 'store/rootReducer';
import { createAction } from 'typesafe-actions';

import { getResourceId } from './resourceCommon';
import { selectResource, selectResourceFetchStatus } from './resourceSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ResourceActionMeta {
  resourceId: string;
}

export const fetchResourceRequest = createAction('resource/request')<ResourceActionMeta>();
export const fetchResourceSuccess = createAction('resource/success')<Resource, ResourceActionMeta>();
export const fetchResourceFailure = createAction('resource/failure')<AxiosError, ResourceActionMeta>();

export function fetchResource(
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  query: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isResourceExpired(getState(), resourcePathsType, resourceType, query)) {
      return;
    }

    const meta: ResourceActionMeta = {
      resourceId: getResourceId(resourcePathsType, resourceType, query),
    };

    dispatch(fetchResourceRequest(meta));
    runResource(resourcePathsType, resourceType, query)
      .then(res => {
        dispatch(fetchResourceSuccess(res.data, meta));
      })
      .catch(err => {
        dispatch(fetchResourceFailure(err, meta));
      });
  };
}

function isResourceExpired(
  state: RootState,
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  query: string
) {
  const resource = selectResource(state, resourcePathsType, resourceType, query);
  const fetchStatus = selectResourceFetchStatus(state, resourcePathsType, resourceType, query);
  if (fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!resource) {
    return true;
  }

  const now = Date.now();
  return now > resource.timeRequested + expirationMS;
}
