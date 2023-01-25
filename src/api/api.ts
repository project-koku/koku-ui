import { authInterceptor as insightsAuthInterceptor } from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import type { AxiosRequestConfig } from 'axios';
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

export function initApi({ version }: { version: string }) {
  axios.defaults.baseURL = `/api/cost-management/${version}/`;
  axios.interceptors.request.use(authInterceptor);
  axios.interceptors.request.use(insightsAuthInterceptor);
}

export function authInterceptor(reqConfig: AxiosRequestConfig) {
  return {
    ...reqConfig,
    headers: {
      ...reqConfig.headers,
    } as any,
  };
}
