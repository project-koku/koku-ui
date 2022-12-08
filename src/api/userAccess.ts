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
  rhel = 'ocp', // Todo: update to use rhel when APIs are available
}

// If the user-access API is called without a query parameter, all types are returned in the response
export function fetchUserAccess(query: string) {
  const insights = (window as any).insights;
  const queryString = query ? `?${query}` : '';
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<UserAccess>(`user-access/${queryString}`);
    });
  } else {
    return axios.get<UserAccess>(`user-access/${queryString}`);
  }
}
