import { axiosInstance } from 'api';

export interface RosData {
  openapi: string;
  info: {
    description: string;
    license: {
      name: string;
      url: string;
    };
    title: string;
    version: string;
  };
  paths: Record<string, unknown>;
}

export const enum RosType {
  openApi = 'open_api',
}

// A missing OpenAPI spec means ROS is unavailable (for example, on-prem).
export function fetchRos() {
  return axiosInstance.get<RosData>(`recommendations/openshift/openapi.json`);
}
