import type { ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { RootState } from 'store/rootReducer';

import { getFetchId, resourceStateKey } from './resourceCommon';

export const selectResourceState = (state: RootState) => state[resourceStateKey];

export const selectResource = (
  state: RootState,
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  resourceQueryString: string
) => selectResourceState(state).byId.get(getFetchId(resourcePathsType, resourceType, resourceQueryString));

export const selectResourceFetchStatus = (
  state: RootState,
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  resourceQueryString: string
) => selectResourceState(state).fetchStatus.get(getFetchId(resourcePathsType, resourceType, resourceQueryString));

export const selectResourceError = (
  state: RootState,
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  resourceQueryString: string
) => selectResourceState(state).errors.get(getFetchId(resourcePathsType, resourceType, resourceQueryString));
