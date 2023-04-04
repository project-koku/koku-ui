import axios from 'axios';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface AzureOcpTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/openshift/infrastructures/azure/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<AzureOcpTag>(`${path}?${query}`);
}
