import { TagPathsType, TagType } from 'api/tags/tag';
import type { RootState } from 'store/rootReducer';

import { getTagId, tagStateKey } from './tagCommon';

export const selectTagState = (state: RootState) => state[tagStateKey];

export const selectTag = (state: RootState, tagPathsType: TagPathsType, tagType: TagType, query: string) =>
  selectTagState(state).byId.get(getTagId(tagPathsType, tagType, query));

export const selectTagFetchStatus = (state: RootState, tagPathsType: TagPathsType, tagType: TagType, query: string) =>
  selectTagState(state).fetchStatus.get(getTagId(tagPathsType, tagType, query));

export const selectTagError = (state: RootState, tagPathsType: TagPathsType, tagType: TagType, query: string) =>
  selectTagState(state).errors.get(getTagId(tagPathsType, tagType, query));
