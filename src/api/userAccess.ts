import { axiosInstance } from 'api';

import type { PagedLinks, PagedMetaData } from './api';

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

// eslint-disable-next-line no-shadow
export const enum UserAccessType {
  all = 'all',
  aws = 'aws',
  azure = 'azure',
  cost_model = 'cost_model',
  explorer = 'explorer',
  gcp = 'gcp',
  ibm = 'ibm',
  oci = 'oci',
  ocp = 'ocp',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  rhel = 'ocp', // Todo: update to use RHEL when APIs are available
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  ros = 'ocp',
  settings = 'settings',
}

// If the user-access API is called without a query parameter, all types are returned in the response
export function fetchUserAccess(query: string) {
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<UserAccess>(`user-access/${queryString}`);
}
