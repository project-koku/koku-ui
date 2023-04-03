import axios from 'axios';

import type { Tag } from './tag';
import { TagType } from './tag';

export interface GcpTag extends Tag {}

export const TagTypePaths: Partial<Record<TagType, string>> = {
  [TagType.tag]: 'tags/gcp/',
};

export function runTag(tagType: TagType, query: string) {
  const path = TagTypePaths[tagType];
  const fetch = () => axios.get<GcpTag>(`${path}?${query}`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
