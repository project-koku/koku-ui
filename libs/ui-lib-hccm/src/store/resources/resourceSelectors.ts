import type { ResourcePathsType, ResourceType } from '@koku-ui/api/resources/resource';

import type { RootState } from '../rootReducer';
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
