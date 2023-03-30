import type { PagedMetaData, PagedResponse } from 'api/api';

export interface RosData {
  cluster_uuid?: string;
  cluster_alias?: string;
  container?: string;
  id?: number;
  project?: string;
  last_reported?: string;
  workload?: string;
  workload_type?: string;
}

export interface RosMeta extends PagedMetaData {
  count: number;
  limit?: number;
  offset?: number;
}

export interface RosReport extends PagedResponse<RosData, RosMeta> {}

// eslint-disable-next-line no-shadow
export const enum RosType {
  ros = 'ros',
}

// eslint-disable-next-line no-shadow
export const enum RosPathsType {
  recommendation = 'recommendation',
  recommendations = 'recommendations',
}
