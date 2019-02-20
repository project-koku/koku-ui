import axios, { AxiosRequestConfig } from 'axios';

export interface PagedMetaData {
  count: number;
}

export interface PagedLinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface PagedResponse<D = any> {
  meta: PagedMetaData;
  links: PagedLinks;
  data: D[];
}

export function initApi({ version }: { version: string }) {
  axios.defaults.baseURL = `/r/insights/platform/cost-management/api/${version}/`;
  axios.interceptors.request.use(authInterceptor);
}

export function authInterceptor(
  reqConfig: AxiosRequestConfig
): AxiosRequestConfig {
  return {
    ...reqConfig,
    headers: {
      ...reqConfig.headers,
    },
  };
}
