import axios from 'axios';

import { Tag, TagType } from './tag';

export interface IbmTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/ibm/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<IbmTag>(`${path}?${query}`);
}
