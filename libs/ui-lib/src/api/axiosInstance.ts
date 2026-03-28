import type { AxiosInstance } from 'axios';
import axios from 'axios';

export interface PagedMetaData {
  count: number;
}

export interface PagedLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface PagedResponse<D = any, M = any> {
  meta: M;
  links: PagedLinks;
  data: D[];
}

// Create an Axios instance
//
// Note: Setting global defaults may affect the base URL in Cost Management, HCS, and OCM, when navigating between apps
// See https://redhat.atlassian.net/browse/RHCLOUD-25573
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api/cost-management/v1/',
  headers: {
    'Cache-Control': 'no-cache',
  },
});

export { axiosInstance };
export default axiosInstance;
