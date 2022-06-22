import axios from 'axios';

import { Tag, TagType } from './tag';

export interface OciTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/oci/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<OciTag>(`${path}?${query}`);
}
