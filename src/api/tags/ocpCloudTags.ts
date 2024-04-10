import { axiosInstance } from 'api';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface OcpCloudTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/openshift/infrastructures/all/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axiosInstance.get<OcpCloudTag>(`${path}?${query}`);
}
