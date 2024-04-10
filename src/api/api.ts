import type { AxiosInstance, AxiosRequestConfig } from 'axios';
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

// export function initApi({ version }: { version: string }) {
//   axios.defaults.baseURL = `/api/cost-management/${version}/`;
//   axios.interceptors.request.use(authInterceptor);
// }

export function authInterceptor(reqConfig: AxiosRequestConfig) {
  return {
    ...reqConfig,
    headers: {
      ...reqConfig.headers,
    } as any,
  };
}

// Create an instance instead of setting global defaults
// Setting global values affects Cost Management APIs in OCM and HCS, when navigating between apps
//
// See https://issues.redhat.com/browse/RHCLOUD-25573
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api/cost-management/v1/',
  headers: { 'X-Custom-Header': 'foobar' },
});

axiosInstance.interceptors.request.use(authInterceptor);

export default axiosInstance;
