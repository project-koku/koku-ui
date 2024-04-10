import { axiosInstance } from 'api';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface OciTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/oci/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axiosInstance.get<OciTag>(`${path}?${query}`);
}
