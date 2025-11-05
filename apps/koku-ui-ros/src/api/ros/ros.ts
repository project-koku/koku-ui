import type { PagedMetaData, PagedResponse } from 'api/api';

export interface RosData {
  cluster_uuid?: string;
  cluster_alias?: string;
  container?: string;
  id?: number;
  last_reported?: string;
  project?: string;
  recommendations?: any;
  source_id?: string;
  workload?: string;
  workload_type?: string;
}

export interface RosMeta extends PagedMetaData {
  count: number;
  limit?: number;
  offset?: number;
}

export type RosReport = PagedResponse<RosData, RosMeta>;

export const enum RosType {
  ros = 'ros',
}

export const enum RosPathsType {
  recommendation = 'recommendation',
  recommendations = 'recommendations',
}
