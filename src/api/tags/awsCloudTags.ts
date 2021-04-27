import axios from 'axios';

import { Tag, TagType } from './tag';

export interface AwsCloudTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/openshift/infrastructures/aws/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<AwsCloudTag>(`${path}?${query}`);
}
