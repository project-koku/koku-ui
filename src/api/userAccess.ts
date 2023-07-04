import axios from 'axios';

import type { PagedLinks, PagedMetaData } from './api';

export interface UserAccessData {
  access?: boolean;
  type?: UserAccessType;
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
  rhel = 'ocp', // Todo: update to use RHEL when APIs are available
  ros = 'ocp',
  settings = 'settings',
}

// If the user-access API is called without a query parameter, all types are returned in the response
export function fetchUserAccess(query: string) {
  const queryString = query ? `?${query}` : '';
  return axios.get<UserAccess>(`user-access/${queryString}`);
}
