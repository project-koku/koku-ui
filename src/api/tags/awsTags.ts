import { axiosInstance } from 'api';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface AwsTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/aws/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axiosInstance.get<AwsTag>(`${path}?${query}`);
}
