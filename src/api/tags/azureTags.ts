import axios from 'axios';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface AzureTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/azure/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<AzureTag>(`${path}?${query}`);
}
