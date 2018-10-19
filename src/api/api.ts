import axios, { AxiosRequestConfig } from 'axios';

export interface PagedResponse<D = any> {
  count: number;
  previous: string;
  next: string;
  results: D[];
}

export function initApi({ version }: { version: string }) {
  axios.defaults.baseURL = `/r/insights/platform/cost-management/api/${version}/`;
  axios.defaults.timeout = 4000;
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
