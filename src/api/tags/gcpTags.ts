import axios from 'axios';

import { Tag, TagType } from './tag';

export interface GcpTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/gcp/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<GcpTag>(`${path}?${query}`);
}
