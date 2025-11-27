import type { TagPathsType, TagType } from '@koku-ui/api/tags/tag';

import type { RootState } from '../rootReducer';
import { getFetchId, tagStateKey } from './tagCommon';

export const selectTagState = (state: RootState) => state[tagStateKey];

export const selectTag = (state: RootState, tagPathsType: TagPathsType, tagType: TagType, tagQueryString: string) =>
  selectTagState(state).byId.get(getFetchId(tagPathsType, tagType, tagQueryString));

export const selectTagFetchStatus = (
  state: RootState,
  tagPathsType: TagPathsType,
  tagType: TagType,
  tagQueryString: string
) => selectTagState(state).fetchStatus.get(getFetchId(tagPathsType, tagType, tagQueryString));

export const selectTagError = (
  state: RootState,
  tagPathsType: TagPathsType,
  tagType: TagType,
  tagQueryString: string
) => selectTagState(state).errors.get(getFetchId(tagPathsType, tagType, tagQueryString));
