import { ResourcePathsType, ResourceType } from 'api/resources/resource';
import type { RootState } from 'store/rootReducer';

import { getResourceId, resourceStateKey } from './resourceCommon';

export const selectResourceState = (state: RootState) => state[resourceStateKey];

export const selectResource = (
  state: RootState,
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  query: string
) => selectResourceState(state).byId.get(getResourceId(resourcePathsType, resourceType, query));

export const selectResourceFetchStatus = (
  state: RootState,
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  query: string
) => selectResourceState(state).fetchStatus.get(getResourceId(resourcePathsType, resourceType, query));

export const selectResourceError = (
  state: RootState,
  resourcePathsType: ResourcePathsType,
  resourceType: ResourceType,
  query: string
) => selectResourceState(state).errors.get(getResourceId(resourcePathsType, resourceType, query));
