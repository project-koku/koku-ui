import type { TagPathsType, TagType } from 'api/tags/tag';

export const tagStateKey = 'tag';

export function getTagId(tagPathsType: TagPathsType, tagType: TagType, query: string) {
  return `${tagPathsType}--${tagType}--${query}`;
}
