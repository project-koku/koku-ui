import type { Resource } from '@koku-ui/api/resources/resource';
import type { ResourcePathsType, ResourceType } from '@koku-ui/api/resources/resource';
import { runResource } from '@koku-ui/api/resources/resourceUtils';
import type { AxiosError } from 'axios';
import type { ThunkAction } from 'redux-thunk';
import { createAction } from 'typesafe-actions';

import { FetchStatus } from '../common';
import type { RootState } from '../rootReducer';
import { getFetchId } from './resourceCommon';
import { selectResource, selectResourceError, selectResourceFetchStatus } from './resourceSelectors';

const expirationMS = 30 * 60 * 1000; // 30 minutes

interface ResourceActionMeta {
  fetchId: string;
}

export const fetchResourceRequest = createAction('resource/request')<ResourceActionMeta>();
export const fetchResourceSuccess = createAction('resource/success')<Resource, ResourceActionMeta>();
export const fetchResourceFailure = createAction('resource/failure')<AxiosError, ResourceActionMeta>();

export function fetchResource(
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  resourceQueryString: string
): ThunkAction<void, RootState, void, any> {
  return (dispatch, getState) => {
    if (!isResourceExpired(getState(), resourcePathsType, resourceType, resourceQueryString)) {
      return;
    }

    const meta: ResourceActionMeta = {
      fetchId: getFetchId(resourcePathsType, resourceType, resourceQueryString),
    };

    dispatch(fetchResourceRequest(meta));
    runResource(resourcePathsType, resourceType, resourceQueryString)
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
  resourceQueryString: string
) {
  const resource = selectResource(state, resourcePathsType, resourceType, resourceQueryString);
  const fetchError = selectResourceError(state, resourcePathsType, resourceType, resourceQueryString);
  const fetchStatus = selectResourceFetchStatus(state, resourcePathsType, resourceType, resourceQueryString);
  if (fetchError || fetchStatus === FetchStatus.inProgress) {
    return false;
  }

  if (!resource) {
    return true;
  }

  const now = Date.now();
  return now > resource.timeRequested + expirationMS;
}
