import { axiosInstance } from 'api';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface RhelTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/openshift/', // Todo: update to use ibm APIs are available
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axiosInstance.get<RhelTag>(`${path}?${query}`);
}
