import type { PagedLinks, PagedMetaData } from './api';
import axiosInstance from './api';

export interface UserAccessData {
  access?: boolean;
  type?: UserAccessType;
  write?: boolean;
}

export interface UserAccess {
  meta: PagedMetaData;
  links?: PagedLinks;
  data: UserAccessData[] | boolean;
}

export const enum UserAccessType {
  all = 'all',
  aws = 'aws',
  azure = 'azure',
  cost_model = 'cost_model',
  explorer = 'explorer',
  gcp = 'gcp',
  ocp = 'ocp',
  settings = 'settings',
}

// If the user-access API is called without a query parameter, all types are returned in the response
export function fetchUserAccess(query: string) {
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<UserAccess>(`user-access/${queryString}`);
}
