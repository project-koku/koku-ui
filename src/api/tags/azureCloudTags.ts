import axios from 'axios';

import { Tag, TagType } from './tag';

export interface AzureCloudTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/openshift/infrastructures/azure/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<AzureCloudTag>(`${path}?${query}`);
}
