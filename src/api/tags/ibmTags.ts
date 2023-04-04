import axios from 'axios';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface IbmTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/gcp/', // Todo: update to use ibm APIs are available
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  return axios.get<IbmTag>(`${path}?${query}`);
}
