import type { TagPathsType, TagType } from 'api/tags/tag';

export const tagStateKey = 'tag';

export function getFetchId(tagPathsType: TagPathsType, tagType: TagType, tagQueryString: string) {
  return `${tagPathsType}--${tagType}--${tagQueryString}`;
}
