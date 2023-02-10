import axios from 'axios';

import type { Ros, RosData, RosItem, RosItemValue, RosMeta, RosValue } from './ros';
import { RosType } from './ros';

export interface RecommendationItem extends RosItem {
  capacity?: RosValue;
  cluster?: string;
  clusters?: string[];
  limit?: RosValue;
  node?: string;
  project?: string;
  request?: RosValue;
}

export interface RecommendationData extends RosData {
  // TBD...
}

export interface RecommendationMeta extends RosMeta {
  total?: {
    capacity?: RosValue;
    cost?: RosItemValue;
    infrastructure?: RosItemValue;
    limit?: RosValue;
    request?: RosValue;
    supplementary?: RosItemValue;
    usage?: RosValue;
  };
}

export interface Recommendation extends Ros {
  meta: RecommendationMeta;
  data: RecommendationData[];
}

export const RosTypePaths: Partial<Record<RosType, string>> = {
  [RosType.cost]: 'reports/openshift/costs/',
};

export function runRos(reportType: RosType, query: string) {
  const path = RosTypePaths[reportType];
  return axios.get<Recommendation>(`${path}?${query}`);
}
