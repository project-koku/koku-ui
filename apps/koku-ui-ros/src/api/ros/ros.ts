// For API spec, see https://github.com/RedHatInsights/ros-ocp-backend/blob/main/openapi.json

import type { PagedMetaData, PagedResponse } from 'api/api';

export interface RosData {
  cluster_uuid?: string;
  cluster_alias?: string;
  container?: string; // Not in namespace API
  id?: number;
  last_reported?: string;
  project?: string;
  recommendations?: any;
  source_id?: string;
  workload?: string; // Not in namespace API
  workload_type?: string; // Not in namespace API
}

export interface RosMeta extends PagedMetaData {
  count: number;
  limit?: number;
  offset?: number;
}

export const enum RosNamespace {
  projects = 'projects',
  containers = 'containers',
}

export type RosReport = PagedResponse<RosData, RosMeta>;

export const enum RosType {
  container = 'container',
  ros = 'ros',
  namespace = 'namespace',
}

export const enum RosPathsType {
  recommendation = 'recommendation',
  recommendations = 'recommendations',
}
