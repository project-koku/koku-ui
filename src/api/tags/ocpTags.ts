import axios from 'axios';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface OcpTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/openshift/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<OcpTag>(`${path}?${query}`);
}
