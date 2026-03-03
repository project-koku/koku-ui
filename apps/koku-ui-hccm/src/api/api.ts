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

function authInterceptor(reqConfig: AxiosRequestConfig) {
  return {
    ...reqConfig,
    headers: {
      ...(reqConfig?.headers && reqConfig.headers),
    } as any,
  };
}

// Create an Axios instance
//
// Note: Setting global defaults may affect the base URL in Cost Management, HCS, and OCM, when navigating between apps
// See https://issues.redhat.com/browse/RHCLOUD-25573
const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/api/cost-management/v1/',
  headers: {
    'Cache-Control': 'no-cache',
  },
});

axiosInstance.interceptors.request.use(authInterceptor);

export default axiosInstance;
